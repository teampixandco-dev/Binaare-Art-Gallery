import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

export function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  return `${salt}:${scryptSync(password, salt, 64).toString("hex")}`;
}
export function verifyPassword(password, encoded) {
  const [salt, expected] = encoded.split(":");
  const actual = scryptSync(password, salt, 64);
  const hash = Buffer.from(expected, "hex");
  return hash.length === actual.length && timingSafeEqual(actual, hash);
}
