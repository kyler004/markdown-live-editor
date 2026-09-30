import bcrypt from "bcryptjs";
import type { Response } from "express";
import { getDb, toPublicUser } from "./db.js";
import type { AuthedRequest } from "./auth.js";
import {
  getUserById,
  isOAuthOnlyUser,
} from "./oauth-helpers.js";

const BCRYPT_ROUNDS = 12;

function oauthProviders(userId: string): string[] {
  const db = getDb();
  return (
    db
      .prepare("SELECT provider FROM oauth_accounts WHERE user_id = ?")
      .all(userId) as Array<{ provider: string }>
  ).map((r) => r.provider);
}

export function handleGetProfile(req: AuthedRequest, res: Response): void {
  const row = getUserById(req.user!.id);
  if (!row) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  res.json({
    user: toPublicUser(row),
    hasPassword: !isOAuthOnlyUser(row),
    oauthProviders: oauthProviders(row.id),
  });
}

export async function handleUpdateProfile(
  req: AuthedRequest,
  res: Response,
): Promise<void> {
  try {
    const name = String(req.body?.name ?? "").trim();
    if (!name || name.length > 120) {
      res.status(400).json({ error: "Name is required (max 120 characters)" });
      return;
    }

    const db = getDb();
    db.prepare("UPDATE users SET name = ? WHERE id = ?").run(name, req.user!.id);
    const row = getUserById(req.user!.id)!;
    res.json({
      user: toPublicUser(row),
      hasPassword: !isOAuthOnlyUser(row),
      oauthProviders: oauthProviders(row.id),
    });
  } catch (err) {
    res.status(500).json({
      error: err instanceof Error ? err.message : "Profile update failed",
    });
  }
}

export async function handleChangePassword(
  req: AuthedRequest,
  res: Response,
): Promise<void> {
  try {
    const currentPassword = String(req.body?.currentPassword ?? "");
    const newPassword = String(req.body?.newPassword ?? "");

    if (newPassword.length < 8) {
      res.status(400).json({ error: "New password must be at least 8 characters" });
      return;
    }

    const row = getUserById(req.user!.id);
    if (!row) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const oauthOnly = isOAuthOnlyUser(row);

    if (oauthOnly) {
      const passwordHash = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);
      const db = getDb();
      db.prepare("UPDATE users SET password_hash = ? WHERE id = ?").run(
        passwordHash,
        row.id,
      );
      res.json({ ok: true, hasPassword: true });
      return;
    }

    const ok = await bcrypt.compare(currentPassword, row.password_hash);
    if (!ok) {
      res.status(401).json({ error: "Current password is incorrect" });
      return;
    }

    const passwordHash = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);
    const db = getDb();
    db.prepare("UPDATE users SET password_hash = ? WHERE id = ?").run(
      passwordHash,
      row.id,
    );

    res.json({ ok: true, hasPassword: true });
  } catch (err) {
    res.status(500).json({
      error: err instanceof Error ? err.message : "Password change failed",
    });
  }
}
