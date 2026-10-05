import { DatabaseSync } from "node:sqlite";
import { mkdirSync } from "node:fs";
import path from "node:path";

export const dataDirectory = path.resolve(process.env.BINAARE_DATA_DIR || path.join(process.cwd(), "data"));
export const uploadDirectory = path.join(dataDirectory, "uploads");
let database;
export function getDatabase() {
  if (database) return database;
  mkdirSync(uploadDirectory, { recursive: true, mode: 0o700 });
  database = new DatabaseSync(path.join(dataDirectory, "gallery.sqlite"));
  database.exec(`
    PRAGMA journal_mode = WAL;
    PRAGMA busy_timeout = 5000;
    CREATE TABLE IF NOT EXISTS content (id INTEGER PRIMARY KEY CHECK (id = 1), document TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS admins (username TEXT PRIMARY KEY, password_hash TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS sessions (token_hash TEXT PRIMARY KEY, username TEXT NOT NULL, expires INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS login_attempts (key TEXT PRIMARY KEY, count INTEGER NOT NULL, reset_at INTEGER NOT NULL);
  `);
  return database;
}
