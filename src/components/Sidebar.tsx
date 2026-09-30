import { useMemo, useState, useRef, useEffect } from "react";
import type { MutableRefObject } from "react";
import {
  Terminal,
  Folder,
  Search,
  Layers3,
  Settings,
  Clock4,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import SettingsMenu from "./SettingsMenu";
import FileExplorer, { type FileExplorerActions } from "./FileExplorer";
import { useDocuments } from "../context/DocumentsContext";
import type { DocumentSnapshot } from "../context/DocumentsContext";
import { extractOutline } from "../utils/markdown";

interface SidebarProps {
  onFolderClick?: () => void;
  onOutlineClick?: (id: string) => void;
  onFocusSearch?: () => void;
  onImport?: () => void;
  fileActionsRef?: MutableRefObject<FileExplorerActions | null>;
}

export default function Sidebar({
  onFolderClick,
  onOutlineClick,
  onFocusSearch,
  onImport,
  fileActionsRef,
}: SidebarProps) {
  const { t } = useTranslation("editor");
  const [menuOpen, setMenuOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const settingsBtnRef = useRef<HTMLButtonElement>(null);

  const {
    activeId,
    activeDoc,
    getHistory,
    refreshHistory,
    restoreSnapshot,
    lastSavedAt,
  } = useDocuments();

  const [historySnaps, setHistorySnaps] = useState<DocumentSnapshot[]>([]);

  const outline = useMemo(
    () => extractOutline(activeDoc?.content ?? ""),
    [activeDoc?.content],
  );

  useEffect(() => {
    if (historyOpen && activeId) {
      void refreshHistory(activeId).then(setHistorySnaps);
    }
  }, [historyOpen, activeId, refreshHistory, lastSavedAt]);

  const history = historyOpen ? historySnaps : getHistory(activeId);

  return (
    <div className="flex h-full bg-sidebar min-w-0 overflow-hidden">
      <nav className="w-12 bg-activity flex flex-col items-center pt-4 gap-6 shrink-0 border-r border-surface-dim">
        <div className="flex flex-col items-center gap-1 w-full cursor-pointer text-neon relative z-10 before:absolute before:-inset-y-1 before:inset-x-1 before:bg-neon-bg before:rounded-sm before:-z-10">
          <Terminal size={22} />
          <div className="font-mono text-[0.55rem] text-neon drop-shadow-[0_0_5px_rgba(0,255,65,0.6)] text-center leading-tight">
            {t("sidebar.terminal")}
          </div>
        </div>
        <button
          type="button"
          className="flex flex-col items-center gap-1 w-full cursor-pointer text-inactive hover:text-dimmed transition-colors"
          onClick={onFolderClick}
          aria-label={t("sidebar.toggleExplorer")}
          title={t("sidebar.toggleExplorer")}
        >
          <Folder size={22} />
        </button>
        <button
          type="button"
          className="flex flex-col items-center gap-1 w-full cursor-pointer text-inactive hover:text-dimmed transition-colors"
          onClick={onFocusSearch}
          aria-label={t("sidebar.focusSearch")}
          title={t("sidebar.searchHint")}
        >
          <Search size={22} />
        </button>
        <button
          type="button"
          className="flex flex-col items-center gap-1 w-full cursor-pointer text-inactive hover:text-dimmed transition-colors"
          onClick={onImport}
          aria-label={t("files.import")}
          title={t("files.import")}
        >
          <Layers3 size={22} />
        </button>

        <div className="relative flex flex-col items-center gap-1 w-full cursor-pointer mt-auto">
          <button
            ref={settingsBtnRef}
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            className={`flex flex-col items-center w-full py-1 transition-colors ${
              menuOpen
                ? "text-(--color-neon)"
                : "text-inactive hover:text-dimmed"
            }`}
            aria-label={t("settings.title")}
          >
            <Settings
              size={22}
              style={
                menuOpen
                  ? { filter: "drop-shadow(0 0 6px var(--color-neon))" }
                  : undefined
              }
            />
          </button>

          {menuOpen && (
            <SettingsMenu
              onClose={() => setMenuOpen(false)}
              buttonRef={settingsBtnRef}
            />
          )}
        </div>

        <button
          type="button"
          onClick={() => setHistoryOpen((o) => !o)}
          className={`flex flex-col items-center w-full cursor-pointer transition-colors mb-4 ${
            historyOpen ? "text-neon" : "text-inactive hover:text-dimmed"
          }`}
          aria-label={t("sidebar.history")}
          title={t("sidebar.history")}
        >
          <Clock4 size={22} />
        </button>
      </nav>

      <aside className="flex-1 flex flex-col py-4 font-mono overflow-y-auto overflow-x-hidden min-w-0">
        <FileExplorer onImport={onImport} actionsRef={fileActionsRef} />

        <div className="px-4 mb-8">
          <div className="flex justify-between items-center mb-4">
            <div className="text-dimmed text-xs tracking-widest truncate">
              {t("sidebar.outline")}
            </div>
          </div>
          {outline.length === 0 ? (
            <p className="text-xs text-inactive italic">{t("sidebar.noHeadings")}</p>
          ) : (
            <ul className="text-xs text-dimmed space-y-2">
              {outline.map((h) => (
                <li key={h.id}>
                  <button
                    type="button"
                    onClick={() => onOutlineClick?.(h.id)}
                    className="w-full text-left cursor-pointer hover:text-main transition-colors truncate"
                    style={{ paddingLeft: `${(h.level - 1) * 10}px` }}
                    title={h.text}
                  >
                    {"#".repeat(h.level)} {h.text}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {historyOpen && (
          <div className="px-4">
            <div className="flex justify-between items-center mb-4">
              <div className="text-dimmed text-xs tracking-widest truncate">
                {t("sidebar.history")}
              </div>
            </div>
            {history.length === 0 ? (
              <p className="text-xs text-inactive italic">{t("sidebar.noSnapshots")}</p>
            ) : (
              <ul className="text-xs text-dimmed space-y-2">
                {[...history].reverse().map((snap) => (
                  <li key={snap.ts}>
                    <button
                      type="button"
                      onClick={() => void restoreSnapshot(activeId, snap.ts)}
                      className="w-full text-left hover:text-neon transition-colors truncate"
                    >
                      {new Date(snap.ts).toLocaleString()}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </aside>
    </div>
  );
}
