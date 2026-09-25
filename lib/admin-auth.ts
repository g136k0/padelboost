import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";

const COOKIE_NAME = "padelboost_admin";
const SESSION_LIFETIME_SECONDS = 12 * 60 * 60;

/**
 * A single-owner, server-only admin login. Both secrets must be strong,
 * independent random values set in Vercel's encrypted environment variables.
 */
export function adminConfigured(): boolean {
  return Boolean(
    process.env.ADMIN_PASSWORD &&
    process.env.ADMIN_PASSWORD.length >= 20 &&
    process.env.ADMIN_SESSION_SECRET &&
    process.env.ADMIN_SESSION_SECRET.length >= 32,
  );
}

export function adminCookieName(): string {
  return COOKIE_NAME;
}

function signature(value: string): string {
  return createHmac("sha256", process.env.ADMIN_SESSION_SECRET || "")
    .update(value)
    .digest("hex");
}

export function verifyAdminPassword(value: FormDataEntryValue | null): boolean {
  if (!adminConfigured() || typeof value !== "string" || value.length > 512) return false;

  // Constant-time comparison; the password never leaves this server.
  const submitted = createHash("sha256").update("padelboost-admin-v1:" + value).digest();
  const expected = createHash("sha256")
    .update("padelboost-admin-v1:" + process.env.ADMIN_PASSWORD)
    .digest();
  return timingSafeEqual(submitted, expected);
}

export function createAdminSession(): string {
  if (!adminConfigured()) throw new Error("Admin authentication is not configured");
  const issued = Math.floor(Date.now() / 1000);
  const nonce = randomBytes(20).toString("hex");
  const message = `v1.${issued}.${nonce}`;
  return `${message}.${signature(message)}`;
}

export function verifyAdminSession(value: string | undefined): boolean {
  if (!adminConfigured() || !value) return false;
  const parts = value.split(".");
  if (parts.length !== 4 || parts[0] !== "v1") return false;

  const issued = Number(parts[1]);
  const current = Math.floor(Date.now() / 1000);
  if (!Number.isSafeInteger(issued) || issued > current + 60 || current - issued > SESSION_LIFETIME_SECONDS) {
    return false;
  }
  if (!/^[a-f0-9]{40}$/.test(parts[2]) || !/^[a-f0-9]{64}$/.test(parts[3])) {
    return false;
  }
  const message = parts.slice(0, 3).join(".");
  const candidate = Buffer.from(parts[3], "hex");
  const expected = Buffer.from(signature(message), "hex");
  return candidate.length === expected.length && timingSafeEqual(candidate, expected);
}

export const adminCookieSettings = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  path: "/admin",
  maxAge: SESSION_LIFETIME_SECONDS,
};
