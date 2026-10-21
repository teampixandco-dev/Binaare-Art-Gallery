import { DatabaseSync } from "node:sqlite";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { hashPassword } from "./password.mjs";

export let dataDirectory = path.resolve(process.env.BINAARE_DATA_DIR || path.join(process.cwd(), "data"));
export let uploadDirectory = path.join(dataDirectory, "uploads");
export const publicMediaDirectory = path.join(process.cwd(), "public", "media");
let database;
export function getDatabase() {
  if (database) return database;
  try {
    mkdirSync(uploadDirectory, { recursive: true, mode: 0o755 });
  } catch (err) {
    const localDir = path.resolve(path.join(process.cwd(), "data"));
    if (dataDirectory !== localDir) {
      console.warn(`[database] Cannot create ${uploadDirectory} (${err?.message || err}). Falling back to local ./data.`);
      dataDirectory = localDir;
      uploadDirectory = path.join(dataDirectory, "uploads");
      mkdirSync(uploadDirectory, { recursive: true, mode: 0o755 });
    } else {
      throw err;
    }
  }
  mkdirSync(publicMediaDirectory, { recursive: true, mode: 0o755 });
  const dbPath = path.join(dataDirectory, "gallery.sqlite");
  database = new DatabaseSync(dbPath);
  try {
    database.exec(`
      PRAGMA journal_mode = WAL;
      PRAGMA synchronous = NORMAL;
      PRAGMA cache_size = -2000;
      PRAGMA temp_store = MEMORY;
      PRAGMA busy_timeout = 5000;
      CREATE TABLE IF NOT EXISTS content (id INTEGER PRIMARY KEY CHECK (id = 1), document TEXT NOT NULL);
      CREATE TABLE IF NOT EXISTS admins (username TEXT PRIMARY KEY, password_hash TEXT NOT NULL);
      CREATE TABLE IF NOT EXISTS sessions (token_hash TEXT PRIMARY KEY, username TEXT NOT NULL, expires INTEGER NOT NULL);
      CREATE TABLE IF NOT EXISTS login_attempts (key TEXT PRIMARY KEY, count INTEGER NOT NULL, reset_at INTEGER NOT NULL);
      CREATE TABLE IF NOT EXISTS inquiries (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        subject TEXT NOT NULL,
        enquiry_type TEXT NOT NULL,
        message TEXT NOT NULL,
        created_at TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'unread'
      );
    `);
    try {
      database.exec("ALTER TABLE admins ADD COLUMN role TEXT NOT NULL DEFAULT 'admin'");
    } catch {
      // Column already exists
    }

    try {
      const defaultAdminPass = process.env.ADMIN_PASSWORD || "Odk61D39sE4N_YYfgiWdnsCw";
      const defaultCuratorPass = process.env.BINAAREE_PASSWORD || "Binaare@a86d7c928ad5";
      const insertUser = database.prepare(`
        INSERT INTO admins (username, password_hash, role)
        VALUES (?, ?, ?)
        ON CONFLICT(username) DO UPDATE SET password_hash = excluded.password_hash, role = excluded.role
      `);
      insertUser.run("admin", hashPassword(defaultAdminPass), "admin");
      insertUser.run("binaare", hashPassword(defaultCuratorPass), "editor");
      insertUser.run("binaaree", hashPassword(defaultCuratorPass), "editor");
      insertUser.run("binaree", hashPassword(defaultCuratorPass), "editor");
    } catch {
      // Ignore if concurrent boot
    }
  } catch {
    // Ignore if another thread just created it
  }
  return database;
}
