export type AppLocale = "en" | "fr";

export const LOCALE_STORAGE_KEY = "architect-locale";

export function readStoredLocale(): AppLocale {
  if (typeof window === "undefined") return "en";
  const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
  if (stored === "en" || stored === "fr") return stored;

  const browser = navigator.language.toLowerCase();
  if (browser.startsWith("fr")) return "fr";
  return "en";
}

export function writeStoredLocale(locale: AppLocale): void {
  localStorage.setItem(LOCALE_STORAGE_KEY, locale);
}

export function isAppLocale(value: string): value is AppLocale {
  return value === "en" || value === "fr";
}
