import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import HeroPreview from "../components/landing/HeroPreview";
import LandingAmbient from "../components/landing/LandingAmbient";
import LandingTicker from "../components/landing/LandingTicker";
import RenderingCompare from "../components/landing/RenderingCompare";
import StatsSection from "../components/landing/StatsSection";
import type { LandingTheme, ThemeKey } from "./landing-themes";
import { LANDING_CONTAINER, LANDING_WIDE } from "./landing-layout";
import { useAppTheme } from "../hooks/useAppTheme";
import { useLandingTheme } from "../hooks/useLandingThemes";
import ThemeSwitcher from "../components/auth/ThemeSwitcher";
import LanguageSwitcher from "../components/LanguageSwitcher";
import MarketingHeader from "../components/marketing/MarketingHeader";

function FeatureCard({
  feature,
  theme,
  themeKey,
}: {
  feature: LandingTheme["features"][number];
  theme: LandingTheme;
  themeKey: ThemeKey;
}) {
  const Icon = feature.icon;
  const isTypo = feature.variant === "typography";

  const cardClass =
    isTypo && themeKey === "light-blue"
      ? "bg-[#0055ff] text-white border-[#0055ff]"
      : isTypo && themeKey === "cyber-green"
        ? `${theme.border} border ${themeKey === "cyber-green" ? "bg-[#130410]" : theme.bg}`
        : `${theme.border} border ${themeKey === "light-blue" && feature.variant === "small" ? "bg-slate-50" : themeKey === "obsidian-silver" ? "bg-[#070707]" : themeKey === "light-blue" ? "bg-white" : "bg-[#130410]"}`;

  return (
    <div
      className={`${cardClass} p-8 md:p-10 flex flex-col justify-between min-h-[240px] md:min-h-[280px] relative`}
    >
      <div>
        {isTypo ? (
          <div
            className={`mb-6 text-3xl md:text-4xl font-black ${themeKey === "light-blue" ? "text-white" : theme.accentText}`}
          >
            Tt
          </div>
        ) : (
          <Icon
            size={28}
            className={`mb-6 ${themeKey === "light-blue" && !isTypo ? "text-[#0055ff]" : theme.accentText}`}
            strokeWidth={1.5}
          />
        )}
        <h3 className="text-base md:text-lg font-black uppercase tracking-wide mb-3">
          {feature.title}
        </h3>
        <p
          className={`font-mono text-xs md:text-sm leading-relaxed max-w-xl ${isTypo && themeKey === "light-blue" ? "text-blue-100" : theme.subtext}`}
        >
          {feature.desc}
        </p>
      </div>
      {feature.tags && (
        <div className="flex flex-wrap gap-2 font-mono text-[10px] md:text-[11px] text-zinc-500 mt-8">
          {feature.tags.map((tag) => (
            <span key={tag}>[ {tag} ]</span>
          ))}
        </div>
      )}
      {feature.variant === "wide" && (
        <div className="hidden md:flex ml-auto mt-6 md:mt-0 md:absolute md:right-10 md:top-1/2 md:-translate-y-1/2">
          <div
            className={`w-24 h-24 md:w-28 md:h-28 border ${theme.border} flex items-center justify-center ${themeKey === "obsidian-silver" ? "bg-zinc-950" : "bg-black/20"}`}
          >
            <Icon size={36} className={theme.accentText} strokeWidth={1.25} />
          </div>
        </div>
      )}
    </div>
  );
}

export default function Landing() {
  const { user } = useAuth();
  const { t: tc } = useTranslation("common");
  const { theme: currentTheme, setTheme: setCurrentTheme } = useAppTheme();
  const t = useLandingTheme(currentTheme);

  const primaryTo = user ? "/app" : "/signup";
  const primaryLabel = user
    ? tc("cta.openWorkspace")
    : tc("cta.initializeDownload");
  const headerTo =
    t.headerCta === "get-started" ? (user ? "/app" : "/signup") : user ? "/app" : "/login";
  const headerLabel =
    t.headerCta === "get-started"
      ? user
        ? tc("cta.app")
        : tc("cta.getStarted")
      : user
        ? tc("cta.app")
        : tc("cta.login");

  const statusBarClass =
    currentTheme === "light-blue"
      ? "border-slate-200 bg-slate-50/90 text-slate-400"
      : currentTheme === "cyber-green"
        ? "border-[#2a1525] bg-[#0a0208]/90 text-[#00ff66]/60"
        : "border-zinc-900 bg-zinc-950/90 text-zinc-600";

  return (
    <div
      className={`${t.bg} ${t.text} font-sans antialiased min-h-screen transition-colors duration-500 relative`}
    >
      <LandingAmbient theme={currentTheme} />

      <MarketingHeader
        theme={currentTheme}
        onThemeChange={setCurrentTheme}
        t={t}
        statusBarClass={statusBarClass}
        statusLeft={tc("status.online")}
        statusCenter={tc("status.latency")}
        statusRight={t.featuresVersion ?? tc("status.build")}
        headerTo={headerTo}
        headerLabel={headerLabel}
        showThemeSwitcher={false}
      />

      {/* Hero */}
      <section id="home" className={`${LANDING_WIDE} pt-16 md:pt-20 pb-14 md:pb-20`}>
        <div className="text-center">
          <span
            className={`inline-block font-mono text-[10px] md:text-[11px] uppercase px-5 py-2 border mb-10 ${t.badgeClass}`}
          >
            {t.heroBadge}
          </span>

          <h1
            className={`font-black tracking-tighter uppercase leading-[0.88] mb-10 ${
              t.heroStacked
                ? "text-7xl md:text-8xl lg:text-9xl flex flex-col"
                : "text-6xl md:text-7xl lg:text-8xl xl:text-9xl flex flex-wrap justify-center gap-x-5"
            }`}
          >
            <span className={t.heroTitle1}>{tc("hero.title1")}</span>
            <span className={t.heroTitle2}>{tc("hero.title2")}</span>
          </h1>

          <p
            className={`${t.subtext} font-mono text-sm md:text-base max-w-3xl mx-auto leading-relaxed mb-12`}
          >
            {t.heroDesc}
          </p>

          <div className="flex flex-col sm:flex-row gap-5 justify-center font-mono mb-16 md:mb-20">
            <Link to={primaryTo} className={t.btnPrimary}>
              {primaryLabel}
            </Link>
            <a href="#features" className={t.btnSecondary}>
              {t.secondaryLabel}
            </a>
          </div>
        </div>

        <HeroPreview theme={currentTheme} />
      </section>

      <LandingTicker theme={currentTheme} />

      {/* Features */}
      <section
        id="features"
        className={`${LANDING_CONTAINER} py-20 md:py-28`}
      >
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6 mb-14 md:mb-16">
          <div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-black uppercase tracking-tight mb-3">
              {t.featuresTitle}
            </h2>
            <p
              className={`${t.subtext} font-mono text-sm max-w-lg leading-relaxed`}
            >
              {t.featuresDesc}
            </p>
          </div>
          {t.featuresVersion && (
            <span className="font-mono text-[10px] text-zinc-500 tracking-widest shrink-0">
              {t.featuresVersion}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-7">
          {t.features.map((feature) => (
            <div
              key={feature.title}
              className={`relative ${
                feature.variant === "large" || feature.variant === "wide"
                  ? "md:col-span-2"
                  : ""
              }`}
            >
              <FeatureCard
                feature={feature}
                theme={t}
                themeKey={currentTheme}
              />
            </div>
          ))}
        </div>
      </section>

      <RenderingCompare theme={currentTheme} />

      <StatsSection theme={currentTheme} />

      {/* Final CTA */}
      <section className={`${LANDING_CONTAINER} py-24 md:py-32 text-center relative`}>
        <div
          className={`absolute inset-0 pointer-events-none opacity-30 ${
            currentTheme === "cyber-green"
              ? "bg-[radial-gradient(ellipse_at_center,rgba(0,255,102,0.12),transparent_70%)]"
              : currentTheme === "light-blue"
                ? "bg-[radial-gradient(ellipse_at_center,rgba(0,85,255,0.08),transparent_70%)]"
                : "bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.04),transparent_70%)]"
          }`}
        />
        <div className="relative">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter mb-6">
            {t.ctaTitle}
          </h2>
          <p
            className={`${t.subtext} font-mono text-sm max-w-xl mx-auto mb-12 leading-relaxed`}
          >
            {t.ctaDesc}
          </p>
          <Link to={primaryTo} className={`${t.btnPrimary} inline-block`}>
            {primaryLabel}
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer
        className={`border-t ${t.border} py-10 px-6 font-mono text-[10px] uppercase tracking-widest ${t.subtext}`}
      >
        <div
          className={`${LANDING_CONTAINER} flex flex-col md:flex-row justify-between items-center gap-5`}
        >
          <div className={`font-bold text-sm ${t.text}`}>{t.brand}</div>
          <div className="flex flex-wrap justify-center gap-8">
            {t.footerLinks.map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase()}`}
                className="hover:opacity-80"
              >
                {link}
              </a>
            ))}
          </div>
          <div>{t.footerMeta}</div>
        </div>
      </footer>

      <div className="fixed bottom-5 right-5 z-50 flex flex-col sm:flex-row items-end gap-3">
        <LanguageSwitcher className="bg-zinc-950/90 backdrop-blur-sm border border-zinc-800 rounded-full px-2 py-1.5 shadow-xl" />
        <ThemeSwitcher
          theme={currentTheme}
          onChange={setCurrentTheme}
          className="shadow-xl"
        />
      </div>
    </div>
  );
}
