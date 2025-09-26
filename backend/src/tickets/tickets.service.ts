import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { pool } from '../db/mysql';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Event, EventDocument } from '../mongo/schemas/event.schema';
import { Role } from 'src/common/roles.decorator';

@Injectable()
export class TicketsService {
  constructor(
    @InjectModel(Event.name) private readonly eventModel: Model<EventDocument>,
  ) {}

  async createTicket(data: {
    title: string;
    description: string;
    priority: 'LOW' | 'MEDIUM' | 'HIGH';
    created_by: number;
  }) {
    const [res]: any = await pool.query(
      'INSERT INTO tickets(title, description, priority, created_by) VALUES (?, ?, ?, ?)',
      [data.title, data.description, data.priority, data.created_by],
    );
    const id = res.insertId as number;
    await this.eventModel.create({
      type: 'TICKET_CREATED',
      ticketId: id,
      actorId: data.created_by,
      payload: { priority: data.priority },
    });
    return { id, ...data, status: 'OPEN' };
  }

  async getTicket(id: number, user: { id: number; role: 'user' | 'admin' }) {
    const [rows]: any = await pool.query(
      `SELECT t.*, u1.name AS created_by_name, u2.email AS assigned_to_email, u2.name AS assigned_to_name
       FROM tickets t
       JOIN users u1 ON u1.id=t.created_by
       LEFT JOIN users u2 ON u2.id=t.assigned_to
       WHERE t.id=?`,
      [id],
    );
    const t = rows[0];
    if (!t) throw new NotFoundException('Ticket not found');
    if (
      user.role !== 'admin' &&
      t.created_by !== user.id &&
      t.assigned_to !== user.id
    )
      throw new ForbiddenException();
    return t;
  }

  async listTickets(
    q: string | undefined,
    status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | undefined,
    page = 1,
    limit = 10,
    user: { id: number; role: Role },
  ) {
    const _page = Math.max(1, Number.isFinite(+page) ? +page : 1);
    const _limit = Math.min(
      100,
      Math.max(1, Number.isFinite(+limit) ? +limit : 10),
    );
    const offset = (_page - 1) * _limit;

    const where: string[] = [];
    const params: any[] = [];

    if (status) {
      where.push('t.status = ?');
      params.push(status);
    }

    if (q && q.trim()) {
      where.push('(t.title LIKE ? OR t.description LIKE ?)');
      params.push(`%${q}%`, `%${q}%`);
    }

    // RBAC: non-admin sees only own tickets
    if (user.role !== 'admin') {
      where.push('(t.created_by = ? OR t.assigned_to = ?)');
      params.push(user.id, user.id);
    }

    const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';

    // 1) total count (no need to join users for count)
    const [countRows]: any = await pool.query(
      `SELECT COUNT(*) AS total
         FROM tickets t
         ${whereSql}`,
      params,
    );
    const total = Number(countRows[0]?.total ?? 0);

    // 2) page of rows
    const [rows]: any = await pool.query(
      `SELECT t.*,
              u1.email AS created_by_email,
              u1.name AS created_by_name,
              u2.email AS assigned_to_email,
              u2.name AS assigned_to_name
         FROM tickets t
         JOIN users u1 ON u1.id = t.created_by
         LEFT JOIN users u2 ON u2.id = t.assigned_to
         ${whereSql}
         ORDER BY t.created_at DESC
         LIMIT ? OFFSET ?`,
      [...params, _limit, offset],
    );

    return {
      items: rows as any[],
      page: _page,
      limit: _limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / _limit)),
    };
  }

  async updateTicket(
    id: number,
    partial: any,
    user: { id: number; role: 'user' | 'admin' },
  ) {
    const t = await this.getTicket(id, user); // includes auth check for non-admin
    if (user.role !== 'admin' && t.created_by !== user.id)
      throw new ForbiddenException();
    const fields: string[] = [];
    const params: any[] = [];
    for (const k of ['title', 'description', 'status', 'priority']) {
      if (partial[k] !== undefined) {
        fields.push(`${k}=?`);
        params.push(partial[k]);
      }
    }
    if (fields.length === 0) return t;
    params.push(id);
    await pool.query(
      `UPDATE tickets SET ${fields.join(', ')} WHERE id=?`,
      params,
    );
    if (partial.status)
      await this.eventModel.create({
        type: 'STATUS_CHANGED',
        ticketId: id,
        actorId: user.id,
        payload: { status: partial.status },
      });
    return this.getTicket(id, user);
  }

  async assignTicket(
    id: number,
    assigned_to: number,
    user: { id: number; role: 'user' | 'admin' },
  ) {
    if (user.role !== 'admin') throw new ForbiddenException();
    await pool.query('UPDATE tickets SET assigned_to=? WHERE id=?', [
      assigned_to,
      id,
    ]);
    await this.eventModel.create({
      type: 'ASSIGNED',
      ticketId: id,
      actorId: user.id,
      payload: { assigned_to },
    });
    return this.getTicket(id, user);
  }
}
