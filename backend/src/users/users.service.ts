import { Injectable } from '@nestjs/common';
import { pool } from '../db/mysql';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

interface UserRow extends RowDataPacket {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  role: 'user' | 'admin';
  created_at: Date;
}

@Injectable()
export class UsersService {
  async create(
    name: string,
    email: string,
    password_hash: string,
    role: 'user' | 'admin' = 'user',
  ): Promise<{ id: number; email: string; role: 'user' | 'admin' }> {
    const [res] = await pool.query<ResultSetHeader>(
      'INSERT INTO users(name, email, password_hash, role) VALUES (?, ?, ?, ?)',
      [name, email, password_hash, role],
    );
    return { id: res.insertId, email, role };
  }

  async findByEmail(email: string) {
    const [rows] = await pool.query<UserRow[]>(
      'SELECT * FROM users WHERE email=? LIMIT 1',
      [email],
    );
    return rows[0] || null;
  }

  async findById(id: number) {
    const [rows] = await pool.query<UserRow[]>(
      'SELECT * FROM users WHERE id=? LIMIT 1',
      [id],
    );
    return rows[0] || null;
  }

  async listUsers() {
    const [rows] = await pool.query(
      `SELECT id, name, email, role FROM users ORDER BY created_at DESC`,
    );
    return rows;
  }
}
