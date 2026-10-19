import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { getDatabase } from "./database.mjs";
import { hashPassword, verifyPassword } from "./password.mjs";
import { ContentError } from "./content-store";

const COOKIE = "binaare_admin";
const tokenHash = (token: string) => createHash("sha256").update(token).digest("hex");
const dummyPassword = hashPassword(randomBytes(24).toString("hex"));
export type AdminRole = "admin" | "editor";

export type AdminUser = {
  username: string;
  role: AdminRole;
};

export async function currentAdmin(): Promise<AdminUser | null> {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  const db = getDatabase();
  const session = db.prepare("SELECT username FROM sessions WHERE token_hash = ? AND expires > ?").get(tokenHash(token), Date.now()) as { username: string } | undefined;
  if (!session) return null;
  const admin = db.prepare("SELECT username, role FROM admins WHERE username = ?").get(session.username) as { username: string; role?: string } | undefined;
  if (!admin) return null;
  return {
    username: admin.username,
    role: admin.role === "editor" ? "editor" : "admin",
  };
}

export async function requireAdmin(requiredRole?: AdminRole): Promise<AdminUser> {
  const user = await currentAdmin();
  if (!user) throw new ContentError("Please sign in to continue.", 401);
  if (requiredRole === "admin" && user.role !== "admin") {
    throw new ContentError("Access restricted. Only the administrator can modify site design and configurations.", 403);
  }
  return user;
}
export function checkOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return; // Non-browser or same-origin direct calls

  const forwardedHost = request.headers.get("x-forwarded-host") || request.headers.get("host");
  const forwardedProto = request.headers.get("x-forwarded-proto") || "https";

  const allowed = new Set<string>([
    "https://binaareartgallery.com",
    "http://binaareartgallery.com",
    "https://www.binaareartgallery.com",
    "http://www.binaareartgallery.com",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
  ]);

  if (process.env.APP_ORIGIN) {
    allowed.add(process.env.APP_ORIGIN.replace(/\/$/, ""));
  }

  try {
    allowed.add(new URL(request.url).origin);
  } catch {}

  if (forwardedHost) {
    allowed.add(`${forwardedProto}://${forwardedHost}`);
    allowed.add(`https://${forwardedHost}`);
    allowed.add(`http://${forwardedHost}`);
  }

  const cleanOrigin = origin.replace(/\/$/, "");
  if (!allowed.has(cleanOrigin)) {
    // If incoming origin ends with binaareartgallery.com or matches host
    if (cleanOrigin.includes("binaareartgallery.com") || (forwardedHost && cleanOrigin.includes(forwardedHost.split(":")[0]))) {
      return;
    }
    console.warn(`[admin-auth] Blocked unauthorized origin: "${origin}". Allowed origins:`, Array.from(allowed));
    throw new ContentError("Request origin is not allowed.", 403);
  }
}
export async function login(username: string, password: string) {
  const db = getDatabase();
  const now = Date.now();
  // A persistent global limit also covers attempts with random usernames.
  const attempt = db.prepare("SELECT count, reset_at FROM login_attempts WHERE key = 'admin'").get() as { count: number; reset_at: number } | undefined;
  if (attempt && attempt.reset_at > now && attempt.count >= 15) throw new ContentError("Too many sign-in attempts. Try again in 15 minutes.", 429);
  db.prepare("INSERT INTO login_attempts (key, count, reset_at) VALUES ('admin', 1, ?) ON CONFLICT(key) DO UPDATE SET count = CASE WHEN reset_at <= ? THEN 1 ELSE count + 1 END, reset_at = CASE WHEN reset_at <= ? THEN excluded.reset_at ELSE reset_at END").run(now + 900000, now, now);
  const admin = db.prepare("SELECT password_hash FROM admins WHERE username = ?").get(username) as { password_hash: string } | undefined;
  const valid = verifyPassword(password, admin?.password_hash || dummyPassword);
  if (!admin || !valid) throw new ContentError("Incorrect username or password.", 401);
  db.prepare("DELETE FROM login_attempts WHERE key = 'admin'").run();
  db.prepare("DELETE FROM sessions WHERE expires <= ?").run(now);
  const token = randomBytes(32).toString("hex");
  db.prepare("INSERT INTO sessions (token_hash, username, expires) VALUES (?, ?, ?)").run(tokenHash(token), username, now + 28800000);
  (await cookies()).set(COOKIE, token, { httpOnly: true, sameSite: "strict", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 28800 });
}
export async function logout() {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (token) getDatabase().prepare("DELETE FROM sessions WHERE token_hash = ?").run(tokenHash(token));
  jar.delete(COOKIE);
}
