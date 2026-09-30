import { Link } from "react-router-dom";
import type { LandingTheme, ThemeKey } from "../../pages/landing-themes";
import { LANDING_WIDE } from "../../pages/landing-layout";
import { isExternalNav, navItemHref } from "../../lib/marketing-nav";
import ThemeSwitcher from "../auth/ThemeSwitcher";
import LanguageSwitcher from "../LanguageSwitcher";

interface MarketingHeaderProps {
  theme: ThemeKey;
  onThemeChange: (key: ThemeKey) => void;
  t: LandingTheme;
  statusBarClass: string;
  statusLeft?: string;
  statusCenter?: string;
  statusRight?: string;
  headerTo: string;
  headerLabel: string;
  showThemeSwitcher?: boolean;
}

export default function MarketingHeader({
  theme,
  onThemeChange,
  t,
  statusBarClass,
  statusLeft = "SYS.STATUS: ONLINE",
  statusCenter = "LATENCY: 0.12ms",
  statusRight,
  headerTo,
  headerLabel,
  showThemeSwitcher = true,
}: MarketingHeaderProps) {
  const navItems = t.navKeys.map((key, i) => ({
    key,
    label: t.nav[i] ?? key,
  }));

  return (
    <header className={`border-b ${t.border} relative z-10`}>
      <div
        className={`${LANDING_WIDE} h-16 md:h-[4.5rem] grid grid-cols-[1fr_auto_1fr] items-center gap-4`}
      >
        <Link
          to="/"
          className={`${t.logoClass} text-sm md:text-base tracking-widest uppercase shrink-0`}
        >
          {t.brand}
        </Link>
        <nav
          className={`hidden md:flex gap-10 text-[11px] tracking-[0.2em] uppercase ${t.navClass}`}
        >
          {navItems.map(({ key, label }) => {
            const href = navItemHref(key);
            const external = isExternalNav(key);
            const className = "hover:opacity-80 transition-opacity";
            if (external) {
              return (
                <a
                  key={key}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={className}
                >
                  {label}
                </a>
              );
            }
            if (href.startsWith("/#")) {
              return (
                <a key={key} href={href} className={className}>
                  {label}
                </a>
              );
            }
            return (
              <Link key={key} to={href} className={className}>
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="flex justify-end items-center gap-2 sm:gap-3">
          <LanguageSwitcher compact className="hidden md:flex" />
          {showThemeSwitcher && (
            <ThemeSwitcher
              theme={theme}
              onChange={onThemeChange}
              className="hidden sm:flex"
            />
          )}
          <Link to={headerTo} className={t.headerCtaClass}>
            {headerLabel}
          </Link>
        </div>
      </div>
      <div
        className={`border-t font-mono text-[10px] md:text-[11px] py-2 px-6 md:px-10 lg:px-12 xl:px-16 flex justify-between gap-4 ${statusBarClass}`}
      >
        <span className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
          {statusLeft}
        </span>
        {statusCenter && (
          <span className="hidden sm:inline">{statusCenter}</span>
        )}
        {statusRight && (
          <span className="hidden md:inline">{statusRight}</span>
        )}
      </div>
    </header>
  );
}
