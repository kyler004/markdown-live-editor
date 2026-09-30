import type { ThemeKey } from "../pages/landing-themes";

export const THEME_STORAGE_KEY = "architect-os-theme";
const LEGACY_STORAGE_KEY = "architect-theme";

const LEGACY_TO_THEME: Record<string, ThemeKey> = {
  neon: "cyber-green",
  white: "light-blue",
  obsidian: "obsidian-silver",
};

export function readStoredTheme(): ThemeKey {
  if (typeof window === "undefined") return "cyber-green";

  const current = localStorage.getItem(THEME_STORAGE_KEY);
  if (isThemeKey(current)) return current;

  const legacy = localStorage.getItem(LEGACY_STORAGE_KEY);
  if (legacy && LEGACY_TO_THEME[legacy]) {
    const migrated = LEGACY_TO_THEME[legacy];
    writeStoredTheme(migrated);
    localStorage.removeItem(LEGACY_STORAGE_KEY);
    return migrated;
  }

  if (legacy && isThemeKey(legacy)) {
    writeStoredTheme(legacy);
    localStorage.removeItem(LEGACY_STORAGE_KEY);
    return legacy;
  }

  return "cyber-green";
}

export function writeStoredTheme(theme: ThemeKey): void {
  localStorage.setItem(THEME_STORAGE_KEY, theme);
}

export function isThemeKey(value: string | null): value is ThemeKey {
  return (
    value === "light-blue" ||
    value === "cyber-green" ||
    value === "obsidian-silver"
  );
}

/** Resolve terminal / CLI theme aliases to a canonical key */
export function resolveThemeArg(arg: string): ThemeKey | null {
  const a = arg.toLowerCase();
  if (a === "light-blue" || a === "light" || a === "blue") return "light-blue";
  if (a === "cyber-green" || a === "cyber" || a === "green") return "cyber-green";
  if (a === "obsidian-silver" || a === "obsidian" || a === "silver") {
    return "obsidian-silver";
  }
  if (LEGACY_TO_THEME[a]) return LEGACY_TO_THEME[a];
  return null;
}
