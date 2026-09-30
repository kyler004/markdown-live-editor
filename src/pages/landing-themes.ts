import type { LucideIcon } from "lucide-react";
import type { FooterKey, NavKey } from "./landing-theme-styles";

export type ThemeKey = "light-blue" | "cyber-green" | "obsidian-silver";

export interface LandingTheme {
  name: string;
  brand: string;
  navKeys: NavKey[];
  nav: string[];
  headerCta: "login" | "get-started";
  headerCtaClass: string;
  logoClass: string;
  navClass: string;
  bg: string;
  text: string;
  subtext: string;
  border: string;
  accentText: string;
  accentBg: string;
  heroBadge: string;
  badgeClass: string;
  heroTitle1: string;
  heroTitle2: string;
  heroStacked: boolean;
  heroDesc: string;
  btnPrimary: string;
  btnSecondary: string;
  secondaryLabel: string;
  featuresTitle: string;
  featuresDesc: string;
  featuresVersion?: string;
  features: Array<{
    title: string;
    desc: string;
    icon: LucideIcon;
    tags?: string[];
    variant: "large" | "small" | "typography" | "wide";
  }>;
  compTitle: string;
  compProject: string;
  compSectionBg: string;
  compSourceLabel: string;
  compPreviewLabel: string;
  compSourceBg: string;
  compPreviewBg: string;
  ctaTitle: string;
  ctaDesc: string;
  stats: Array<{ val: string; lab: string; sym: [string, string] }>;
  footerKeys: FooterKey[];
  footerLinks: string[];
  footerMeta: string;
}
