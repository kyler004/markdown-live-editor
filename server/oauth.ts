import { randomBytes } from "node:crypto";
import type { Request, Response } from "express";
import {
  appUrl,
  findOrCreateOAuthUser,
  loginUser,
  oauthCallbackUrl,
  redirectOAuthError,
  redirectOAuthSuccess,
  setOAuthStateCookie,
  verifyOAuthState,
} from "./oauth-helpers.js";

type Provider = "google" | "github";

function isConfigured(provider: Provider): boolean {
  if (provider === "google") {
    return Boolean(
      process.env.GOOGLE_CLIENT_ID?.trim() &&
        process.env.GOOGLE_CLIENT_SECRET?.trim(),
    );
  }
  return Boolean(
    process.env.GITHUB_CLIENT_ID?.trim() &&
      process.env.GITHUB_CLIENT_SECRET?.trim(),
  );
}

function startOAuth(provider: Provider, res: Response): void {
  if (!isConfigured(provider)) {
    redirectOAuthError(
      res,
      `${provider} OAuth is not configured on this server`,
    );
    return;
  }

  const state = randomBytes(24).toString("hex");
  setOAuthStateCookie(res, state);

  if (provider === "google") {
    const params = new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!.trim(),
      redirect_uri: oauthCallbackUrl("google"),
      response_type: "code",
      scope: "openid email profile",
      state,
      prompt: "select_account",
    });
    res.redirect(
      `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`,
    );
    return;
  }

  const params = new URLSearchParams({
    client_id: process.env.GITHUB_CLIENT_ID!.trim(),
    redirect_uri: oauthCallbackUrl("github"),
    scope: "user:email read:user",
    state,
  });
  res.redirect(
    `https://github.com/login/oauth/authorize?${params.toString()}`,
  );
}

async function exchangeGoogleCode(code: string): Promise<{
  email: string;
  name: string;
  id: string;
  picture?: string;
}> {
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID!.trim(),
      client_secret: process.env.GOOGLE_CLIENT_SECRET!.trim(),
      redirect_uri: oauthCallbackUrl("google"),
      grant_type: "authorization_code",
    }),
  });

  const tokenData = (await tokenRes.json()) as {
    access_token?: string;
    error?: string;
  };
  if (!tokenRes.ok || !tokenData.access_token) {
    throw new Error(tokenData.error ?? "Google token exchange failed");
  }

  const profileRes = await fetch(
    "https://www.googleapis.com/oauth2/v2/userinfo",
    { headers: { Authorization: `Bearer ${tokenData.access_token}` } },
  );
  const profile = (await profileRes.json()) as {
    id?: string;
    email?: string;
    name?: string;
    picture?: string;
  };

  if (!profile.id || !profile.email) {
    throw new Error("Google profile missing id or email");
  }

  return {
    id: profile.id,
    email: profile.email,
    name: profile.name ?? profile.email.split("@")[0],
    picture: profile.picture,
  };
}

async function exchangeGithubCode(code: string): Promise<{
  email: string;
  name: string;
  id: string;
  picture?: string;
}> {
  const tokenRes = await fetch(
    "https://github.com/login/oauth/access_token",
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: process.env.GITHUB_CLIENT_ID!.trim(),
        client_secret: process.env.GITHUB_CLIENT_SECRET!.trim(),
        code,
        redirect_uri: oauthCallbackUrl("github"),
      }),
    },
  );

  const tokenData = (await tokenRes.json()) as {
    access_token?: string;
    error?: string;
  };
  if (!tokenRes.ok || !tokenData.access_token) {
    throw new Error(tokenData.error ?? "GitHub token exchange failed");
  }

  const headers = {
    Authorization: `Bearer ${tokenData.access_token}`,
    Accept: "application/vnd.github+json",
    "User-Agent": "architect-os",
  };

  const userRes = await fetch("https://api.github.com/user", { headers });
  const user = (await userRes.json()) as {
    id?: number;
    login?: string;
    name?: string | null;
    email?: string | null;
    avatar_url?: string;
  };

  if (!user.id) throw new Error("GitHub profile missing id");

  let email = user.email ?? "";
  if (!email) {
    const emailsRes = await fetch("https://api.github.com/user/emails", {
      headers,
    });
    const emails = (await emailsRes.json()) as Array<{
      email: string;
      primary: boolean;
      verified: boolean;
    }>;
    const primary =
      emails.find((e) => e.primary && e.verified) ??
      emails.find((e) => e.verified);
    email = primary?.email ?? "";
  }

  if (!email) {
    throw new Error(
      "GitHub account has no public email — add one in GitHub settings",
    );
  }

  return {
    id: String(user.id),
    email,
    name: user.name ?? user.login ?? email.split("@")[0],
    picture: user.avatar_url,
  };
}

async function handleCallback(
  provider: Provider,
  req: Request,
  res: Response,
): Promise<void> {
  const error = req.query.error as string | undefined;
  if (error) {
    redirectOAuthError(res, `OAuth cancelled: ${error}`);
    return;
  }

  const state = req.query.state as string | undefined;
  const cookieState = req.cookies?.oauth_state as string | undefined;
  if (!verifyOAuthState(res, state, cookieState)) {
    redirectOAuthError(res, "Invalid OAuth state — try again");
    return;
  }

  const code = req.query.code as string | undefined;
  if (!code) {
    redirectOAuthError(res, "Missing OAuth authorization code");
    return;
  }

  try {
    const profile =
      provider === "google"
        ? await exchangeGoogleCode(code)
        : await exchangeGithubCode(code);

    const user = await findOrCreateOAuthUser({
      provider,
      providerAccountId: profile.id,
      email: profile.email,
      name: profile.name,
      image: profile.picture,
    });

    loginUser(user.id, res);
    redirectOAuthSuccess(res);
  } catch (err) {
    redirectOAuthError(
      res,
      err instanceof Error ? err.message : "OAuth sign-in failed",
    );
  }
}

export function handleGoogleStart(_req: Request, res: Response): void {
  startOAuth("google", res);
}

export function handleGoogleCallback(req: Request, res: Response): void {
  void handleCallback("google", req, res);
}

export function handleGithubStart(_req: Request, res: Response): void {
  startOAuth("github", res);
}

export function handleGithubCallback(req: Request, res: Response): void {
  void handleCallback("github", req, res);
}

export function getOAuthProviders(): { google: boolean; github: boolean } {
  return {
    google: isConfigured("google"),
    github: isConfigured("github"),
  };
}

/** For health / debug — never expose secrets. */
export function oauthStatus(): {
  appUrl: string;
  google: boolean;
  github: boolean;
  googleRedirect: string;
  githubRedirect: string;
} {
  return {
    appUrl: appUrl(),
    google: isConfigured("google"),
    github: isConfigured("github"),
    googleRedirect: oauthCallbackUrl("google"),
    githubRedirect: oauthCallbackUrl("github"),
  };
}
