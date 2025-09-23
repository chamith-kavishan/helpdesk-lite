import { readFileSync } from 'fs';
import path from 'path';
import mysql from 'mysql2/promise';

export async function initMySqlSchema() {
  const connection = await mysql.createConnection({
    host: process.env.MYSQL_HOST!,
    port: Number(process.env.MYSQL_PORT!),
    user: process.env.MYSQL_USER!,
    password: process.env.MYSQL_PASSWORD!,
    database: process.env.MYSQL_DB!,
    multipleStatements: true,
  });

  try {
    await connection.query(`
      CREATE TABLE IF NOT EXISTS app_meta (
        k VARCHAR(64) PRIMARY KEY,
        v VARCHAR(255) NOT NULL,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
          ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    const [rows] = await connection.query<any[]>(
      'SELECT v FROM app_meta WHERE k = "schema_version" LIMIT 1',
    );
    const current = rows.length ? rows[0].v : null;

    const targetVersion = 'v1';

    if (
      process.env.FORCE_SCHEMA_APPLY === 'true' ||
      current !== targetVersion
    ) {
      const schemaPath = path.join(__dirname, 'sql', '01_schema.sql');
      const sql = readFileSync(schemaPath, 'utf8');

      await connection.query(sql);

      await connection.query(
        'REPLACE INTO app_meta (k, v) VALUES ("schema_version", ?)',
        [targetVersion],
      );
      console.log('[schema] applied', targetVersion);
    } else {
      console.log('[schema] up-to-date', current);
    }
  } finally {
    await connection.end();
  }
}
