import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import type { AuthTheme } from "../pages/auth-themes";
import type { ThemeKey } from "../pages/landing-themes";
import { authThemeStyles } from "../pages/auth-theme-styles";

const THEME_KEYS: ThemeKey[] = [
  "light-blue",
  "cyber-green",
  "obsidian-silver",
];

export function useAuthThemes(): Record<ThemeKey, AuthTheme> {
  const { t } = useTranslation("auth");

  return useMemo(() => {
    const themes = {} as Record<ThemeKey, AuthTheme>;

    for (const key of THEME_KEYS) {
      const style = authThemeStyles[key];
      const prefix = `themes.${key}`;

      const terminalLines = t(`${prefix}.terminalLines`, {
        returnObjects: true,
      }) as Array<{ prefix?: string; text: string; accent?: boolean }>;

      const perks = t(`${prefix}.perks`, {
        returnObjects: true,
      }) as string[];

      themes[key] = {
        ...style,
        panelBadge: t(`${prefix}.panelBadge`),
        panelTitle: t(`${prefix}.panelTitle`),
        panelDesc: t(`${prefix}.panelDesc`),
        terminalLines: Array.isArray(terminalLines) ? terminalLines : [],
        perks: Array.isArray(perks) ? perks : [],
        loginTitle: t(`${prefix}.loginTitle`),
        loginSubtitle: t(`${prefix}.loginSubtitle`),
        signupTitle: t(`${prefix}.signupTitle`),
        signupSubtitle: t(`${prefix}.signupSubtitle`),
      };
    }

    return themes;
  }, [t]);
}

export function useAuthTheme(key: ThemeKey): AuthTheme {
  return useAuthThemes()[key];
}
