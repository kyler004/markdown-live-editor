import type { CookieOptions } from "express";

/** Secure cookies in production or when COOKIE_SECURE=true (HTTPS behind proxy). */
export function cookieSecure(): boolean {
  const flag = process.env.COOKIE_SECURE?.trim().toLowerCase();
  if (flag === "true") return true;
  if (flag === "false") return false;
  return process.env.NODE_ENV === "production";
}

export function sessionCookieOptions(maxAgeMs: number): CookieOptions {
  return {
    httpOnly: true,
    secure: cookieSecure(),
    sameSite: "lax",
    maxAge: maxAgeMs,
    path: "/",
  };
}

export function clearCookieOptions(): CookieOptions {
  return {
    httpOnly: true,
    secure: cookieSecure(),
    sameSite: "lax",
    path: "/",
  };
}
