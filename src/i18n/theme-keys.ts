import type { ThemeKey } from "../pages/landing-themes";

/** Map visual theme id → i18n path segment under landing.themes */
export const THEME_I18N_KEY: Record<ThemeKey, string> = {
  "light-blue": "light-blue",
  "cyber-green": "cyber-green",
  "obsidian-silver": "obsidian-silver",
};

export function themeTKey(theme: ThemeKey, path: string): string {
  return `themes.${theme}.${path}`;
}
