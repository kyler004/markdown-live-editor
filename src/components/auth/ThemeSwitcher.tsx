import type { ThemeKey } from "../../pages/landing-themes";
import { useTranslation } from "react-i18next";

interface ThemeSwitcherProps {
  theme: ThemeKey;
  onChange: (key: ThemeKey) => void;
  className?: string;
}

const THEME_KEYS: ThemeKey[] = [
  "light-blue",
  "cyber-green",
  "obsidian-silver",
];

export default function ThemeSwitcher({
  theme,
  onChange,
  className = "",
}: ThemeSwitcherProps) {
  const { t } = useTranslation("common");

  return (
    <div
      className={`flex gap-1.5 p-1.5 rounded-full border border-zinc-800 bg-zinc-950/90 backdrop-blur-sm ${className}`}
      role="group"
      aria-label="Theme"
    >
      {THEME_KEYS.map((key) => (
        <button
          key={key}
          type="button"
          title={t(`themeNames.${key}`)}
          onClick={() => onChange(key)}
          className={`w-7 h-7 rounded-full border-2 transition-transform ${
            theme === key
              ? "border-white scale-110"
              : "border-transparent opacity-60 hover:opacity-100"
          }`}
          style={{
            background:
              key === "light-blue"
                ? "#0055ff"
                : key === "cyber-green"
                  ? "#00ff66"
                  : "#ffffff",
          }}
        />
      ))}
    </div>
  );
}
