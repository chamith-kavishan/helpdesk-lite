import { Injectable } from '@nestjs/common';
import { pool } from '../db/mysql';

@Injectable()
export class UsersService {
  async create(
    email: string,
    password_hash: string,
    role: 'user' | 'admin' = 'user',
  ) {
    const [res]: any = await pool.query(
      'INSERT INTO users(email, password_hash, role) VALUES (?, ?, ?)',
      [email, password_hash, role],
    );
    return { id: res.insertId, email, role };
  }

  async findByEmail(email: string) {
    const [rows]: any = await pool.query(
      'SELECT * FROM users WHERE email=? LIMIT 1',
      [email],
    );
    return rows[0] || null;
  }

  async findById(id: number) {
    const [rows]: any = await pool.query(
      'SELECT * FROM users WHERE id=? LIMIT 1',
      [id],
    );
    return rows[0] || null;
  }
}
