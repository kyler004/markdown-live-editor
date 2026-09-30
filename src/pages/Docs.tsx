import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import LandingAmbient from "../components/landing/LandingAmbient";
import MarketingHeader from "../components/marketing/MarketingHeader";
import ThemeSwitcher from "../components/auth/ThemeSwitcher";
import LanguageSwitcher from "../components/LanguageSwitcher";
import { useAppTheme } from "../hooks/useAppTheme";
import { useLandingTheme } from "../hooks/useLandingThemes";
import { LANDING_WIDE } from "./landing-layout";
import { useDocSections, type DocBlock } from "../hooks/useDocSections";

function DocBlockView({
  block,
  codeClass,
  subtext,
  accent,
  border,
}: {
  block: DocBlock;
  codeClass: string;
  subtext: string;
  accent: string;
  border: string;
}) {
  switch (block.type) {
    case "p":
      return (
        <p className={`${subtext} font-mono text-sm leading-relaxed mb-5`}>
          {block.text}
        </p>
      );
    case "h3":
      return (
        <h3
          className={`${accent} font-black uppercase tracking-wide text-sm mb-3 mt-8 first:mt-0`}
        >
          {block.text}
        </h3>
      );
    case "code":
      return (
        <pre
          className={`${codeClass} border ${border} p-5 font-mono text-xs md:text-sm leading-relaxed overflow-x-auto mb-6 whitespace-pre-wrap`}
        >
          {block.text}
        </pre>
      );
    case "ul":
      return (
        <ul className={`${subtext} font-mono text-sm space-y-2 mb-6 list-none`}>
          {block.items.map((item) => (
            <li key={item} className="flex gap-3">
              <span className={accent}>—</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
    case "table":
      return (
        <div className={`overflow-x-auto mb-6 border ${border}`}>
          <table className="w-full font-mono text-xs md:text-sm">
            <thead>
              <tr className={`border-b ${border}`}>
                {block.headers.map((h) => (
                  <th
                    key={h}
                    className={`text-left px-4 py-3 uppercase tracking-wider ${accent}`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, i) => (
                <tr key={i} className={`border-b ${border} last:border-0`}>
                  {row.map((cell, j) => (
                    <td key={j} className={`px-4 py-3 ${subtext}`}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    default:
      return null;
  }
}

export default function Docs() {
  const { user } = useAuth();
  const { t: tc } = useTranslation("common");
  const { theme, setTheme } = useAppTheme();
  const t = useLandingTheme(theme);
  const docSections = useDocSections();
  const [activeId, setActiveId] = useState(docSections[0]?.id ?? "getting-started");

  const headerTo = user ? "/app" : "/signup";
  const headerLabel = user ? tc("cta.app") : tc("cta.getStarted");

  const statusBarClass =
    theme === "light-blue"
      ? "border-slate-200 bg-slate-50/90 text-slate-400"
      : theme === "cyber-green"
        ? "border-[#2a1525] bg-[#0a0208]/90 text-[#00ff66]/60"
        : "border-zinc-900 bg-zinc-950/90 text-zinc-600";

  const codeClass =
    theme === "light-blue"
      ? "bg-slate-50 text-slate-800"
      : theme === "cyber-green"
        ? "bg-black text-[#00ff66]/90"
        : "bg-zinc-950 text-zinc-300";

  const navActiveClass =
    theme === "light-blue"
      ? "bg-[#0055ff]/10 text-[#0055ff] border-[#0055ff]/30"
      : theme === "cyber-green"
        ? "bg-[#00ff66]/10 text-[#00ff66] border-[#00ff66]/30"
        : "bg-white/10 text-white border-zinc-700";

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target.id) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: [0, 0.25, 0.5] },
    );

    docSections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [docSections]);

  return (
    <div
      className={`${t.bg} ${t.text} min-h-screen font-sans antialiased transition-colors duration-500 relative`}
    >
      <LandingAmbient theme={theme} />

      <MarketingHeader
        theme={theme}
        onThemeChange={setTheme}
        t={t}
        statusBarClass={statusBarClass}
        statusLeft={tc("status.docsLive")}
        statusCenter={tc("status.build")}
        statusRight={tc("docsPage.sectionsCount")}
        headerTo={headerTo}
        headerLabel={headerLabel}
        showThemeSwitcher={false}
      />

      <main className={`${LANDING_WIDE} py-12 md:py-16 lg:py-20 relative z-10`}>
        <div className="mb-12 md:mb-16">
          <span
            className={`inline-block font-mono text-[10px] uppercase px-4 py-1.5 border mb-6 ${t.badgeClass}`}
          >
            {tc("docsPage.badge")}
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter mb-4">
            {tc("docsPage.title")}
          </h1>
          <p className={`${t.subtext} font-mono text-sm max-w-2xl leading-relaxed`}>
            {tc("docsPage.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-10 lg:gap-16">
          <nav className="lg:sticky lg:top-8 lg:self-start">
            <p
              className={`font-mono text-[10px] uppercase tracking-[0.2em] mb-4 ${t.subtext}`}
            >
              {tc("docsPage.contents")}
            </p>
            <ul className="space-y-1">
              {docSections.map((section) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className={`block font-mono text-xs md:text-sm px-3 py-2 border border-transparent rounded-sm transition-colors ${
                      activeId === section.id
                        ? navActiveClass
                        : `${t.subtext} hover:opacity-80`
                    }`}
                  >
                    {section.title}
                  </a>
                </li>
              ))}
            </ul>
            <div className={`mt-8 pt-6 border-t ${t.border}`}>
              <Link
                to={user ? "/app" : "/signup"}
                className={`font-mono text-xs uppercase tracking-widest ${t.accentText} hover:opacity-80`}
              >
                {user ? tc("docsPage.openWorkspace") : tc("docsPage.getStarted")}
              </Link>
            </div>
          </nav>

          <article className="min-w-0">
            {docSections.map((section, idx) => (
              <section
                key={section.id}
                id={section.id}
                className={`pb-14 mb-14 last:mb-0 last:pb-0 ${
                  idx < docSections.length - 1 ? `border-b ${t.border}` : ""
                }`}
              >
                <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight mb-6">
                  {section.title}
                </h2>
                {section.content.map((block, i) => (
                  <DocBlockView
                    key={`${section.id}-${i}`}
                    block={block}
                    codeClass={codeClass}
                    subtext={t.subtext}
                    accent={t.accentText}
                    border={t.border}
                  />
                ))}
              </section>
            ))}
          </article>
        </div>
      </main>

      <div className="fixed bottom-5 right-5 z-50 flex flex-col sm:flex-row items-end gap-3">
        <LanguageSwitcher className="bg-zinc-950/90 backdrop-blur-sm border border-zinc-800 rounded-full px-2 py-1.5 shadow-xl" />
        <ThemeSwitcher theme={theme} onChange={setTheme} className="shadow-xl" />
      </div>
    </div>
  );
}
