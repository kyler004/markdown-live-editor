import Database from "better-sqlite3";
import path from "node:path";
import fs from "node:fs";

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (db) return db;

  const url = process.env.DATABASE_URL?.trim() || "./data/app.db";
  const dbPath = path.isAbsolute(url) ? url : path.resolve(process.cwd(), url);
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });

  db = new Database(dbPath);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");

  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE COLLATE NOCASE,
      name TEXT NOT NULL,
      password_hash TEXT NOT NULL DEFAULT '',
      image TEXT,
      created_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      expires_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS oauth_accounts (
      provider TEXT NOT NULL,
      provider_account_id TEXT NOT NULL,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      PRIMARY KEY (provider, provider_account_id)
    );

    CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
    CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions(expires_at);
    CREATE INDEX IF NOT EXISTS idx_oauth_user ON oauth_accounts(user_id);
  `);

  migrateSchema(db);

  return db;
}

function migrateSchema(db: Database.Database): void {
  const cols = db.prepare("PRAGMA table_info(users)").all() as Array<{
    name: string;
  }>;
  const names = new Set(cols.map((c) => c.name));
  if (!names.has("image")) {
    db.exec("ALTER TABLE users ADD COLUMN image TEXT");
  }
}

export interface DbUser {
  id: string;
  email: string;
  name: string;
  password_hash: string;
  image: string | null;
  created_at: number;
}

export interface PublicUser {
  id: string;
  email: string;
  name: string;
  image?: string | null;
}

export function toPublicUser(row: DbUser): PublicUser {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    image: row.image,
  };
}
