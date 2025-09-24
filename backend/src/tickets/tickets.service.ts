import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { pool } from '../db/mysql';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Event, EventDocument } from '../mongo/schemas/event.schema';

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
      `SELECT t.*, u1.email AS created_by_email, u2.email AS assigned_to_email
       FROM tickets t
       JOIN users u1 ON u1.id=t.created_by
       LEFT JOIN users u2 ON u2.id=t.assigned_to
       WHERE t.id=?`,
      [id],
    );
    const t = rows[0];
    if (!t) throw new NotFoundException('Ticket not found');
    if (user.role !== 'admin' && t.created_by !== user.id)
      throw new ForbiddenException();
    return t;
  }

  async listTickets(
    q: string | undefined,
    status: string | undefined,
    page = 1,
    limit = 10,
    user: { id: number; role: 'user' | 'admin' },
  ) {
    const where: string[] = [];
    const params: any[] = [];
    if (status) {
      where.push('t.status=?');
      params.push(status);
    }
    if (q) {
      where.push('(t.title LIKE ? OR t.description LIKE ?)');
      params.push(`%${q}%`, `%${q}%`);
    }
    if (user.role !== 'admin') {
      where.push('t.created_by=?');
      params.push(user.id);
    }
    const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';
    const offset = (page - 1) * limit;
    const [rows]: any = await pool.query(
      `SELECT t.*, u1.email AS created_by_email, u2.email AS assigned_to_email
       FROM tickets t
       JOIN users u1 ON u1.id=t.created_by
       LEFT JOIN users u2 ON u2.id=t.assigned_to
       ${whereSql}
       ORDER BY t.created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, Number(limit), Number(offset)],
    );
    return rows;
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
