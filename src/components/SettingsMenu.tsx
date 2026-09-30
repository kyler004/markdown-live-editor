import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { User, Settings, Puzzle, ListTodo, Palette, Check } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { editorThemeOptions } from "../lib/editor-themes";

interface SettingsMenuProps {
  onClose: () => void;
  buttonRef: React.RefObject<HTMLButtonElement | null>;
}

const menuItemKeys = [
  { icon: User, key: "profile" as const },
  { icon: Settings, key: "settings" as const },
  { icon: Puzzle, key: "extensions" as const },
  { icon: ListTodo, key: "tasks" as const },
];

export default function SettingsMenu({ onClose, buttonRef }: SettingsMenuProps) {
  const { theme, setTheme } = useTheme();
  const { t } = useTranslation("editor");
  const menuRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState<{ left: number; bottom: number } | null>(null);

  useEffect(() => {
    if (buttonRef?.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setCoords({
        left: rect.right + 8,
        bottom: window.innerHeight - rect.bottom,
      });
    }
  }, [buttonRef]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    // Delay so the opening click doesn't immediately close it
    const id = setTimeout(() => {
      document.addEventListener("mousedown", handleClick);
    }, 50);
    return () => {
      clearTimeout(id);
      document.removeEventListener("mousedown", handleClick);
    };
  }, [onClose]);

  if (!coords) return null;

  return createPortal(
    <div
      ref={menuRef}
      className="fixed z-[9999] w-64 rounded-lg shadow-2xl overflow-hidden
                 border border-inactive
                 bg-sidebar
                 animate-in"
      style={{
        left: coords.left,
        bottom: coords.bottom,
        animation: "slideIn 0.18s cubic-bezier(0.16,1,0.3,1) both",
      }}
    >
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-8px) scale(0.97); }
          to   { opacity: 1; transform: translateX(0) scale(1); }
        }
      `}</style>

      {/* Header */}
      <div className="px-4 py-3 border-b border-inactive flex items-center gap-2">
        <Settings size={14} className="text-neon" />
        <span className="font-mono text-xs tracking-widest text-dimmed uppercase">
          {t("settings.title")}
        </span>
      </div>

      {/* Menu items */}
      <ul className="py-1">
        {menuItemKeys.map(({ icon: Icon, key }) => (
          <li
            key={key}
            className="flex items-center gap-3 px-4 py-2.5 cursor-pointer
                       text-sm text-main font-sans
                       hover:bg-neon-bg hover:text-neon
                       transition-colors duration-150"
          >
            <Icon size={15} className="shrink-0 text-dimmed" />
            {t(`settings.${key}`)}
          </li>
        ))}
      </ul>

      {/* Divider */}
      <div className="border-t border-inactive" />

      {/* Theme section */}
      <div className="px-4 py-3">
        <div className="flex items-center gap-2 mb-3">
          <Palette size={14} className="text-neon" />
          <span className="font-mono text-xs tracking-widest text-dimmed uppercase">
            {t("settings.theme")}
          </span>
        </div>

        <div className="flex flex-col gap-2">
          {editorThemeOptions.map((opt) => {
            const isActive = theme === opt.id;
            const label = t(`themes.${opt.id}`);
            return (
              <button
                key={opt.id}
                onClick={() => setTheme(opt.id)}
                className="flex items-center gap-3 w-full rounded-md px-3 py-2 cursor-pointer
                           transition-all duration-150 select-none text-left
                           hover:bg-neon-bg"
                style={{
                  border: `1px solid ${isActive ? opt.accent : "var(--color-inactive)"}`,
                  boxShadow: isActive ? `0 0 8px ${opt.accent}55` : "none",
                }}
              >
                <div className="flex rounded-sm overflow-hidden shrink-0 w-12 h-7 shadow-inner">
                  <div style={{ background: opt.preview[0], flex: 1 }} />
                  <div style={{ background: opt.preview[1], flex: 1.2 }} />
                  <div style={{ background: opt.preview[2], flex: 0.5 }} />
                </div>

                <span
                  className="flex-1 text-sm font-sans"
                  style={{
                    color: isActive ? opt.accent : "main",
                    fontWeight: isActive ? 600 : 400,
                  }}
                >
                  {label}
                </span>

                {isActive && (
                  <Check size={14} style={{ color: opt.accent, flexShrink: 0 }} />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>,
    document.body
  );
}
