export interface PublicUser {
  id: string;
  email: string;
  name: string;
  image?: string | null;
}

export interface UserProfile {
  user: PublicUser;
  hasPassword: boolean;
  oauthProviders: string[];
}

class AuthApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "AuthApiError";
    this.status = status;
  }
}

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...init?.headers },
    ...init,
  });
  const data = (await res.json().catch(() => ({}))) as T & { error?: string };
  if (!res.ok) {
    throw new AuthApiError(data.error ?? res.statusText, res.status);
  }
  return data;
}

export async function fetchMe(): Promise<{ user: PublicUser | null }> {
  return request("/api/auth/me");
}

export async function fetchProfile(): Promise<UserProfile> {
  return request("/api/auth/profile");
}

export async function updateProfile(name: string): Promise<UserProfile> {
  return request("/api/auth/profile", {
    method: "PATCH",
    body: JSON.stringify({ name }),
  });
}

export async function changePassword(
  currentPassword: string,
  newPassword: string,
): Promise<void> {
  await request("/api/auth/change-password", {
    method: "POST",
    body: JSON.stringify({ currentPassword, newPassword }),
  });
}

export async function signUp(
  email: string,
  password: string,
  name?: string,
): Promise<{ user: PublicUser }> {
  return request("/api/auth/sign-up", {
    method: "POST",
    body: JSON.stringify({ email, password, name }),
  });
}

export async function signIn(
  email: string,
  password: string,
): Promise<{ user: PublicUser }> {
  return request("/api/auth/sign-in", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function signOut(): Promise<void> {
  await request("/api/auth/sign-out", { method: "POST" });
}

export async function fetchOAuthProviders(): Promise<{
  google: boolean;
  github: boolean;
}> {
  return request("/api/auth/providers");
}

export { AuthApiError };
