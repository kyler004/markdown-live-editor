import type { MarkdownDocument } from "../context/DocumentsContext";

export type FileTreeNode =
  | {
      type: "folder";
      path: string;
      name: string;
      children: FileTreeNode[];
    }
  | {
      type: "file";
      path: string;
      name: string;
      doc: MarkdownDocument;
    };

function parentDirs(filePath: string): string[] {
  const parts = filePath.split("/");
  parts.pop();
  const dirs: string[] = [];
  for (let i = 1; i <= parts.length; i++) {
    dirs.push(parts.slice(0, i).join("/"));
  }
  return dirs;
}

function collectFolderPaths(
  documents: MarkdownDocument[],
  folders: string[],
): Set<string> {
  const paths = new Set<string>(folders);
  for (const doc of documents) {
    for (const dir of parentDirs(doc.id)) {
      paths.add(dir);
    }
  }
  return paths;
}

function insertFolder(
  root: FileTreeNode[],
  folderPath: string,
): FileTreeNode[] {
  const parts = folderPath.split("/");
  let level = root;

  for (let i = 0; i < parts.length; i++) {
    const segment = parts[i];
    const currentPath = parts.slice(0, i + 1).join("/");
    let folder = level.find(
      (n) => n.type === "folder" && n.path === currentPath,
    ) as Extract<FileTreeNode, { type: "folder" }> | undefined;

    if (!folder) {
      folder = {
        type: "folder",
        path: currentPath,
        name: segment,
        children: [],
      };
      level.push(folder);
    }

    level = folder.children;
  }

  return root;
}

function sortNodes(nodes: FileTreeNode[]): FileTreeNode[] {
  return [...nodes]
    .map((node) =>
      node.type === "folder"
        ? { ...node, children: sortNodes(node.children) }
        : node,
    )
    .sort((a, b) => {
      if (a.type !== b.type) return a.type === "folder" ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
}

export function buildFileTree(
  documents: MarkdownDocument[],
  folders: string[],
): FileTreeNode[] {
  const folderPaths = collectFolderPaths(documents, folders);
  let root: FileTreeNode[] = [];

  for (const folderPath of folderPaths) {
    root = insertFolder(root, folderPath);
  }

  for (const doc of documents) {
    const parts = doc.id.split("/");
    const fileName = parts.pop() ?? doc.id;
    let level = root;

    for (const segment of parts) {
      const folder = level.find(
        (n) => n.type === "folder" && n.name === segment,
      ) as Extract<FileTreeNode, { type: "folder" }> | undefined;
      if (!folder) break;
      level = folder.children;
    }

    level.push({
      type: "file",
      path: doc.id,
      name: fileName,
      doc,
    });
  }

  return sortNodes(root);
}

export function suggestDuplicatePath(
  sourcePath: string,
  existingPaths: string[],
): string {
  const ext = sourcePath.match(/\.(md|markdown|txt)$/i)?.[0] ?? ".md";
  const base = sourcePath.replace(/\.(md|markdown|txt)$/i, "");
  let candidate = `${base}-copy${ext}`;
  let n = 2;
  while (existingPaths.includes(candidate)) {
    candidate = `${base}-copy-${n}${ext}`;
    n++;
  }
  return candidate;
}

export function joinPath(parent: string, name: string): string {
  const trimmed = name.trim().replace(/\\/g, "/").replace(/^\/+|\/+$/g, "");
  if (!parent) return trimmed;
  if (!trimmed) return parent;
  return `${parent}/${trimmed}`;
}
