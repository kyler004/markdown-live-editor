import { randomBytes, randomUUID } from "node:crypto";
import bcrypt from "bcryptjs";
import type { Request, Response, NextFunction } from "express";
import { getDb, toPublicUser, type DbUser, type PublicUser } from "./db.js";
import { ensureWorkspace, resolveUserWorkspace } from "./fs-utils.js";
import {
  getUserByEmail,
  getUserById,
  isOAuthOnlyUser,
  loginUser,
  SESSION_COOKIE,
} from "./oauth-helpers.js";
import { clearCookieOptions } from "./cookies.js";

const BCRYPT_ROUNDS = 12;

export interface AuthedRequest extends Request {
  user?: PublicUser;
  workspaceRoot?: string;
}

function getSessionUser(sessionId: string): PublicUser | null {
  const db = getDb();
  const row = db
    .prepare(
      `SELECT u.* FROM sessions s
       JOIN users u ON u.id = s.user_id
       WHERE s.id = ? AND s.expires_at > ?`,
    )
    .get(sessionId, Date.now()) as DbUser | undefined;
  return row ? toPublicUser(row) : null;
}

function purgeExpiredSessions(): void {
  const db = getDb();
  db.prepare("DELETE FROM sessions WHERE expires_at <= ?").run(Date.now());
}

function clearSessionCookie(res: Response): void {
  res.clearCookie(SESSION_COOKIE, clearCookieOptions());
}

export function requireAuth(
  req: AuthedRequest,
  res: Response,
  next: NextFunction,
): void {
  purgeExpiredSessions();
  const sessionId = req.cookies?.[SESSION_COOKIE] as string | undefined;
  if (!sessionId) {
    res.status(401).json({ error: "Authentication required" });
    return;
  }

  const user = getSessionUser(sessionId);
  if (!user) {
    res.status(401).json({ error: "Invalid or expired session" });
    return;
  }

  req.user = user;
  req.workspaceRoot = resolveUserWorkspace(user.id);
  next();
}

export async function handleSignUp(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const email = String(req.body?.email ?? "").trim().toLowerCase();
    const password = String(req.body?.password ?? "");
    const name = String(req.body?.name ?? "").trim() || email.split("@")[0];

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      res.status(400).json({ error: "Valid email is required" });
      return;
    }
    if (password.length < 8) {
      res.status(400).json({ error: "Password must be at least 8 characters" });
      return;
    }
    if (getUserByEmail(email)) {
      res.status(409).json({ error: "Email already registered" });
      return;
    }

    const db = getDb();
    const id = randomUUID();
    const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
    db.prepare(
      "INSERT INTO users (id, email, name, password_hash, created_at) VALUES (?, ?, ?, ?, ?)",
    ).run(id, email, name, passwordHash, Date.now());

    const workspace = resolveUserWorkspace(id);
    await ensureWorkspace(workspace);

    loginUser(id, res);

    const user = toPublicUser(getUserById(id)!);
    res.status(201).json({ user });
  } catch (err) {
    res.status(500).json({
      error: err instanceof Error ? err.message : "Sign up failed",
    });
  }
}

export async function handleSignIn(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const email = String(req.body?.email ?? "").trim().toLowerCase();
    const password = String(req.body?.password ?? "");

    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }

    const user = getUserByEmail(email);
    if (!user) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    if (isOAuthOnlyUser(user)) {
      res.status(401).json({
        error: "This account uses Google or GitHub — sign in with that provider",
      });
      return;
    }

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    loginUser(user.id, res);
    res.json({ user: toPublicUser(user) });
  } catch (err) {
    res.status(500).json({
      error: err instanceof Error ? err.message : "Sign in failed",
    });
  }
}

export function handleSignOut(req: Request, res: Response): void {
  const sessionId = req.cookies?.[SESSION_COOKIE] as string | undefined;
  if (sessionId) {
    const db = getDb();
    db.prepare("DELETE FROM sessions WHERE id = ?").run(sessionId);
  }
  clearSessionCookie(res);
  res.json({ ok: true });
}

export function handleMe(req: AuthedRequest, res: Response): void {
  purgeExpiredSessions();
  const sessionId = req.cookies?.[SESSION_COOKIE] as string | undefined;
  if (!sessionId) {
    res.json({ user: null });
    return;
  }
  const user = getSessionUser(sessionId);
  res.json({ user });
}

export function sessionSecret(): string {
  const secret = process.env.SESSION_SECRET?.trim();
  if (!secret || secret.length < 16) {
    console.warn(
      "SESSION_SECRET missing or short — set a long random value in .env",
    );
    return randomBytes(32).toString("hex");
  }
  return secret;
}
