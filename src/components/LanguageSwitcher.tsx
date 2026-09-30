import { useTranslation } from "react-i18next";
import { setAppLocale } from "../i18n";
import { isAppLocale, type AppLocale } from "../i18n/locale-storage";

interface LanguageSwitcherProps {
  className?: string;
  compact?: boolean;
}

const LOCALES: AppLocale[] = ["en", "fr"];

export default function LanguageSwitcher({
  className = "",
  compact = false,
}: LanguageSwitcherProps) {
  const { i18n, t } = useTranslation("common");
  const current = isAppLocale(i18n.language) ? i18n.language : "en";

  return (
    <div
      className={`flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider ${className}`}
      role="group"
      aria-label={t("lang.label")}
    >
      {!compact && (
        <span className="text-zinc-500 mr-1 hidden sm:inline">{t("lang.label")}</span>
      )}
      {LOCALES.map((locale) => (
        <button
          key={locale}
          type="button"
          onClick={() => setAppLocale(locale)}
          className={`px-2.5 py-1 rounded-sm border transition-colors ${
            current === locale
              ? "border-white/40 bg-white/10 text-white"
              : "border-zinc-700 text-zinc-500 hover:text-zinc-300 hover:border-zinc-500"
          }`}
        >
          {locale}
        </button>
      ))}
    </div>
  );
}
