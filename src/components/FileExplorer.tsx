import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { MutableRefObject } from "react";
import { useTranslation } from "react-i18next";
import {
  ChevronDown,
  ChevronRight,
  Copy,
  FileText,
  Folder,
  FolderPlus,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { useDocuments } from "../context/DocumentsContext";
import {
  buildFileTree,
  joinPath,
  type FileTreeNode,
} from "../utils/file-tree";
import Modal from "./Modal";

type DialogState =
  | { type: "new-file"; parent: string }
  | { type: "new-folder"; parent: string }
  | { type: "rename-file"; path: string; value: string }
  | { type: "confirm-delete-file"; path: string; name: string }
  | { type: "confirm-delete-folder"; path: string; name: string };

interface ContextMenuState {
  x: number;
  y: number;
  target:
    | { kind: "file"; path: string; name: string }
    | { kind: "folder"; path: string; name: string };
}

interface FileExplorerProps {
  onImport?: () => void;
  actionsRef?: MutableRefObject<FileExplorerActions | null>;
}

export interface FileExplorerActions {
  openNewFile: () => void;
  openNewFolder: () => void;
  duplicateActive: () => void;
}

export default function FileExplorer({
  onImport,
  actionsRef,
}: FileExplorerProps) {
  const { t } = useTranslation("editor");
  const {
    documents,
    folders,
    activeId,
    isLoading,
    createDocument,
    createFolder,
    deleteDocument,
    deleteFolder,
    duplicateDocument,
    renameDocument,
    selectDocument,
  } = useDocuments();

  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [dialog, setDialog] = useState<DialogState | null>(null);
  const [dialogValue, setDialogValue] = useState("");
  const [dialogError, setDialogError] = useState<string | null>(null);
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const tree = useMemo(
    () => buildFileTree(documents, folders),
    [documents, folders],
  );

  const toggleFolder = useCallback((path: string) => {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });
  }, []);

  const openNewFile = useCallback((parent = "") => {
    setDialogError(null);
    setDialog({ type: "new-file", parent });
    setDialogValue("untitled.md");
  }, []);

  const openNewFolder = useCallback((parent = "") => {
    setDialogError(null);
    setDialog({ type: "new-folder", parent });
    setDialogValue("");
  }, []);

  useEffect(() => {
    if (!actionsRef) return;
    actionsRef.current = {
      openNewFile: () => openNewFile(),
      openNewFolder: () => openNewFolder(),
      duplicateActive: () => {
        if (activeId) void duplicateDocument(activeId);
      },
    };
    return () => {
      actionsRef.current = null;
    };
  }, [actionsRef, openNewFile, openNewFolder, activeId, duplicateDocument]);

  const startInlineRename = useCallback((path: string, name: string) => {
    setRenamingId(path);
    setRenameValue(name);
  }, []);

  const commitInlineRename = useCallback(() => {
    if (renamingId && renameValue.trim()) {
      void renameDocument(renamingId, renameValue.trim());
    }
    setRenamingId(null);
    setRenameValue("");
  }, [renamingId, renameValue, renameDocument]);

  const closeDialog = useCallback(() => {
    setDialog(null);
    setDialogValue("");
    setDialogError(null);
  }, []);

  const submitDialog = useCallback(async () => {
    if (!dialog) return;
    const value = dialogValue.trim();
    const isConfirm =
      dialog.type === "confirm-delete-file" ||
      dialog.type === "confirm-delete-folder";
    if (!value && !isConfirm) return;

    setDialogError(null);
    try {
      switch (dialog.type) {
        case "new-file": {
          const path = joinPath(dialog.parent, value);
          await createDocument(path);
          break;
        }
        case "new-folder": {
          const path = joinPath(dialog.parent, value);
          await createFolder(path);
          break;
        }
        case "rename-file": {
          await renameDocument(dialog.path, value);
          break;
        }
        case "confirm-delete-file": {
          await deleteDocument(dialog.path);
          break;
        }
        case "confirm-delete-folder": {
          await deleteFolder(dialog.path);
          break;
        }
      }
      closeDialog();
    } catch (err) {
      setDialogError(err instanceof Error ? err.message : t("files.actionFailed"));
    }
  }, [
    dialog,
    dialogValue,
    createDocument,
    createFolder,
    renameDocument,
    deleteDocument,
    deleteFolder,
    closeDialog,
    t,
  ]);

  const openContextMenu = useCallback(
    (
      e: React.MouseEvent,
      target: ContextMenuState["target"],
    ) => {
      e.preventDefault();
      e.stopPropagation();
      setContextMenu({ x: e.clientX, y: e.clientY, target });
    },
    [],
  );

  useEffect(() => {
    if (!contextMenu) return;
    const close = () => setContextMenu(null);
    const onPointer = (e: MouseEvent) => {
      if (menuRef.current?.contains(e.target as Node)) return;
      close();
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("scroll", close, true);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("scroll", close, true);
    };
  }, [contextMenu]);

  const renderNode = (node: FileTreeNode, depth = 0) => {
    if (node.type === "folder") {
      const isCollapsed = collapsed.has(node.path);
      return (
        <li key={`folder:${node.path}`}>
          <div
            className="group flex items-center gap-0.5 min-w-0"
            style={{ paddingLeft: `${depth * 12}px` }}
          >
            <button
              type="button"
              onClick={() => toggleFolder(node.path)}
              className="shrink-0 text-inactive hover:text-dimmed p-0.5"
              aria-label={
                isCollapsed
                  ? t("files.expandFolder", { name: node.name })
                  : t("files.collapseFolder", { name: node.name })
              }
            >
              {isCollapsed ? (
                <ChevronRight size={12} />
              ) : (
                <ChevronDown size={12} />
              )}
            </button>
            <button
              type="button"
              onContextMenu={(e) =>
                openContextMenu(e, {
                  kind: "folder",
                  path: node.path,
                  name: node.name,
                })
              }
              className="flex items-center gap-1 min-w-0 flex-1 text-left text-dimmed hover:text-main transition-colors py-0.5"
              title={node.path}
            >
              <Folder size={12} className="shrink-0" />
              <span className="truncate">{node.name}</span>
            </button>
          </div>
          {!isCollapsed && node.children.length > 0 && (
            <ul className="space-y-0.5">
              {node.children.map((child) => renderNode(child, depth + 1))}
            </ul>
          )}
        </li>
      );
    }

    const isActive = node.path === activeId;
    const isRenaming = renamingId === node.path;

    return (
      <li key={`file:${node.path}`}>
        <div
          className={`group flex items-center gap-1 min-w-0 py-0.5 ${
            isActive ? "text-neon font-medium" : "text-inactive hover:text-dimmed"
          }`}
          style={{ paddingLeft: `${depth * 12 + 18}px` }}
        >
          <FileText size={12} className="shrink-0" />
          {isRenaming ? (
            <input
              autoFocus
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              onBlur={commitInlineRename}
              onKeyDown={(e) => {
                if (e.key === "Enter") commitInlineRename();
                if (e.key === "Escape") setRenamingId(null);
              }}
              onClick={(e) => e.stopPropagation()}
              className="flex-1 min-w-0 bg-input-bg border border-surface-dim text-main text-xs px-1 rounded outline-none"
            />
          ) : (
            <button
              type="button"
              onClick={() => void selectDocument(node.path)}
              onDoubleClick={() => startInlineRename(node.path, node.name)}
              onContextMenu={(e) =>
                openContextMenu(e, {
                  kind: "file",
                  path: node.path,
                  name: node.name,
                })
              }
              className="truncate flex-1 text-left"
              title={node.path}
            >
              {node.name}
            </button>
          )}
          {!isRenaming && documents.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setDialog({
                  type: "confirm-delete-file",
                  path: node.path,
                  name: node.name,
                });
              }}
              className="opacity-0 group-hover:opacity-100 text-dimmed hover:text-red-400 shrink-0"
              aria-label={t("files.deleteFile", { name: node.name })}
            >
              <Trash2 size={11} />
            </button>
          )}
        </div>
      </li>
    );
  };

  const dialogTitle = (() => {
    if (!dialog) return "";
    switch (dialog.type) {
      case "new-file":
        return t("files.newFileTitle");
      case "new-folder":
        return t("files.newFolderTitle");
      case "rename-file":
        return t("files.renameTitle");
      case "confirm-delete-file":
        return t("files.deleteFileTitle");
      case "confirm-delete-folder":
        return t("files.deleteFolderTitle");
      default:
        return "";
    }
  })();

  const isConfirmDialog =
    dialog?.type === "confirm-delete-file" ||
    dialog?.type === "confirm-delete-folder";

  return (
    <>
      <div className="px-4 mb-8">
        <div className="flex justify-between items-center mb-4">
          <div className="text-dimmed text-xs tracking-widest truncate">
            {t("files.explorer")}
          </div>
          <div className="flex items-center gap-2 text-dimmed">
            <button
              type="button"
              onClick={() => openNewFile()}
              className="hover:text-neon transition-colors"
              aria-label={t("files.newFile")}
              title={t("files.newFile")}
            >
              <Plus size={14} />
            </button>
            <button
              type="button"
              onClick={() => openNewFolder()}
              className="hover:text-neon transition-colors"
              aria-label={t("files.newFolder")}
              title={t("files.newFolder")}
            >
              <FolderPlus size={14} />
            </button>
          </div>
        </div>

        {isLoading ? (
          <p className="text-xs text-inactive italic">{t("files.loading")}</p>
        ) : tree.length === 0 ? (
          <p className="text-xs text-inactive italic">{t("files.empty")}</p>
        ) : (
          <ul className="text-xs space-y-0.5">{tree.map((n) => renderNode(n))}</ul>
        )}
      </div>

      {dialog && (
        <Modal title={dialogTitle} onClose={closeDialog}>
          {isConfirmDialog ? (
            <p className="text-dimmed mb-4">
              {dialog.type === "confirm-delete-file"
                ? t("files.deleteFileConfirm", { name: dialog.name })
                : t("files.deleteFolderConfirm", { name: dialog.name })}
            </p>
          ) : (
            <label className="block mb-4">
              <span className="text-dimmed block mb-2">
                {dialog.type === "new-file"
                  ? t("files.fileNameLabel")
                  : dialog.type === "new-folder"
                    ? t("files.folderNameLabel")
                    : t("files.renameLabel")}
              </span>
              {"parent" in dialog && dialog.parent && (
                <span className="text-inactive block mb-1 truncate">
                  {dialog.parent}/
                </span>
              )}
              <input
                autoFocus
                value={
                  dialog.type === "rename-file"
                    ? dialogValue || dialog.value
                    : dialogValue
                }
                onChange={(e) => setDialogValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") void submitDialog();
                }}
                placeholder={
                  dialog.type === "new-folder"
                    ? t("files.folderPlaceholder")
                    : t("files.filePlaceholder")
                }
                className="w-full bg-input-bg border border-surface-dim text-main text-xs px-2 py-1.5 rounded outline-none focus:ring-1 focus:ring-neon-dim"
              />
            </label>
          )}
          {dialogError && (
            <p className="text-red-400 text-xs mb-3">{dialogError}</p>
          )}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={closeDialog}
              className="px-3 py-1.5 rounded border border-surface-dim text-dimmed hover:text-main transition-colors"
            >
              {t("files.cancel")}
            </button>
            <button
              type="button"
              onClick={() => void submitDialog()}
              className={`px-3 py-1.5 rounded font-semibold transition-colors ${
                isConfirmDialog
                  ? "bg-red-600/90 text-white hover:bg-red-600"
                  : "bg-neon text-black hover:bg-[#00e63a]"
              }`}
            >
              {isConfirmDialog ? t("files.delete") : t("files.create")}
            </button>
          </div>
        </Modal>
      )}

      {contextMenu && (
        <div
          ref={menuRef}
          className="fixed z-[110] min-w-[10rem] py-1 rounded border border-surface-dim bg-sidebar shadow-xl font-mono text-xs"
          style={{ left: contextMenu.x, top: contextMenu.y }}
        >
          {contextMenu.target.kind === "file" ? (
            <>
              <button
                type="button"
                className="w-full text-left px-3 py-1.5 text-main hover:bg-neon-bg hover:text-neon flex items-center gap-2"
                onClick={() => {
                  void selectDocument(contextMenu.target.path);
                  setContextMenu(null);
                }}
              >
                <FileText size={12} />
                {t("files.open")}
              </button>
              <button
                type="button"
                className="w-full text-left px-3 py-1.5 text-main hover:bg-neon-bg hover:text-neon flex items-center gap-2"
                onClick={() => {
                  setDialog({
                    type: "rename-file",
                    path: contextMenu.target.path,
                    value: contextMenu.target.name,
                  });
                  setDialogValue(contextMenu.target.name);
                  setContextMenu(null);
                }}
              >
                <Pencil size={12} />
                {t("files.rename")}
              </button>
              <button
                type="button"
                className="w-full text-left px-3 py-1.5 text-main hover:bg-neon-bg hover:text-neon flex items-center gap-2"
                onClick={() => {
                  void duplicateDocument(contextMenu.target.path);
                  setContextMenu(null);
                }}
              >
                <Copy size={12} />
                {t("files.duplicate")}
              </button>
              {documents.length > 1 && (
                <button
                  type="button"
                  className="w-full text-left px-3 py-1.5 text-red-400 hover:bg-red-950/40 flex items-center gap-2"
                  onClick={() => {
                    setDialog({
                      type: "confirm-delete-file",
                      path: contextMenu.target.path,
                      name: contextMenu.target.name,
                    });
                    setContextMenu(null);
                  }}
                >
                  <Trash2 size={12} />
                  {t("files.delete")}
                </button>
              )}
            </>
          ) : (
            <>
              <button
                type="button"
                className="w-full text-left px-3 py-1.5 text-main hover:bg-neon-bg hover:text-neon flex items-center gap-2"
                onClick={() => {
                  openNewFile(contextMenu.target.path);
                  setContextMenu(null);
                }}
              >
                <Plus size={12} />
                {t("files.newFileHere")}
              </button>
              <button
                type="button"
                className="w-full text-left px-3 py-1.5 text-main hover:bg-neon-bg hover:text-neon flex items-center gap-2"
                onClick={() => {
                  openNewFolder(contextMenu.target.path);
                  setContextMenu(null);
                }}
              >
                <FolderPlus size={12} />
                {t("files.newFolderHere")}
              </button>
              <button
                type="button"
                className="w-full text-left px-3 py-1.5 text-red-400 hover:bg-red-950/40 flex items-center gap-2"
                onClick={() => {
                  setDialog({
                    type: "confirm-delete-folder",
                    path: contextMenu.target.path,
                    name: contextMenu.target.name,
                  });
                  setContextMenu(null);
                }}
              >
                <Trash2 size={12} />
                {t("files.deleteFolder")}
              </button>
            </>
          )}
          {onImport && (
            <>
              <div className="my-1 border-t border-surface-dim" />
              <button
                type="button"
                className="w-full text-left px-3 py-1.5 text-main hover:bg-neon-bg hover:text-neon"
                onClick={() => {
                  onImport();
                  setContextMenu(null);
                }}
              >
                {t("files.import")}
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
}
