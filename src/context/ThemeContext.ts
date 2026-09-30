import { createContext, useContext } from "react";
import type { ThemeKey } from "../pages/landing-themes";

export type Theme = ThemeKey;

interface ThemeContextValue {
  theme: ThemeKey;
  setTheme: (theme: ThemeKey) => void;
}

export const ThemeContext = createContext<ThemeContextValue>({
  theme: "cyber-green",
  setTheme: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

export type { ThemeKey };
