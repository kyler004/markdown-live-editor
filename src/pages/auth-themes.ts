import type { ThemeKey } from "./landing-themes";

export interface AuthTheme {
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
  panelBadge: string;
  panelTitle: string;
  panelDesc: string;
  panelAccent: string;
  terminalBg: string;
  terminalBorder: string;
  terminalPrompt: string;
  terminalLines: Array<{ prefix?: string; text: string; accent?: boolean }>;
  perks: string[];
  loginTitle: string;
  loginSubtitle: string;
  signupTitle: string;
  signupSubtitle: string;
}

export type { ThemeKey };
