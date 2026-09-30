import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  checkHealth,
  createFile,
  createFolder as apiCreateFolder,
  deleteFile,
  deleteFolder as apiDeleteFolder,
  fetchFile,
  fetchHistory,
  fetchWorkspace,
  renameFile,
  restoreHistory,
  saveFile,
  FilesApiError,
} from "../api/files";
import { suggestDuplicatePath } from "../utils/file-tree";
import {
  DocumentsContext,
  type DocumentSnapshot,
  type MarkdownDocument,
} from "./DocumentsContext";

const ACTIVE_FILE_KEY = "architect-active-file";
const SAVE_DEBOUNCE_MS = 400;

function basename(path: string): string {
  const parts = path.split("/");
  return parts[parts.length - 1] || path;
}

function resolveRenamePath(currentPath: string, newName: string): string {
  const trimmed = newName.trim().replace(/\\/g, "/");
  if (trimmed.includes("/")) return trimmed.replace(/^\/+/, "");
  const dir = currentPath.includes("/")
    ? currentPath.slice(0, currentPath.lastIndexOf("/") + 1)
    : "";
  return `${dir}${trimmed}`;
}

function entryToDoc(
  path: string,
  updatedAt: number,
  content = "",
): MarkdownDocument {
  return {
    id: path,
    name: basename(path),
    content,
    updatedAt,
  };
}

export function DocumentsProvider({ children }: { children: ReactNode }) {
  const [documents, setDocuments] = useState<MarkdownDocument[]>([]);
  const [folders, setFolders] = useState<string[]>([]);
  const [activeId, setActiveId] = useState("");
  const [lastSavedAt, setLastSavedAt] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fsConnected, setFsConnected] = useState(false);
  const [workspaceRoot, setWorkspaceRoot] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const contentCache = useRef<Map<string, string>>(new Map());
  const historyCache = useRef<Map<string, DocumentSnapshot[]>>(new Map());
  const saveTimeoutRef = useRef<number | null>(null);
  const pendingSaveRef = useRef<{ path: string; content: string } | null>(
    null,
  );

  const flushSave = useCallback(async () => {
    const pending = pendingSaveRef.current;
    if (!pending) return;
    pendingSaveRef.current = null;
    try {
      const { updatedAt } = await saveFile(pending.path, pending.content);
      setLastSavedAt(Date.now());
      setDocuments((prev) =>
        prev.map((d) =>
          d.id === pending.path ? { ...d, updatedAt, content: pending.content } : d,
        ),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    }
  }, []);

  const loadFileContent = useCallback(async (path: string) => {
    const cached = contentCache.current.get(path);
    if (cached != null) {
      setDocuments((prev) =>
        prev.map((d) => (d.id === path ? { ...d, content: cached } : d)),
      );
      return;
    }
    const file = await fetchFile(path);
    contentCache.current.set(path, file.content);
    setDocuments((prev) =>
      prev.map((d) =>
        d.id === path
          ? { ...d, content: file.content, updatedAt: file.updatedAt }
          : d,
      ),
    );
  }, []);

  const refreshDocuments = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      await checkHealth();
      const ws = await fetchWorkspace();
      setFsConnected(true);
      setWorkspaceRoot(ws.root);
      setFolders(ws.folders ?? []);

      const docs = ws.files.map((f) =>
        entryToDoc(
          f.path,
          f.updatedAt,
          contentCache.current.get(f.path) ?? "",
        ),
      );

      if (docs.length === 0) {
        const created = await createFile();
        docs.push(entryToDoc(created.path, created.updatedAt, ""));
      }

      setDocuments(docs);

      const stored = localStorage.getItem(ACTIVE_FILE_KEY);
      const nextActive =
        stored && docs.some((d) => d.id === stored) ? stored : docs[0].id;
      setActiveId(nextActive);
      localStorage.setItem(ACTIVE_FILE_KEY, nextActive);
      await loadFileContent(nextActive);
    } catch (err) {
      setFsConnected(false);
      setError(
        err instanceof FilesApiError && err.status === 401
          ? "Session expired — please sign in again"
          : err instanceof FilesApiError
            ? err.message
            : "Cannot reach local file server. Run: npm run dev",
      );
    } finally {
      setIsLoading(false);
    }
  }, [loadFileContent]);

  useEffect(() => {
    void refreshDocuments();
  }, [refreshDocuments]);

  const createDocument = useCallback(
    async (name?: string, content = "") => {
      let path = name?.trim();
      if (path && !/\.(md|markdown|txt)$/i.test(path)) path = `${path}.md`;

      const created = await createFile(path || undefined, content);
      contentCache.current.set(created.path, content);
      const doc = entryToDoc(created.path, created.updatedAt, content);
      setDocuments((prev) => [...prev, doc]);
      setActiveId(created.path);
      localStorage.setItem(ACTIVE_FILE_KEY, created.path);
      return created.path;
    },
    [],
  );

  const createFolder = useCallback(async (folderPath: string) => {
    const normalized = folderPath
      .trim()
      .replace(/\\/g, "/")
      .replace(/^\/+|\/+$/g, "");
    if (!normalized) throw new Error("Folder path is required");
    const created = await apiCreateFolder(normalized);
    setFolders((prev) =>
      [...new Set([...prev, created.path])].sort((a, b) =>
        a.localeCompare(b),
      ),
    );
    return created.path;
  }, []);

  const deleteDocument = useCallback(
    async (id: string) => {
      if (documents.length <= 1) return;
      await deleteFile(id);
      contentCache.current.delete(id);
      historyCache.current.delete(id);
      const remaining = documents.filter((d) => d.id !== id);
      setDocuments(remaining);
      if (activeId === id) {
        const next = remaining[0].id;
        setActiveId(next);
        localStorage.setItem(ACTIVE_FILE_KEY, next);
        await loadFileContent(next);
      }
    },
    [documents, activeId, loadFileContent],
  );

  const deleteFolder = useCallback(async (folderPath: string) => {
    const normalized = folderPath
      .trim()
      .replace(/\\/g, "/")
      .replace(/^\/+|\/+$/g, "");
    if (!normalized) return;
    await apiDeleteFolder(normalized);
    setFolders((prev) => prev.filter((f) => f !== normalized));
  }, []);

  const duplicateDocument = useCallback(
    async (id: string) => {
      const source = documents.find((d) => d.id === id);
      if (!source) throw new Error("Document not found");

      let content = contentCache.current.get(id);
      if (content == null) {
        const file = await fetchFile(id);
        content = file.content;
        contentCache.current.set(id, content);
      }

      const newPath = suggestDuplicatePath(
        id,
        documents.map((d) => d.id),
      );
      const created = await createFile(newPath, content);
      contentCache.current.set(created.path, content);
      const doc = entryToDoc(created.path, created.updatedAt, content);
      setDocuments((prev) => [...prev, doc]);
      setActiveId(created.path);
      localStorage.setItem(ACTIVE_FILE_KEY, created.path);
      return created.path;
    },
    [documents],
  );

  const renameDocument = useCallback(
    async (id: string, name: string) => {
      const newPath = resolveRenamePath(id, name);
      if (newPath === id) return;
      const result = await renameFile(id, newPath);
      const content = contentCache.current.get(id) ?? "";
      contentCache.current.delete(id);
      contentCache.current.set(result.path, content);
      historyCache.current.delete(id);

      setDocuments((prev) =>
        prev.map((d) =>
          d.id === id
            ? {
                ...d,
                id: result.path,
                name: basename(result.path),
                updatedAt: result.updatedAt,
              }
            : d,
        ),
      );
      if (activeId === id) {
        setActiveId(result.path);
        localStorage.setItem(ACTIVE_FILE_KEY, result.path);
      }
    },
    [activeId],
  );

  const selectDocument = useCallback(
    async (id: string) => {
      if (saveTimeoutRef.current) {
        window.clearTimeout(saveTimeoutRef.current);
        saveTimeoutRef.current = null;
      }
      await flushSave();
      setActiveId(id);
      localStorage.setItem(ACTIVE_FILE_KEY, id);
      await loadFileContent(id);
    },
    [flushSave, loadFileContent],
  );

  const updateActiveContent = useCallback(
    (content: string) => {
      if (!activeId) return;
      contentCache.current.set(activeId, content);
      setDocuments((prev) =>
        prev.map((d) =>
          d.id === activeId ? { ...d, content, updatedAt: Date.now() } : d,
        ),
      );

      pendingSaveRef.current = { path: activeId, content };
      if (saveTimeoutRef.current) window.clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = window.setTimeout(() => {
        void flushSave();
      }, SAVE_DEBOUNCE_MS);
    },
    [activeId, flushSave],
  );

  const getHistory = useCallback((id: string) => {
    return historyCache.current.get(id) ?? [];
  }, []);

  const loadHistory = useCallback(async (id: string) => {
    try {
      const snaps = await fetchHistory(id);
      historyCache.current.set(id, snaps);
      return snaps;
    } catch {
      return [];
    }
  }, []);

  const restoreSnapshot = useCallback(
    async (id: string, ts: number) => {
      const restored = await restoreHistory(id, ts);
      contentCache.current.set(id, restored.content);
      setDocuments((prev) =>
        prev.map((d) =>
          d.id === id
            ? {
                ...d,
                content: restored.content,
                updatedAt: restored.updatedAt,
              }
            : d,
        ),
      );
      setLastSavedAt(Date.now());
    },
    [],
  );

  // Refresh history cache when file is saved
  useEffect(() => {
    if (activeId && lastSavedAt) {
      void loadHistory(activeId);
    }
  }, [activeId, lastSavedAt, loadHistory]);

  const activeDoc = useMemo(
    () => documents.find((d) => d.id === activeId),
    [documents, activeId],
  );

  const value = useMemo(
    () => ({
      documents,
      folders,
      activeId,
      activeDoc,
      lastSavedAt,
      isLoading,
      fsConnected,
      workspaceRoot,
      error,
      createDocument,
      createFolder,
      deleteDocument,
      deleteFolder,
      duplicateDocument,
      renameDocument,
      selectDocument,
      updateActiveContent,
      getHistory,
      refreshHistory: loadHistory,
      restoreSnapshot,
      refreshDocuments,
    }),
    [
      documents,
      folders,
      activeId,
      activeDoc,
      lastSavedAt,
      isLoading,
      fsConnected,
      workspaceRoot,
      error,
      createDocument,
      createFolder,
      deleteDocument,
      deleteFolder,
      duplicateDocument,
      renameDocument,
      selectDocument,
      updateActiveContent,
      getHistory,
      loadHistory,
      restoreSnapshot,
      refreshDocuments,
    ],
  );

  return (
    <DocumentsContext.Provider value={value}>
      {children}
    </DocumentsContext.Provider>
  );
}
