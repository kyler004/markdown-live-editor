import { createContext, useContext } from "react";
import type { PublicUser } from "../api/auth";

export interface AuthContextValue {
  user: PublicUser | null;
  loading: boolean;
  hasPassword: boolean;
  oauthProviders: string[];
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name?: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (name: string) => Promise<void>;
  changePassword: (current: string, next: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
