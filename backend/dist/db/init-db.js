"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initMySqlSchema = initMySqlSchema;
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const promise_1 = __importDefault(require("mysql2/promise"));
function resolveSchemaPath() {
    const distPath = path_1.default.resolve(__dirname, 'sql', 'schema.sql');
    if ((0, fs_1.existsSync)(distPath))
        return distPath;
    const srcPath = path_1.default.resolve(process.cwd(), 'src', 'db', 'sql', 'schema.sql');
    if ((0, fs_1.existsSync)(srcPath))
        return srcPath;
    throw new Error(`Schema file not found. Tried:
  - ${distPath}
  - ${srcPath}`);
}
async function initMySqlSchema() {
    const connection = await promise_1.default.createConnection({
        host: process.env.MYSQL_HOST || 'localhost',
        user: process.env.MYSQL_USER || 'root',
        password: process.env.MYSQL_PASSWORD || '',
        database: process.env.MYSQL_DB || 'helpdesk',
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
        const [rows] = await connection.query('SELECT v FROM app_meta WHERE k = "schema_version" LIMIT 1');
        const current = rows.length ? rows[0].v : null;
        const targetVersion = 'v1';
        if (process.env.FORCE_SCHEMA_APPLY === 'true' ||
            current !== targetVersion) {
            const schemaPath = resolveSchemaPath();
            const sql = (0, fs_1.readFileSync)(schemaPath, 'utf8');
            await connection.query(sql);
            await connection.query('REPLACE INTO app_meta (k, v) VALUES ("schema_version", ?)', [targetVersion]);
            console.log('[schema] applied', targetVersion);
        }
        else {
            console.log('[schema] up-to-date', current);
        }
    }
    finally {
        await connection.end();
    }
}
//# sourceMappingURL=init-db.js.map