import type { ThemeKey } from "./landing-themes";

export interface AuthThemeStyle {
  brand: string;
  bg: string;
  text: string;
  subtext: string;
  border: string;
  accentText: string;
  cardBg: string;
  panelBg: string;
  inputBg: string;
  inputBorder: string;
  inputFocus: string;
  logoClass: string;
  badgeClass: string;
  btnPrimary: string;
  btnOAuth: string;
  divider: string;
  linkClass: string;
  errorClass: string;
  statusBarClass: string;
  panelAccent: string;
  terminalBg: string;
  terminalBorder: string;
  terminalPrompt: string;
}

export const authThemeStyles: Record<ThemeKey, AuthThemeStyle> = {
  "light-blue": {
    brand: "ARCHITECT_OS",
    bg: "bg-white",
    text: "text-slate-900",
    subtext: "text-slate-500",
    border: "border-slate-200",
    accentText: "text-[#0055ff]",
    cardBg: "bg-white",
    panelBg: "bg-slate-50/80",
    inputBg: "bg-white",
    inputBorder: "border-slate-300",
    inputFocus: "focus:ring-[#0055ff]/40 focus:border-[#0055ff]",
    logoClass: "text-slate-900 font-black",
    badgeClass:
      "text-slate-400 border-slate-200 bg-white tracking-[0.2em]",
    btnPrimary:
      "bg-[#0055ff] text-white hover:bg-blue-600 disabled:opacity-50",
    btnOAuth:
      "border-slate-300 text-slate-700 hover:border-[#0055ff] hover:text-[#0055ff]",
    divider: "bg-slate-200",
    linkClass: "text-[#0055ff] hover:underline",
    errorClass: "text-red-600 border-red-200 bg-red-50",
    statusBarClass: "border-slate-200 bg-slate-50/90 text-slate-400",
    panelAccent: "text-[#0055ff]",
    terminalBg: "bg-white",
    terminalBorder: "border-slate-200",
    terminalPrompt: "text-slate-400",
  },
  "cyber-green": {
    brand: "ARCHITECT_OS",
    bg: "bg-[#0d020b]",
    text: "text-zinc-100",
    subtext: "text-zinc-500",
    border: "border-[#2a1525]",
    accentText: "text-[#00ff66]",
    cardBg: "bg-[#130410]",
    panelBg: "bg-[#0a0208]/90",
    inputBg: "bg-black",
    inputBorder: "border-[#2a1525]",
    inputFocus: "focus:ring-[#00ff66]/30 focus:border-[#00ff66]/50",
    logoClass:
      "text-[#00ff66] font-black drop-shadow-[0_0_8px_rgba(0,255,102,0.35)]",
    badgeClass:
      "text-[#00ff66] border-[#00ff66]/25 bg-[#150412] tracking-[0.2em]",
    btnPrimary:
      "bg-[#00ff66] text-black hover:bg-[#00dd55] disabled:opacity-50",
    btnOAuth:
      "border-[#2a1525] text-zinc-400 hover:border-[#00ff66]/50 hover:text-[#00ff66]",
    divider: "bg-[#2a1525]",
    linkClass: "text-[#00ff66] hover:underline",
    errorClass: "text-red-400 border-red-400/30 bg-red-400/10",
    statusBarClass: "border-[#2a1525] bg-[#0a0208]/90 text-[#00ff66]/60",
    panelAccent: "text-[#00ff66]",
    terminalBg: "bg-black",
    terminalBorder: "border-[#2a1525]",
    terminalPrompt: "text-[#2a3d2a]",
  },
  "obsidian-silver": {
    brand: "MDitor",
    bg: "bg-black",
    text: "text-zinc-100",
    subtext: "text-zinc-500",
    border: "border-zinc-800",
    accentText: "text-white",
    cardBg: "bg-[#070707]",
    panelBg: "bg-zinc-950/80",
    inputBg: "bg-black",
    inputBorder: "border-zinc-800",
    inputFocus: "focus:ring-white/20 focus:border-zinc-600",
    logoClass: "text-white font-black",
    badgeClass:
      "text-zinc-400 border-zinc-800 bg-zinc-950 tracking-[0.15em]",
    btnPrimary:
      "bg-white text-black hover:bg-zinc-200 disabled:opacity-50",
    btnOAuth:
      "border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-white",
    divider: "bg-zinc-800",
    linkClass: "text-white hover:underline",
    errorClass: "text-red-400 border-red-900/50 bg-red-950/30",
    statusBarClass: "border-zinc-900 bg-zinc-950/90 text-zinc-600",
    panelAccent: "text-white",
    terminalBg: "bg-black",
    terminalBorder: "border-zinc-800",
    terminalPrompt: "text-zinc-800",
  },
};
