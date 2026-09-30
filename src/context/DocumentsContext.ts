import { createContext, useContext } from "react";

export interface MarkdownDocument {
  /** Relative path inside the workspace (e.g. `notes/readme.md`). */
  id: string;
  name: string;
  content: string;
  updatedAt: number;
}

export interface DocumentSnapshot {
  ts: number;
  content: string;
}

export interface DocumentsContextValue {
  documents: MarkdownDocument[];
  folders: string[];
  activeId: string;
  activeDoc: MarkdownDocument | undefined;
  lastSavedAt: number | null;
  isLoading: boolean;
  fsConnected: boolean;
  workspaceRoot: string | null;
  error: string | null;
  createDocument: (name?: string, content?: string) => Promise<string>;
  createFolder: (path: string) => Promise<string>;
  deleteDocument: (id: string) => Promise<void>;
  deleteFolder: (path: string) => Promise<void>;
  duplicateDocument: (id: string) => Promise<string>;
  renameDocument: (id: string, name: string) => Promise<void>;
  selectDocument: (id: string) => Promise<void>;
  updateActiveContent: (content: string) => void;
  getHistory: (id: string) => DocumentSnapshot[];
  refreshHistory: (id: string) => Promise<DocumentSnapshot[]>;
  restoreSnapshot: (id: string, ts: number) => Promise<void>;
  refreshDocuments: () => Promise<void>;
}

export const DocumentsContext = createContext<DocumentsContextValue | null>(
  null,
);

export function useDocuments(): DocumentsContextValue {
  const ctx = useContext(DocumentsContext);
  if (!ctx) {
    throw new Error("useDocuments must be used within a DocumentsProvider");
  }
  return ctx;
}
