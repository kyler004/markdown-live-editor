import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { fetchOAuthProviders } from "../api/auth";
import type { AuthTheme } from "../pages/auth-themes";

interface OAuthButtonsProps {
  theme: AuthTheme;
}

export default function OAuthButtons({ theme: t }: OAuthButtonsProps) {
  const { t: ta } = useTranslation("auth");
  const [providers, setProviders] = useState({ google: false, github: false });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetchOAuthProviders()
      .then(setProviders)
      .catch(() => setProviders({ google: false, github: false }))
      .finally(() => setLoaded(true));
  }, []);

  if (!loaded || (!providers.google && !providers.github)) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className={`h-px flex-1 ${t.divider}`} />
        <span
          className={`text-[10px] ${t.subtext} font-mono uppercase tracking-[0.2em]`}
        >
          {ta("oauth.orContinue")}
        </span>
        <div className={`h-px flex-1 ${t.divider}`} />
      </div>
      <div className="flex flex-col gap-3">
        {providers.google && (
          <a
            href="/api/auth/google"
            className={`w-full py-3 rounded-sm border font-mono text-sm text-center transition-colors ${t.btnOAuth}`}
          >
            {ta("oauth.google")}
          </a>
        )}
        {providers.github && (
          <a
            href="/api/auth/github"
            className={`w-full py-3 rounded-sm border font-mono text-sm text-center transition-colors ${t.btnOAuth}`}
          >
            {ta("oauth.github")}
          </a>
        )}
      </div>
    </div>
  );
}
