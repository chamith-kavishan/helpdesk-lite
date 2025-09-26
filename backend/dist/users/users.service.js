"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const mysql_1 = require("../db/mysql");
let UsersService = class UsersService {
    async create(name, email, password_hash, role = 'user') {
        const [res] = await mysql_1.pool.query('INSERT INTO users(name, email, password_hash, role) VALUES (?, ?, ?, ?)', [name, email, password_hash, role]);
        return { id: res.insertId, email, role };
    }
    async findByEmail(email) {
        const [rows] = await mysql_1.pool.query('SELECT * FROM users WHERE email=? LIMIT 1', [email]);
        return rows[0] || null;
    }
    async findById(id) {
        const [rows] = await mysql_1.pool.query('SELECT * FROM users WHERE id=? LIMIT 1', [id]);
        return rows[0] || null;
    }
    async listUsers() {
        const [rows] = await mysql_1.pool.query(`SELECT id, name, email, role FROM users ORDER BY created_at DESC`);
        return rows;
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)()
], UsersService);
//# sourceMappingURL=users.service.js.map