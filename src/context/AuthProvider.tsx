import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  changePassword as apiChangePassword,
  fetchMe,
  fetchProfile,
  signIn as apiSignIn,
  signOut as apiSignOut,
  signUp as apiSignUp,
  updateProfile as apiUpdateProfile,
  type PublicUser,
} from "../api/auth";
import { AuthContext } from "./AuthContext";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<PublicUser | null>(null);
  const [hasPassword, setHasPassword] = useState(true);
  const [oauthProviders, setOauthProviders] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const applyProfile = useCallback(
    (profile: {
      user: PublicUser;
      hasPassword: boolean;
      oauthProviders: string[];
    }) => {
      setUser(profile.user);
      setHasPassword(profile.hasPassword);
      setOauthProviders(profile.oauthProviders);
    },
    [],
  );

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const { user: me } = await fetchMe();
        if (!active) return;
        if (me) {
          const profile = await fetchProfile();
          if (active) applyProfile(profile);
        } else {
          setUser(null);
        }
      } catch {
        if (active) setUser(null);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [applyProfile]);

  const signIn = useCallback(async (email: string, password: string) => {
    const { user: u } = await apiSignIn(email, password);
    setUser(u);
    const profile = await fetchProfile();
    applyProfile(profile);
  }, [applyProfile]);

  const signUp = useCallback(
    async (email: string, password: string, name?: string) => {
      const { user: u } = await apiSignUp(email, password, name);
      setUser(u);
      setHasPassword(true);
      setOauthProviders([]);
    },
    [],
  );

  const signOut = useCallback(async () => {
    await apiSignOut();
    setUser(null);
    setHasPassword(true);
    setOauthProviders([]);
  }, []);

  const updateProfile = useCallback(
    async (name: string) => {
      const profile = await apiUpdateProfile(name);
      applyProfile(profile);
    },
    [applyProfile],
  );

  const changePassword = useCallback(
    async (currentPassword: string, newPassword: string) => {
      await apiChangePassword(currentPassword, newPassword);
      setHasPassword(true);
    },
    [],
  );

  const value = useMemo(
    () => ({
      user,
      loading,
      hasPassword,
      oauthProviders,
      signIn,
      signUp,
      signOut,
      updateProfile,
      changePassword,
    }),
    [
      user,
      loading,
      hasPassword,
      oauthProviders,
      signIn,
      signUp,
      signOut,
      updateProfile,
      changePassword,
    ],
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}
