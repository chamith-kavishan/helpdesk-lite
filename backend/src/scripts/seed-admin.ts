import 'dotenv/config';
import * as bcrypt from 'bcrypt';
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

const MYSQL_DB = process.env.MYSQL_DB as string;

async function ensureNameColumn() {
  const [cols] = await pool.query<RowDataPacket[]>(
    `SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS
     WHERE TABLE_SCHEMA=? AND TABLE_NAME='users' AND COLUMN_NAME='name' LIMIT 1`,
    [MYSQL_DB],
  );
  if (cols.length === 0) {
    console.log('[seed] Adding "name" column to users…');
    await pool.query(
      `ALTER TABLE users ADD COLUMN name VARCHAR(255) NULL AFTER id`,
    );
    console.log('[seed] "name" column added');
  }
}

async function ensureAdminUser() {
  const email = process.env.ADMIN_EMAIL ?? 'admin@example.com';
  const password = process.env.ADMIN_PASSWORD ?? 'Admin@123!';
  const name = process.env.ADMIN_NAME ?? 'Admin';
  const forceReset =
    String(process.env.ADMIN_FORCE_PASSWORD_RESET || 'false').toLowerCase() ===
    'true';

  const [rows] = await pool.query<UserRow[]>(
    'SELECT id, name, email, password_hash, role, created_at FROM users WHERE email=? LIMIT 1',
    [email],
  );
  const existing = rows[0];

  if (existing) {
    if (existing.role !== 'admin') {
      await pool.query<ResultSetHeader>(
        'UPDATE users SET role="admin" WHERE id=?',
        [existing.id],
      );
      console.log(`[seed] User ${email} promoted to admin`);
    }

    if (forceReset) {
      const hash = await bcrypt.hash(password, 12);
      await pool.query<ResultSetHeader>(
        'UPDATE users SET password_hash=? WHERE id=?',
        [hash, existing.id],
      );
      console.log(`[seed] Password reset for ${email}`);
    }

    if (existing.name == null && name) {
      await pool.query<ResultSetHeader>('UPDATE users SET name=? WHERE id=?', [
        name,
        existing.id,
      ]);
      console.log(`[seed] Name set for ${email}`);
    }

    console.log('[seed] Admin ensured (existing).');
    return { id: existing.id, email: existing.email, role: 'admin' as const };
  }

  // Create new admin
  const hash = await bcrypt.hash(password, 12);
  const [res] = await pool.query<ResultSetHeader>(
    'INSERT INTO users(name, email, password_hash, role) VALUES (?, ?, ?, "admin")',
    [name, email, hash],
  );

  console.log(`[seed] Admin created: ${email} (id=${res.insertId})`);
  return { id: res.insertId, email, role: 'admin' as const };
}

async function main() {
  if (!MYSQL_DB) {
    throw new Error('MYSQL_DB must be set in .env for schema checks');
  }
  await ensureNameColumn();
  await ensureAdminUser();
}

main()
  .then(() => {
    console.log('[seed] Done.');
    return pool.end();
  })
  .catch(async (err) => {
    console.error('[seed] Error:', err);
    await pool.end().catch(() => {});
    process.exit(1);
  });
