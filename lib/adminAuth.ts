// A deliberately minimal admin session mechanism — no database, no paid
// auth provider. A signed, expiring token is stored in an httpOnly cookie.
// The signing key is your ADMIN_PASSWORD (or a dedicated ADMIN_SESSION_SECRET
// if you set one) via HMAC-SHA256, verified with the Web Crypto API so the
// same code works in both a Node.js Route Handler and Edge middleware.

export const ADMIN_COOKIE_NAME = "sanwarna_admin_session";
const SESSION_LIFETIME_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

function getSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD;
  if (!secret) {
    throw new Error(
      "ADMIN_PASSWORD (or ADMIN_SESSION_SECRET) is not set. Set it in your environment before using the admin login — see .env.example."
    );
  }
  return secret;
}

async function hmac(payload: string, secret: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, enc.encode(payload));
  return bufferToBase64Url(signature);
}

function bufferToBase64Url(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/** Creates a signed session token: `<expiryTimestamp>.<hmacSignature>`. */
export async function createAdminSessionToken(): Promise<string> {
  const secret = getSecret();
  const expiresAt = Date.now() + SESSION_LIFETIME_MS;
  const payload = String(expiresAt);
  const signature = await hmac(payload, secret);
  return `${payload}.${signature}`;
}

/** Verifies a session token's signature and expiry. */
export async function verifyAdminSessionToken(token: string | undefined | null): Promise<boolean> {
  if (!token) return false;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;

  const expiresAt = Number(payload);
  if (!Number.isFinite(expiresAt) || Date.now() > expiresAt) return false;

  try {
    const secret = getSecret();
    const expectedSignature = await hmac(payload, secret);
    return timingSafeEqual(signature, expectedSignature);
  } catch {
    return false;
  }
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

/** Constant-time-ish comparison for the submitted password itself. */
export function passwordMatches(submitted: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  if (submitted.length !== expected.length) return false;
  let result = 0;
  for (let i = 0; i < submitted.length; i++) {
    result |= submitted.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return result === 0;
}
