import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LandingAmbient from "../landing/LandingAmbient";
import ThemeSwitcher from "./ThemeSwitcher";
import LanguageSwitcher from "../LanguageSwitcher";
import { useAuthTheme } from "../../hooks/useAuthThemes";
import type { ThemeKey } from "../../pages/landing-themes";

interface AuthPageLayoutProps {
  theme: ThemeKey;
  onThemeChange: (key: ThemeKey) => void;
  mode: "login" | "signup";
  children: React.ReactNode;
  footer: React.ReactNode;
}

export default function AuthPageLayout({
  theme,
  onThemeChange,
  mode,
  children,
  footer,
}: AuthPageLayoutProps) {
  const { t: tc } = useTranslation("common");
  const { t: ta } = useTranslation("auth");
  const t = useAuthTheme(theme);
  const title = mode === "login" ? t.loginTitle : t.signupTitle;
  const subtitle = mode === "login" ? t.loginSubtitle : t.signupSubtitle;

  return (
    <div
      className={`${t.bg} ${t.text} min-h-screen font-sans antialiased transition-colors duration-500 relative`}
    >
      <LandingAmbient theme={theme} />

      <header className={`border-b ${t.border} relative z-10`}>
        <div className="max-w-[90rem] mx-auto px-6 md:px-10 lg:px-12 h-16 md:h-[4.5rem] flex items-center justify-between gap-4">
          <Link
            to="/"
            className={`${t.logoClass} text-sm md:text-base tracking-widest uppercase shrink-0`}
          >
            {t.brand}
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            <LanguageSwitcher compact />
            <ThemeSwitcher theme={theme} onChange={onThemeChange} />
          </div>
        </div>
        <div
          className={`border-t font-mono text-[10px] md:text-[11px] py-2 px-6 md:px-10 lg:px-12 flex justify-between gap-4 ${t.statusBarClass}`}
        >
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
            {tc("status.authReady")}
          </span>
          <span className="hidden sm:inline">{tc("status.tls")}</span>
          <span className="hidden md:inline">
            {mode === "login" ? tc("authGate.login") : tc("authGate.signup")}
          </span>
        </div>
      </header>

      <main className="relative z-10 max-w-[90rem] mx-auto px-6 md:px-10 lg:px-12 py-10 md:py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-8 lg:gap-12 xl:gap-16 items-stretch">
          <AuthPanel theme={theme} />

          <div
            className={`${t.cardBg} border ${t.border} p-8 md:p-10 lg:p-12 flex flex-col justify-center shadow-xl`}
          >
            <span
              className={`inline-block self-start font-mono text-[10px] uppercase px-4 py-1.5 border mb-6 ${t.badgeClass}`}
            >
              {mode === "login" ? ta("badges.accessRequest") : ta("badges.newIdentity")}
            </span>
            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-2">
              {title}
            </h1>
            <p className={`${t.subtext} font-mono text-sm mb-8 leading-relaxed`}>
              {subtitle}
            </p>
            {children}
            <div className="mt-8 pt-6 border-t border-inherit">{footer}</div>
          </div>
        </div>
      </main>
    </div>
  );
}

function AuthPanel({ theme }: { theme: ThemeKey }) {
  const t = useAuthTheme(theme);

  return (
    <div
      className={`${t.panelBg} border ${t.border} p-8 md:p-10 lg:p-12 flex flex-col justify-between min-h-[320px] lg:min-h-[520px]`}
    >
      <div>
        <span
          className={`inline-block font-mono text-[10px] uppercase px-4 py-1.5 border mb-8 ${t.badgeClass}`}
        >
          {t.panelBadge}
        </span>
        <h2
          className={`text-2xl md:text-3xl lg:text-4xl font-black uppercase tracking-tight leading-tight mb-5 ${t.panelAccent}`}
        >
          {t.panelTitle}
        </h2>
        <p className={`${t.subtext} font-mono text-sm leading-relaxed max-w-lg mb-10`}>
          {t.panelDesc}
        </p>

        <div
          className={`${t.terminalBg} border ${t.terminalBorder} p-5 font-mono text-xs md:text-sm space-y-2 mb-10`}
        >
          {t.terminalLines.map((line, i) => (
            <div key={i} className="flex gap-3">
              {line.prefix && (
                <span className={`${t.terminalPrompt} shrink-0 select-none`}>
                  {line.prefix}
                </span>
              )}
              <span
                className={
                  line.accent ? `${t.panelAccent} font-semibold` : t.subtext
                }
              >
                {line.text}
              </span>
            </div>
          ))}
          <div className="flex gap-3 pt-1">
            <span className={t.terminalPrompt}>_</span>
            <span className={`${t.panelAccent} animate-pulse`}>|</span>
          </div>
        </div>
      </div>

      <ul className="space-y-3">
        {t.perks.map((perk) => (
          <li
            key={perk}
            className={`flex items-center gap-3 font-mono text-[11px] md:text-xs uppercase tracking-wide ${t.subtext}`}
          >
            <span className={`w-1.5 h-1.5 shrink-0 ${t.panelAccent}`} />
            {perk}
          </li>
        ))}
      </ul>
    </div>
  );
}
