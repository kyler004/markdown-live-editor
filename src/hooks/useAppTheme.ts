import { useTheme } from "../context/ThemeContext";
import type { ThemeKey } from "../pages/landing-themes";

/** Shared theme hook for marketing + auth pages (backed by global ThemeProvider) */
export function useAppTheme() {
  const { theme, setTheme } = useTheme();
  return { theme, setTheme: setTheme as (key: ThemeKey) => void };
}
