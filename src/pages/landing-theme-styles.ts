import type { LucideIcon } from "lucide-react";
import {
  Cloud,
  GitBranch,
  Monitor,
  Puzzle,
  Shield,
  Sparkles,
  Type,
  Zap,
} from "lucide-react";
import type { ThemeKey } from "./landing-themes";

export type NavKey =
  | "home"
  | "docs"
  | "pricing"
  | "community"
  | "features"
  | "github";

export type FooterKey =
  | "twitter"
  | "github"
  | "status"
  | "changelog"
  | "discord"
  | "linkedin";

export interface LandingFeatureDef {
  key: string;
  icon: LucideIcon;
  variant: "large" | "small" | "typography" | "wide";
  hasTags?: boolean;
}

export interface LandingStatDef {
  val: string;
  labKey: string;
  sym: [string, string];
}

export interface LandingThemeStyle {
  navKeys: NavKey[];
  footerKeys: FooterKey[];
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
  badgeClass: string;
  heroTitle1: string;
  heroTitle2: string;
  heroStacked: boolean;
  btnPrimary: string;
  btnSecondary: string;
  features: LandingFeatureDef[];
  compProject: string;
  compSectionBg: string;
  compSourceLabel: string;
  compPreviewLabel: string;
  compSourceBg: string;
  compPreviewBg: string;
  stats: LandingStatDef[];
  hasFeaturesVersion?: boolean;
}

export const landingThemeStyles: Record<ThemeKey, LandingThemeStyle> = {
  "light-blue": {
    navKeys: ["home", "docs", "pricing", "community"],
    footerKeys: ["twitter", "github", "status", "changelog"],
    headerCta: "login",
    headerCtaClass:
      "bg-[#0055ff] text-white px-5 py-2 text-[10px] font-bold tracking-widest hover:bg-blue-600 transition-colors",
    logoClass: "text-slate-900 font-black",
    navClass: "text-slate-400",
    bg: "bg-white",
    text: "text-slate-900",
    subtext: "text-slate-500",
    border: "border-slate-200",
    accentText: "text-[#0055ff]",
    accentBg: "bg-[#0055ff]",
    badgeClass:
      "text-slate-400 border-slate-200 bg-slate-50 tracking-[0.25em]",
    heroTitle1: "text-slate-900",
    heroTitle2: "text-[#0055ff]",
    heroStacked: false,
    btnPrimary:
      "bg-[#0055ff] text-white hover:bg-blue-600 px-12 py-4 font-bold tracking-widest uppercase text-xs md:text-sm",
    btnSecondary:
      "border border-slate-300 text-slate-600 hover:bg-slate-50 px-12 py-4 tracking-widest uppercase text-xs md:text-sm",
    features: [
      {
        key: "precisionRendering",
        icon: Monitor,
        variant: "large",
        hasTags: true,
      },
      { key: "advancedTypography", icon: Type, variant: "typography" },
      { key: "cloudNative", icon: Cloud, variant: "small" },
      { key: "realTimeSync", icon: GitBranch, variant: "wide" },
    ],
    compProject: "Project_Status_Report",
    compSectionBg: "bg-slate-50/80 border-slate-200",
    compSourceLabel: "MARKDOWN SOURCE",
    compPreviewLabel: "LIVE PREVIEW",
    compSourceBg: "bg-white text-slate-600 border-slate-200",
    compPreviewBg: "bg-white text-slate-800 border-slate-200",
    stats: [
      { val: "0.12ms", labKey: "visualLatency", sym: ["{", "}"] },
      { val: "AES-256", labKey: "cipherSecurity", sym: ["/", "/"] },
      { val: "∞", labKey: "canvasStorage", sym: ["[", "]"] },
      { val: "100%", labKey: "nativeCore", sym: ["#", "#"] },
    ],
    hasFeaturesVersion: true,
  },
  "cyber-green": {
    navKeys: ["home", "docs", "pricing", "community"],
    footerKeys: ["twitter", "github", "status", "changelog"],
    headerCta: "login",
    headerCtaClass:
      "bg-[#00ff66] text-black px-5 py-2 text-[10px] font-bold tracking-widest hover:bg-[#00dd55] transition-colors",
    logoClass: "text-[#00ff66] font-black",
    navClass: "text-zinc-500",
    bg: "bg-[#0d020b]",
    text: "text-zinc-100",
    subtext: "text-zinc-500",
    border: "border-zinc-900/80",
    accentText: "text-[#00ff66]",
    accentBg: "bg-[#00ff66]",
    badgeClass:
      "text-[#00ff66] border-[#00ff66]/25 bg-[#150412] tracking-[0.2em]",
    heroTitle1: "text-white",
    heroTitle2: "text-[#00ff66]",
    heroStacked: true,
    btnPrimary:
      "bg-[#00ff66] text-black hover:bg-[#00dd55] px-12 py-4 font-bold tracking-widest uppercase text-xs md:text-sm",
    btnSecondary:
      "border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500 px-12 py-4 tracking-widest uppercase text-xs md:text-sm",
    features: [
      { key: "mdRenderer", icon: Zap, variant: "large", hasTags: true },
      { key: "editorialTypography", icon: Type, variant: "typography" },
      { key: "cloudSync", icon: Cloud, variant: "small" },
      { key: "collaborativeEditing", icon: GitBranch, variant: "wide" },
    ],
    compProject: "Project_Alpha",
    compSectionBg: "bg-black/50 border-zinc-900",
    compSourceLabel: "MARKDOWN SOURCE",
    compPreviewLabel: "LIVE PREVIEW",
    compSourceBg: "bg-black text-zinc-400 border-zinc-900",
    compPreviewBg: "bg-[#0a0209] text-zinc-100 border-zinc-900",
    stats: [
      { val: "0.12ms", labKey: "visualLatency", sym: ["{", "}"] },
      { val: "256-bit", labKey: "streamEncryption", sym: ["/", "/"] },
      { val: "∞", labKey: "customExtensions", sym: ["[", "]"] },
      { val: "99.9%", labKey: "kernelUptime", sym: ["#", "#"] },
    ],
    hasFeaturesVersion: true,
  },
  "obsidian-silver": {
    navKeys: ["features", "pricing", "docs", "github"],
    footerKeys: ["github", "twitter", "discord", "linkedin"],
    headerCta: "get-started",
    headerCtaClass:
      "bg-white text-black px-5 py-2 text-[10px] font-bold tracking-widest hover:bg-zinc-200 transition-colors",
    logoClass: "text-white font-black",
    navClass: "text-zinc-500",
    bg: "bg-black",
    text: "text-zinc-100",
    subtext: "text-zinc-500",
    border: "border-zinc-900",
    accentText: "text-white",
    accentBg: "bg-white",
    badgeClass:
      "text-zinc-400 border-zinc-800 bg-zinc-950 tracking-[0.15em]",
    heroTitle1: "text-white",
    heroTitle2: "text-zinc-300",
    heroStacked: false,
    btnPrimary:
      "bg-white text-black hover:bg-zinc-200 px-12 py-4 font-bold tracking-widest uppercase text-xs md:text-sm",
    btnSecondary:
      "border border-zinc-700 text-zinc-400 hover:text-white px-12 py-4 tracking-widest uppercase text-xs md:text-sm",
    features: [
      { key: "lowLatency", icon: Monitor, variant: "large", hasTags: true },
      { key: "neuralGraph", icon: Sparkles, variant: "small" },
      { key: "encryption", icon: Shield, variant: "small" },
      { key: "pluginEcosystem", icon: Puzzle, variant: "wide" },
    ],
    compProject: "Project_Genesis",
    compSectionBg: "bg-zinc-950/50 border-zinc-900",
    compSourceLabel: "SOURCE_CODE",
    compPreviewLabel: "LIVE_PREVIEW",
    compSourceBg: "bg-black text-zinc-500 border-zinc-900",
    compPreviewBg: "bg-[#070707] text-zinc-100 border-zinc-900",
    stats: [
      { val: "0.05ms", labKey: "inputLatency", sym: ["{", "}"] },
      { val: "AES-256", labKey: "vaultEncryption", sym: ["/", "/"] },
      { val: "1,200+", labKey: "corePlugins", sym: ["#", "#"] },
      { val: "∞", labKey: "connectionNodes", sym: ["[", "]"] },
    ],
  },
};
