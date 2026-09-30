import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { Panel, Group, Separator } from "react-resizable-panels";
import type {
  PanelImperativeHandle,
  GroupImperativeHandle,
} from "react-resizable-panels";
import { useNavigate } from "react-router-dom";
import Topbar from "../components/Topbar";
import Sidebar from "../components/Sidebar";
import type { FileExplorerActions } from "../components/FileExplorer";
import Editor from "../components/Editor";
import Preview from "../components/Preview";
import Terminal from "../components/Terminal";
import { useTheme, type Theme } from "../context/ThemeContext";
import { useDocuments } from "../context/DocumentsContext";
import { useAuth } from "../context/AuthContext";
import { countStats } from "../utils/markdown";
import type { ViewMode } from "../types/view";

export type { ViewMode };

function EditorAppInner() {
  const {
    user,
    signOut,
    hasPassword,
    oauthProviders,
    updateProfile,
    changePassword,
  } = useAuth();
  const navigate = useNavigate();
  const {
    activeDoc,
    updateActiveContent,
    createDocument,
    lastSavedAt,
    fsConnected,
    workspaceRoot,
    error: fsError,
    isLoading,
  } = useDocuments();
  const markdown = activeDoc?.content ?? "";
  const setMarkdown = updateActiveContent;

  const [cursorPos, setCursorPos] = useState({ line: 1, column: 1 });
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("split");
  const [searchQuery, setSearchQuery] = useState("");

  const { setTheme } = useTheme();

  // Refs for sync-scroll
  const editorRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLElement>(null);
  const scrollingRef = useRef<"editor" | "preview" | null>(null);
  const scrollTimeoutRef = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fileActionsRef = useRef<FileExplorerActions | null>(null);

  // Panel imperative refs
  const sidebarPanelRef = useRef<PanelImperativeHandle>(null);
  const verticalGroupRef = useRef<GroupImperativeHandle>(null);
  const lastTerminalPct = useRef(35);

  const stats = useMemo(() => countStats(markdown), [markdown]);

  const updateCursorPos = useCallback((line: number, column: number) => {
    setCursorPos({ line, column });
  }, []);

  // ── Sync-scroll ────────────────────────────────────────────
  const handleEditorScroll = useCallback(() => {
    if (scrollingRef.current === "preview") return;
    const editor = editorRef.current;
    const preview = previewRef.current;
    if (editor && preview) {
      scrollingRef.current = "editor";
      const editorScrollable = editor.scrollHeight - editor.clientHeight;
      if (editorScrollable > 0) {
        const pct = editor.scrollTop / editorScrollable;
        preview.scrollTop =
          pct * (preview.scrollHeight - preview.clientHeight);
      }
      if (scrollTimeoutRef.current)
        window.clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = window.setTimeout(() => {
        scrollingRef.current = null;
      }, 50);
    }
  }, []);

  const handlePreviewScroll = useCallback(() => {
    if (scrollingRef.current === "editor") return;
    const editor = editorRef.current;
    const preview = previewRef.current;
    if (editor && preview) {
      scrollingRef.current = "preview";
      const previewScrollable = preview.scrollHeight - preview.clientHeight;
      if (previewScrollable > 0) {
        const pct = preview.scrollTop / previewScrollable;
        editor.scrollTop = pct * (editor.scrollHeight - editor.clientHeight);
      }
      if (scrollTimeoutRef.current)
        window.clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = window.setTimeout(() => {
        scrollingRef.current = null;
      }, 50);
    }
  }, []);

  // ── Outline navigation ──────────────────────────────────────
  const scrollToHeading = useCallback(
    (id: string) => {
      if (viewMode === "editor") setViewMode("split");
      window.requestAnimationFrame(() => {
        const container = previewRef.current;
        if (!container) return;
        const target = container.querySelector<HTMLElement>(
          `#${CSS.escape(id)}`,
        );
        target?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    },
    [viewMode],
  );

  // ── Search ──────────────────────────────────────────────────
  const focusSearch = useCallback(() => {
    const input = document.getElementById(
      "global-search",
    ) as HTMLInputElement | null;
    input?.focus();
    input?.select();
  }, []);

  const runSearch = useCallback(
    (backwards: boolean) => {
      const query = searchQuery;
      if (!query) return;
      const ta = document.getElementById(
        "code-editor",
      ) as HTMLTextAreaElement | null;
      if (!ta) return;
      if (viewMode === "preview") setViewMode("split");

      const hay = ta.value.toLowerCase();
      const needle = query.toLowerCase();
      let from: number;
      if (backwards) {
        from = hay.lastIndexOf(needle, Math.max(0, ta.selectionStart - 1));
        if (from === -1) from = hay.lastIndexOf(needle);
      } else {
        from = hay.indexOf(needle, ta.selectionEnd);
        if (from === -1) from = hay.indexOf(needle);
      }
      if (from === -1) return;

      ta.focus();
      ta.setSelectionRange(from, from + query.length);

      const container = editorRef.current;
      if (container) {
        const lineCount = ta.value.split("\n").length || 1;
        const lineHeight = ta.scrollHeight / lineCount;
        const lineNumber = ta.value.slice(0, from).split("\n").length;
        container.scrollTop = Math.max(
          0,
          (lineNumber - 1) * lineHeight - container.clientHeight / 2,
        );
      }
    },
    [searchQuery, viewMode],
  );

  // ── Import / Export ─────────────────────────────────────────
  const exportMarkdown = useCallback(() => {
    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = activeDoc?.name ?? "document.md";
    a.click();
    URL.revokeObjectURL(url);
  }, [markdown, activeDoc]);

  const exportHtml = useCallback(() => {
    const container = document.querySelector(".preview-content");
    const body = container?.innerHTML ?? markdown;
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${activeDoc?.name ?? "document"}</title>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css" />
<style>body{max-width:800px;margin:2rem auto;padding:0 1rem;font-family:system-ui,sans-serif;line-height:1.6;}pre{background:#f4f4f4;padding:1rem;overflow:auto;border-radius:6px;}code{font-family:monospace;}table{border-collapse:collapse;}th,td{border:1px solid #ddd;padding:.5rem;}</style>
</head>
<body>${body}</body>
</html>`;
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(activeDoc?.name ?? "document").replace(/\.md$/, "")}.html`;
    a.click();
    URL.revokeObjectURL(url);
  }, [markdown, activeDoc]);

  const triggerImport = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleImportFile = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        void createDocument(file.name, String(reader.result ?? ""));
      };
      reader.readAsText(file);
      e.target.value = "";
    },
    [createDocument],
  );

  // ── Sidebar ─────────────────────────────────────────────────
  const toggleSidebar = useCallback(() => {
    const panel = sidebarPanelRef.current;
    if (!panel) return;
    if (panel.isCollapsed()) panel.expand();
    else panel.collapse();
  }, []);

  // ── Terminal (uses Group-level setLayout for reliability) ────
  const toggleTerminal = useCallback(() => {
    const group = verticalGroupRef.current;
    if (!group) return;
    const layout = group.getLayout();
    const currentTerminalPct = layout["terminal"] ?? 0;

    if (currentTerminalPct <= 1) {
      const target = lastTerminalPct.current;
      group.setLayout({ workspace: 100 - target, terminal: target });
      setTerminalOpen(true);
    } else {
      lastTerminalPct.current = currentTerminalPct;
      group.setLayout({ workspace: 100, terminal: 0 });
      setTerminalOpen(false);
    }
  }, []);

  const closeTerminal = useCallback(() => {
    const group = verticalGroupRef.current;
    if (!group) return;
    const layout = group.getLayout();
    const currentTerminalPct = layout["terminal"] ?? 0;
    if (currentTerminalPct > 1) lastTerminalPct.current = currentTerminalPct;
    group.setLayout({ workspace: 100, terminal: 0 });
    setTerminalOpen(false);
  }, []);

  // ── Keyboard shortcuts ──────────────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "`") {
        e.preventDefault();
        toggleTerminal();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "f") {
        e.preventDefault();
        focusSearch();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [toggleTerminal, focusSearch]);

  const showEditor = viewMode !== "preview";
  const showPreview = viewMode !== "editor";

  return (
    <div className="flex flex-col h-screen">
      <input
        ref={fileInputRef}
        type="file"
        accept=".md,.markdown,.txt,text/markdown,text/plain"
        className="hidden"
        onChange={handleImportFile}
      />

      <Topbar
        terminalOpen={terminalOpen}
        onToggleTerminal={toggleTerminal}
        viewMode={viewMode}
        onSetViewMode={setViewMode}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearchSubmit={runSearch}
        onNewDocument={() => fileActionsRef.current?.openNewFile()}
        onNewFolder={() => fileActionsRef.current?.openNewFolder()}
        onDuplicateDocument={() => fileActionsRef.current?.duplicateActive()}
        onImport={triggerImport}
        onExportMarkdown={exportMarkdown}
        onExportHtml={exportHtml}
        onPrint={() => window.print()}
        user={user}
        hasPassword={hasPassword}
        oauthProviders={oauthProviders}
        onUpdateName={updateProfile}
        onChangePassword={changePassword}
        onSignOut={async () => {
          await signOut();
          navigate("/login");
        }}
      />

      {/* Vertical split: main workspace on top, terminal on bottom */}
      <Group
        orientation="vertical"
        className="flex-1 overflow-hidden"
        groupRef={verticalGroupRef}
      >
        {/* Top: main workspace */}
        <Panel id="workspace" defaultSize="100%" minSize="15%">
          <main className="flex w-full h-full overflow-hidden">
            <Group orientation="horizontal" className="w-full h-full">
              <Panel
                panelRef={sidebarPanelRef}
                collapsible
                collapsedSize="48px"
                defaultSize="240px"
                minSize="160px"
                maxSize="35%"
              >
                <Sidebar
                  onFolderClick={toggleSidebar}
                  onOutlineClick={scrollToHeading}
                  onFocusSearch={focusSearch}
                  onImport={triggerImport}
                  fileActionsRef={fileActionsRef}
                />
              </Panel>

              <Separator className="w-1 bg-[#1a1a1a] hover:bg-(--color-neon) active:bg-(--color-neon) transition-colors cursor-col-resize shrink-0" />

              {showEditor && (
                <Panel id="editor" defaultSize="41%" minSize="15%">
                  <Editor
                    ref={editorRef}
                    markdown={markdown}
                    setMarkdown={setMarkdown}
                    onCursorChange={updateCursorPos}
                    onScroll={handleEditorScroll}
                    fileName={activeDoc?.id ?? "index.md"}
                  />
                </Panel>
              )}

              {showEditor && showPreview && (
                <Separator className="w-1 bg-[#1a1a1a] hover:bg-(--color-neon) active:bg-(--color-neon) transition-colors cursor-col-resize shrink-0" />
              )}

              {showPreview && (
                <Panel id="preview" defaultSize="41%" minSize="15%">
                  <Preview
                    ref={previewRef}
                    markdown={markdown}
                    onScroll={handlePreviewScroll}
                  />
                </Panel>
              )}
            </Group>
          </main>
        </Panel>

        {/* Horizontal resize handle */}
        <Separator
          className={`h-1.5 transition-colors cursor-row-resize shrink-0 ${
            terminalOpen
              ? "bg-[#1a1a1a] hover:bg-(--color-neon) active:bg-(--color-neon)"
              : "opacity-0 pointer-events-none"
          }`}
        />

        {/* Bottom: terminal panel */}
        <Panel
          id="terminal"
          defaultSize="0%"
          minSize="0%"
          maxSize="85%"
          onResize={(panelSize) => {
            const pct = panelSize.asPercentage;
            if (pct <= 1) {
              setTerminalOpen(false);
            } else {
              setTerminalOpen(true);
            }
          }}
        >
          <Terminal
            markdown={markdown}
            onClose={closeTerminal}
            onThemeChange={(t: Theme) => setTheme(t)}
          />
        </Panel>
      </Group>

      <footer
        className="h-6 flex justify-between items-center px-4 font-mono text-[0.7rem] font-semibold shrink-0"
        style={{
          backgroundColor: "var(--color-neon)",
          color: "var(--color-on-accent)",
        }}
      >
        <div className="flex items-center gap-4 min-w-0">
          <span className="font-bold shrink-0">MAIN*</span>
          <span className="shrink-0">UTF-8</span>
          <span className="shrink-0">
            {fsConnected ? "DISK" : "OFFLINE"}
            {lastSavedAt
              ? ` · SAVED ${new Date(lastSavedAt).toLocaleTimeString()}`
              : isLoading
                ? " · …"
                : ""}
          </span>
          {workspaceRoot && (
            <span
              className="truncate opacity-80 max-w-[280px]"
              title={workspaceRoot}
            >
              {workspaceRoot}
            </span>
          )}
          {fsError && (
            <span className="truncate text-red-900 max-w-[200px]" title={fsError}>
              {fsError}
            </span>
          )}
        </div>
        <div className="flex items-center gap-4">
          <span>
            {stats.words} words · {stats.chars} chars · {stats.readingMinutes}{" "}
            min read
          </span>
          <span>{`<> MARKDOWN`}</span>
          <span>
            LN {cursorPos.line}, COL {cursorPos.column}
          </span>
        </div>
      </footer>
    </div>
  );
}

export default function EditorApp() {
  useEffect(() => {
    document.body.classList.add("app-locked");
    return () => document.body.classList.remove("app-locked");
  }, []);

  return <EditorAppInner />;
}
