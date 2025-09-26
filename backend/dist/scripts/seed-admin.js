"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const bcrypt = __importStar(require("bcrypt"));
const mysql_1 = require("../db/mysql");
const MYSQL_DB = process.env.MYSQL_DB;
async function ensureNameColumn() {
    const [cols] = await mysql_1.pool.query(`SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS
     WHERE TABLE_SCHEMA=? AND TABLE_NAME='users' AND COLUMN_NAME='name' LIMIT 1`, [MYSQL_DB]);
    if (cols.length === 0) {
        console.log('[seed] Adding "name" column to users…');
        await mysql_1.pool.query(`ALTER TABLE users ADD COLUMN name VARCHAR(255) NULL AFTER id`);
        console.log('[seed] "name" column added');
    }
}
async function ensureAdminUser() {
    const email = process.env.ADMIN_EMAIL ?? 'admin@example.com';
    const password = process.env.ADMIN_PASSWORD ?? 'Admin@123!';
    const name = process.env.ADMIN_NAME ?? 'Admin';
    const forceReset = String(process.env.ADMIN_FORCE_PASSWORD_RESET || 'false').toLowerCase() ===
        'true';
    const [rows] = await mysql_1.pool.query('SELECT id, name, email, password_hash, role, created_at FROM users WHERE email=? LIMIT 1', [email]);
    const existing = rows[0];
    if (existing) {
        if (existing.role !== 'admin') {
            await mysql_1.pool.query('UPDATE users SET role="admin" WHERE id=?', [existing.id]);
            console.log(`[seed] User ${email} promoted to admin`);
        }
        if (forceReset) {
            const hash = await bcrypt.hash(password, 12);
            await mysql_1.pool.query('UPDATE users SET password_hash=? WHERE id=?', [hash, existing.id]);
            console.log(`[seed] Password reset for ${email}`);
        }
        if (existing.name == null && name) {
            await mysql_1.pool.query('UPDATE users SET name=? WHERE id=?', [
                name,
                existing.id,
            ]);
            console.log(`[seed] Name set for ${email}`);
        }
        console.log('[seed] Admin ensured (existing).');
        return { id: existing.id, email: existing.email, role: 'admin' };
    }
    const hash = await bcrypt.hash(password, 12);
    const [res] = await mysql_1.pool.query('INSERT INTO users(name, email, password_hash, role) VALUES (?, ?, ?, "admin")', [name, email, hash]);
    console.log(`[seed] Admin created: ${email} (id=${res.insertId})`);
    return { id: res.insertId, email, role: 'admin' };
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
    return mysql_1.pool.end();
})
    .catch(async (err) => {
    console.error('[seed] Error:', err);
    await mysql_1.pool.end().catch(() => { });
    process.exit(1);
});
//# sourceMappingURL=seed-admin.js.map