import { randomUUID } from "node:crypto";
import type { Response } from "express";
import { getDb, toPublicUser, type DbUser } from "./db.js";
import { ensureWorkspace, resolveUserWorkspace } from "./fs-utils.js";
import { sessionCookieOptions, clearCookieOptions } from "./cookies.js";

const SESSION_COOKIE = "architect_session";
const SESSION_DAYS = 30;

export function sessionExpiry(): number {
  return Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000;
}

export function createSession(userId: string): string {
  const db = getDb();
  const id = randomUUID();
  db.prepare(
    "INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)",
  ).run(id, userId, sessionExpiry());
  return id;
}

export function setSessionCookie(res: Response, sessionId: string): void {
  res.cookie(
    SESSION_COOKIE,
    sessionId,
    sessionCookieOptions(SESSION_DAYS * 24 * 60 * 60 * 1000),
  );
}

export function loginUser(userId: string, res: Response): void {
  const sessionId = createSession(userId);
  setSessionCookie(res, sessionId);
}

export function getUserByEmail(email: string): DbUser | undefined {
  const db = getDb();
  return db
    .prepare("SELECT * FROM users WHERE email = ? COLLATE NOCASE")
    .get(email.trim().toLowerCase()) as DbUser | undefined;
}

export function getUserById(id: string): DbUser | undefined {
  const db = getDb();
  return db.prepare("SELECT * FROM users WHERE id = ?").get(id) as
    | DbUser
    | undefined;
}

export function findOAuthUser(
  provider: string,
  providerAccountId: string,
): DbUser | undefined {
  const db = getDb();
  return db
    .prepare(
      `SELECT u.* FROM oauth_accounts o
       JOIN users u ON u.id = o.user_id
       WHERE o.provider = ? AND o.provider_account_id = ?`,
    )
    .get(provider, providerAccountId) as DbUser | undefined;
}

export function linkOAuthAccount(
  userId: string,
  provider: string,
  providerAccountId: string,
): void {
  const db = getDb();
  db.prepare(
    `INSERT OR IGNORE INTO oauth_accounts (provider, provider_account_id, user_id)
     VALUES (?, ?, ?)`,
  ).run(provider, providerAccountId, userId);
}

/** OAuth-only users have an empty password_hash. */
export function isOAuthOnlyUser(user: DbUser): boolean {
  return user.password_hash === "";
}

export async function findOrCreateOAuthUser(opts: {
  provider: "google" | "github";
  providerAccountId: string;
  email: string;
  name: string;
  image?: string;
}): Promise<DbUser> {
  const existing = findOAuthUser(opts.provider, opts.providerAccountId);
  if (existing) {
    if (opts.image && !existing.image) {
      const db = getDb();
      db.prepare("UPDATE users SET image = ? WHERE id = ?").run(
        opts.image,
        existing.id,
      );
    }
    return getUserById(existing.id)!;
  }

  const email = opts.email.trim().toLowerCase();
  const existingByEmail = getUserByEmail(email);

  if (existingByEmail) {
    linkOAuthAccount(existingByEmail.id, opts.provider, opts.providerAccountId);
    return existingByEmail;
  }

  const db = getDb();
  const id = randomUUID();
  db.prepare(
    `INSERT INTO users (id, email, name, password_hash, image, created_at)
     VALUES (?, ?, ?, '', ?, ?)`,
  ).run(id, email, opts.name, opts.image ?? null, Date.now());

  linkOAuthAccount(id, opts.provider, opts.providerAccountId);
  await ensureWorkspace(resolveUserWorkspace(id));

  return getUserById(id)!;
}

export function appUrl(): string {
  return (process.env.APP_URL ?? "http://localhost:5173").replace(/\/$/, "");
}

export function oauthCallbackUrl(provider: "google" | "github"): string {
  const base = appUrl();
  return `${base}/api/auth/${provider}/callback`;
}

export function setOAuthStateCookie(res: Response, state: string): void {
  res.cookie("oauth_state", state, sessionCookieOptions(10 * 60 * 1000));
}

export function verifyOAuthState(
  res: Response,
  state: string | undefined,
  cookieState: string | undefined,
): boolean {
  res.clearCookie("oauth_state", clearCookieOptions());
  return Boolean(state && cookieState && state === cookieState);
}

export function redirectOAuthError(res: Response, message: string): void {
  const url = `${appUrl()}/login?error=${encodeURIComponent(message)}`;
  res.redirect(url);
}

export function redirectOAuthSuccess(res: Response): void {
  res.redirect(`${appUrl()}/app`);
}

export { toPublicUser, SESSION_COOKIE };
