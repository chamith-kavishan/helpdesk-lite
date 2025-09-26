"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const mongoose_2 = require("@nestjs/mongoose");
const mysql_1 = require("../db/mysql");
const event_schema_1 = require("../mongo/schemas/event.schema");
let TicketsService = class TicketsService {
    eventModel;
    constructor(eventModel) {
        this.eventModel = eventModel;
    }
    async createTicket(data) {
        const [res] = await mysql_1.pool.query('INSERT INTO tickets(title, description, priority, created_by) VALUES (?, ?, ?, ?)', [data.title, data.description, data.priority, data.created_by]);
        const id = res.insertId;
        await this.eventModel.create({
            type: 'TICKET_CREATED',
            ticketId: id,
            actorId: data.created_by,
            payload: { priority: data.priority },
        });
        return { id, ...data, status: 'OPEN' };
    }
    async getTicket(id, user) {
        const [rows] = await mysql_1.pool.query(`SELECT t.*, u1.name AS created_by_name, u2.email AS assigned_to_email, u2.name AS assigned_to_name
       FROM tickets t
       JOIN users u1 ON u1.id=t.created_by
       LEFT JOIN users u2 ON u2.id=t.assigned_to
       WHERE t.id=?`, [id]);
        const t = rows[0];
        if (!t)
            throw new common_1.NotFoundException('Ticket not found');
        if (user.role !== 'admin' &&
            t.created_by !== user.id &&
            t.assigned_to !== user.id)
            throw new common_1.ForbiddenException();
        return t;
    }
    async listTickets(q, status, page = 1, limit = 10, user) {
        const _page = Math.max(1, Number.isFinite(+page) ? +page : 1);
        const _limit = Math.min(100, Math.max(1, Number.isFinite(+limit) ? +limit : 10));
        const offset = (_page - 1) * _limit;
        const where = [];
        const params = [];
        if (status) {
            where.push('t.status = ?');
            params.push(status);
        }
        if (q && q.trim()) {
            where.push('(t.title LIKE ? OR t.description LIKE ?)');
            params.push(`%${q}%`, `%${q}%`);
        }
        if (user.role !== 'admin') {
            where.push('(t.created_by = ? OR t.assigned_to = ?)');
            params.push(user.id, user.id);
        }
        const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';
        const [countRows] = await mysql_1.pool.query(`SELECT COUNT(*) AS total
         FROM tickets t
         ${whereSql}`, params);
        const total = Number(countRows[0]?.total ?? 0);
        const [rows] = await mysql_1.pool.query(`SELECT t.*,
              u1.email AS created_by_email,
              u1.name AS created_by_name,
              u2.email AS assigned_to_email,
              u2.name AS assigned_to_name
         FROM tickets t
         JOIN users u1 ON u1.id = t.created_by
         LEFT JOIN users u2 ON u2.id = t.assigned_to
         ${whereSql}
         ORDER BY t.created_at DESC
         LIMIT ? OFFSET ?`, [...params, _limit, offset]);
        return {
            items: rows,
            page: _page,
            limit: _limit,
            total,
            totalPages: Math.max(1, Math.ceil(total / _limit)),
        };
    }
    async updateTicket(id, partial, user) {
        const t = await this.getTicket(id, user);
        if (user.role !== 'admin' && t.created_by !== user.id)
            throw new common_1.ForbiddenException();
        const fields = [];
        const params = [];
        for (const k of ['title', 'description', 'status', 'priority']) {
            if (partial[k] !== undefined) {
                fields.push(`${k}=?`);
                params.push(partial[k]);
            }
        }
        if (fields.length === 0)
            return t;
        params.push(id);
        await mysql_1.pool.query(`UPDATE tickets SET ${fields.join(', ')} WHERE id=?`, params);
        if (partial.status)
            await this.eventModel.create({
                type: 'STATUS_CHANGED',
                ticketId: id,
                actorId: user.id,
                payload: { status: partial.status },
            });
        return this.getTicket(id, user);
    }
    async assignTicket(id, assigned_to, user) {
        if (user.role !== 'admin')
            throw new common_1.ForbiddenException();
        await mysql_1.pool.query('UPDATE tickets SET assigned_to=? WHERE id=?', [
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
};
exports.TicketsService = TicketsService;
exports.TicketsService = TicketsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_2.InjectModel)(event_schema_1.Event.name)),
    __metadata("design:paramtypes", [mongoose_1.Model])
], TicketsService);
//# sourceMappingURL=tickets.service.js.map