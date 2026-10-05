import { randomBytes } from "node:crypto";
import { writeFileSync } from "node:fs";
import { getDatabase } from "../src/lib/database.mjs";
import { hashPassword } from "../src/lib/password.mjs";

const username = process.env.ADMIN_USERNAME || "admin";
const password = process.env.ADMIN_PASSWORD || randomBytes(18).toString("base64url");
if (password.length < 12) throw new Error("Use a password with at least 12 characters.");
const db = getDatabase();
if (db.prepare("SELECT username FROM admins WHERE username = ?").get(username) && !process.argv.includes("--reset")) {
  console.log("Administrator already exists. Use --reset to change the password.");
  process.exit(0);
}
db.exec("BEGIN IMMEDIATE");
try {
  db.prepare("INSERT INTO admins (username, password_hash) VALUES (?, ?) ON CONFLICT(username) DO UPDATE SET password_hash = excluded.password_hash").run(username, hashPassword(password));
  db.prepare("DELETE FROM sessions WHERE username = ?").run(username);
  db.exec("COMMIT");
} catch (error) { db.exec("ROLLBACK"); throw error; }
const credentialsFile = process.env.ADMIN_CREDENTIALS_FILE || ".admin-credentials";
writeFileSync(credentialsFile, `Admin URL: http://localhost:3000/admin\nUsername: ${username}\nPassword: ${password}\n`, { mode: 0o600 });
console.log(`Administrator ready. Login details saved to ${credentialsFile}. Keep this file private.`);
