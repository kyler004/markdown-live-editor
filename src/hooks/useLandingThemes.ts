import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import type { LandingTheme, ThemeKey } from "../pages/landing-themes";
import { landingThemeStyles } from "../pages/landing-theme-styles";

const THEME_KEYS: ThemeKey[] = [
  "light-blue",
  "cyber-green",
  "obsidian-silver",
];

export function useLandingThemes(): Record<ThemeKey, LandingTheme> {
  const { t } = useTranslation(["landing", "common"]);

  return useMemo(() => {
    const themes = {} as Record<ThemeKey, LandingTheme>;

    for (const key of THEME_KEYS) {
      const style = landingThemeStyles[key];
      const prefix = `themes.${key}`;

      themes[key] = {
        name: t(`themeNames.${key}`, { ns: "common" }),
        brand: t(`${prefix}.brand`, { ns: "landing" }),
        navKeys: style.navKeys,
        nav: style.navKeys.map((k) => t(`nav.${k}`, { ns: "common" })),
        headerCta: style.headerCta,
        headerCtaClass: style.headerCtaClass,
        logoClass: style.logoClass,
        navClass: style.navClass,
        bg: style.bg,
        text: style.text,
        subtext: style.subtext,
        border: style.border,
        accentText: style.accentText,
        accentBg: style.accentBg,
        heroBadge: t(`${prefix}.heroBadge`, { ns: "landing" }),
        badgeClass: style.badgeClass,
        heroTitle1: style.heroTitle1,
        heroTitle2: style.heroTitle2,
        heroStacked: style.heroStacked,
        heroDesc: t(`${prefix}.heroDesc`, { ns: "landing" }),
        btnPrimary: style.btnPrimary,
        btnSecondary: style.btnSecondary,
        secondaryLabel: t(`${prefix}.secondaryLabel`, { ns: "landing" }),
        featuresTitle: t(`${prefix}.featuresTitle`, { ns: "landing" }),
        featuresDesc: t(`${prefix}.featuresDesc`, { ns: "landing" }),
        featuresVersion: style.hasFeaturesVersion
          ? t(`${prefix}.featuresVersion`, { ns: "landing" })
          : undefined,
        features: style.features.map((f) => {
          const fPrefix = `${prefix}.features.${f.key}`;
          const tags = f.hasTags
            ? (t(`${fPrefix}.tags`, {
                ns: "landing",
                returnObjects: true,
              }) as string[])
            : undefined;
          return {
            title: t(`${fPrefix}.title`, { ns: "landing" }),
            desc: t(`${fPrefix}.desc`, { ns: "landing" }),
            icon: f.icon,
            tags: Array.isArray(tags) ? tags : undefined,
            variant: f.variant,
          };
        }),
        compTitle: t(`${prefix}.compTitle`, { ns: "landing" }),
        compProject: style.compProject,
        compSectionBg: style.compSectionBg,
        compSourceLabel: style.compSourceLabel,
        compPreviewLabel: style.compPreviewLabel,
        compSourceBg: style.compSourceBg,
        compPreviewBg: style.compPreviewBg,
        ctaTitle: t(`${prefix}.ctaTitle`, { ns: "landing" }),
        ctaDesc: t(`${prefix}.ctaDesc`, { ns: "landing" }),
        stats: style.stats.map((s) => ({
          val: s.val,
          lab: t(`${prefix}.stats.${s.labKey}`, { ns: "landing" }),
          sym: s.sym,
        })),
        footerKeys: style.footerKeys,
        footerLinks: style.footerKeys.map((k) =>
          t(`footer.${k}`, { ns: "common" }),
        ),
        footerMeta: t(`${prefix}.footerMeta`, { ns: "landing" }),
      };
    }

    return themes;
  }, [t]);
}

export function useLandingTheme(key: ThemeKey): LandingTheme {
  const themes = useLandingThemes();
  return themes[key];
}
