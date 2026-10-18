import { randomBytes } from "node:crypto";
import { writeFileSync, existsSync, readFileSync } from "node:fs";
import { getDatabase } from "../src/lib/database.mjs";
import { hashPassword } from "../src/lib/password.mjs";

const db = getDatabase();

// 1. Ensure 'role' column exists in admins table
try {
  db.exec("ALTER TABLE admins ADD COLUMN role TEXT NOT NULL DEFAULT 'admin'");
} catch {
  // column already exists
}

// 2. Setup/Reset 'admin' user (Super Admin / Site Designer)
const adminUsername = "admin";
let adminPassword = process.env.ADMIN_PASSWORD;
if (!adminPassword && existsSync(".admin-credentials")) {
  const match = readFileSync(".admin-credentials", "utf-8").match(/Password:\s*([^\s]+)/);
  if (match) adminPassword = match[1];
}
if (!adminPassword || process.argv.includes("--reset-admin") || process.argv.includes("--reset")) {
  adminPassword = randomBytes(18).toString("base64url");
}

// 3. Setup/Reset 'binaaree' user (Curator / Shop Manager)
const binaareeUsername = "binaaree";
let binaareePassword = process.env.BINAAREE_PASSWORD;
if (!binaareePassword && existsSync(".binaaree-credentials")) {
  const match = readFileSync(".binaaree-credentials", "utf-8").match(/Password:\s*([^\s]+)/);
  if (match) binaareePassword = match[1];
}
if (!binaareePassword || process.argv.includes("--reset-binaaree") || process.argv.includes("--reset")) {
  binaareePassword = process.env.BINAAREE_PASSWORD || "Binaare@" + randomBytes(6).toString("hex");
}

db.exec("BEGIN IMMEDIATE");
try {
  // Upsert admin (role: admin)
  db.prepare(`
    INSERT INTO admins (username, password_hash, role)
    VALUES (?, ?, 'admin')
    ON CONFLICT(username) DO UPDATE SET password_hash = excluded.password_hash, role = 'admin'
  `).run(adminUsername, hashPassword(adminPassword));

  // Upsert binaaree (role: editor)
  db.prepare(`
    INSERT INTO admins (username, password_hash, role)
    VALUES (?, ?, 'editor')
    ON CONFLICT(username) DO UPDATE SET password_hash = excluded.password_hash, role = 'editor'
  `).run(binaareeUsername, hashPassword(binaareePassword));

  db.exec("COMMIT");
} catch (error) {
  db.exec("ROLLBACK");
  throw error;
}

writeFileSync(".admin-credentials", `Admin URL: http://localhost:3000/admin\nUsername: ${adminUsername}\nPassword: ${adminPassword}\nRole: admin (Full Access / Site Designer)\n`, { mode: 0o600 });
writeFileSync(".binaaree-credentials", `Admin URL: http://localhost:3000/admin\nUsername: ${binaareeUsername}\nPassword: ${binaareePassword}\nRole: editor (Shop Artworks & Documents Only)\n`, { mode: 0o600 });

console.log(`✓ Admin user '${adminUsername}' ready. Login details in .admin-credentials`);
console.log(`✓ Curator user '${binaareeUsername}' ready. Login details in .binaaree-credentials`);
