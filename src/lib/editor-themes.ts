import type { ThemeKey } from "../pages/landing-themes";

export const editorThemeOptions: {
  id: ThemeKey;
  label: string;
  preview: [string, string, string];
  accent: string;
}[] = [
  {
    id: "light-blue",
    label: "Architect Light",
    preview: ["#ffffff", "#f1f5f9", "#0055ff"],
    accent: "#0055ff",
  },
  {
    id: "cyber-green",
    label: "Cyber Phosphor",
    preview: ["#000000", "#1a0b16", "#00ff66"],
    accent: "#00ff66",
  },
  {
    id: "obsidian-silver",
    label: "Obsidian Noir",
    preview: ["#000000", "#070707", "#ffffff"],
    accent: "#ffffff",
  },
];
