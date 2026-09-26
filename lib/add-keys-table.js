const Database = require('better-sqlite3');
const path = require('path');
const db = new Database(path.join(process.cwd(), 'data', 'aioffice.db'));

db.exec(`
CREATE TABLE IF NOT EXISTS company_api_keys (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(8)))),
  company_id TEXT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  provider TEXT NOT NULL,
  api_key TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(company_id, provider)
);
`);
console.log("Migration successful");
