import { DatabaseSync } from "node:sqlite";
import { mkdirSync, existsSync, symlinkSync } from "node:fs";
import { randomBytes, scryptSync } from "node:crypto";
import path from "node:path";

function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  return `${salt}:${scryptSync(password, salt, 64).toString("hex")}`;
}

const dataDir = process.env.BINAARE_DATA_DIR || "/home/u890905085/binaare-data";
const uploadsDir = path.join(dataDir, "uploads");

mkdirSync(uploadsDir, { recursive: true, mode: 0o755 });

const dbPath = path.join(dataDir, "gallery.sqlite");
console.log(`[seed-server] Opening database at: ${dbPath}`);
const db = new DatabaseSync(dbPath);

db.exec(`
  PRAGMA journal_mode = WAL;
  PRAGMA synchronous = NORMAL;
  CREATE TABLE IF NOT EXISTS content (id INTEGER PRIMARY KEY CHECK (id = 1), document TEXT NOT NULL);
  CREATE TABLE IF NOT EXISTS admins (username TEXT PRIMARY KEY, password_hash TEXT NOT NULL, role TEXT NOT NULL DEFAULT 'admin');
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
  db.exec("ALTER TABLE admins ADD COLUMN role TEXT NOT NULL DEFAULT 'admin'");
} catch {
  // column already exists
}

// Reset failed login attempt locks
db.exec("DELETE FROM login_attempts;");

const upsert = db.prepare(`
  INSERT INTO admins (username, password_hash, role)
  VALUES (?, ?, ?)
  ON CONFLICT(username) DO UPDATE SET password_hash = excluded.password_hash, role = excluded.role
`);

const adminPass = process.env.ADMIN_PASSWORD || "Odk61D39sE4N_YYfgiWdnsCw";
const curatorPass = process.env.BINAAREE_PASSWORD || "Binaare@a86d7c928ad5";

upsert.run("admin", hashPassword(adminPass), "admin");
upsert.run("binaaree", hashPassword(curatorPass), "editor");
upsert.run("binaree", hashPassword(curatorPass), "editor");

console.log("✓ Admins table seeded successfully:");
console.table(db.prepare("SELECT username, role FROM admins").all());

// Symlink public_html/data -> binaare-data so older/newer builds both share the same database
const publicHtmlData = "/home/u890905085/domains/binaareartgallery.com/public_html/data";
try {
  if (!existsSync(publicHtmlData)) {
    symlinkSync(dataDir, publicHtmlData);
    console.log(`✓ Created symlink: ${publicHtmlData} -> ${dataDir}`);
  } else {
    console.log(`ℹ ${publicHtmlData} already exists`);
  }
} catch (e) {
  console.log(`Symlink note: ${e.message}`);
}
