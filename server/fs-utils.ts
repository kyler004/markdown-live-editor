import fs from "node:fs/promises";
import path from "node:path";

const MARKDOWN_EXT = new Set([".md", ".markdown", ".txt"]);
const ARCHITECT_DIR = ".architect";
const HISTORY_DIR = path.join(ARCHITECT_DIR, "history");

export interface FileEntry {
  path: string;
  name: string;
  updatedAt: number;
}

export function resolveDataRoot(): string {
  const configured = process.env.DATA_ROOT?.trim();
  if (configured) return path.resolve(configured);
  return path.resolve(process.cwd(), "data");
}

/** Per-user private workspace — isolated from other users. */
export function resolveUserWorkspace(userId: string): string {
  return path.join(resolveDataRoot(), "users", userId);
}

/** @deprecated Legacy global workspace — use resolveUserWorkspace(userId). */
export function resolveWorkspaceRoot(): string {
  const configured = process.env.WORKSPACE_ROOT?.trim();
  if (configured) return path.resolve(configured);
  return path.resolve(process.cwd(), "workspace");
}

/** Ensure `relativePath` stays inside workspace (no traversal). */
export function safePath(workspaceRoot: string, relativePath: string): string {
  const normalized = relativePath.replace(/\\/g, "/").replace(/^\/+/, "");
  const resolved = path.resolve(workspaceRoot, normalized);
  const rootWithSep = workspaceRoot.endsWith(path.sep)
    ? workspaceRoot
    : workspaceRoot + path.sep;

  if (
    resolved !== workspaceRoot &&
    !resolved.startsWith(rootWithSep)
  ) {
    throw new Error("Path escapes workspace");
  }
  return resolved;
}

export function isMarkdownFile(filePath: string): boolean {
  return MARKDOWN_EXT.has(path.extname(filePath).toLowerCase());
}

export async function ensureWorkspace(workspaceRoot: string): Promise<void> {
  await fs.mkdir(workspaceRoot, { recursive: true });
  await fs.mkdir(path.join(workspaceRoot, HISTORY_DIR), { recursive: true });

  const indexPath = path.join(workspaceRoot, "index.md");
  try {
    await fs.access(indexPath);
  } catch {
    const seed = `# Welcome to ARCHITECT_OS

Your local workspace is ready. Files saved here are stored on disk at:

\`${workspaceRoot}\`

Edit this file or create new ones from the Explorer sidebar.
`;
    await fs.writeFile(indexPath, seed, "utf-8");
  }
}

async function walkMarkdownFiles(
  dir: string,
  workspaceRoot: string,
  acc: FileEntry[],
): Promise<void> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === ARCHITECT_DIR) continue;

    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await walkMarkdownFiles(abs, workspaceRoot, acc);
      continue;
    }
    if (!entry.isFile() || !isMarkdownFile(entry.name)) continue;

    const stat = await fs.stat(abs);
    const rel = path.relative(workspaceRoot, abs).replace(/\\/g, "/");
    acc.push({
      path: rel,
      name: entry.name,
      updatedAt: stat.mtimeMs,
    });
  }
}

export async function listFiles(workspaceRoot: string): Promise<FileEntry[]> {
  const files: FileEntry[] = [];
  await walkMarkdownFiles(workspaceRoot, workspaceRoot, files);
  files.sort((a, b) => a.path.localeCompare(b.path));
  return files;
}

async function walkDirectories(
  dir: string,
  workspaceRoot: string,
  acc: Set<string>,
): Promise<void> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === ARCHITECT_DIR) continue;
    if (!entry.isDirectory()) continue;

    const abs = path.join(dir, entry.name);
    const rel = path.relative(workspaceRoot, abs).replace(/\\/g, "/");
    acc.add(rel);
    await walkDirectories(abs, workspaceRoot, acc);
  }
}

export async function listFolders(workspaceRoot: string): Promise<string[]> {
  const dirs = new Set<string>();
  await walkDirectories(workspaceRoot, workspaceRoot, dirs);
  return [...dirs].sort((a, b) => a.localeCompare(b));
}

export async function createDirectory(
  workspaceRoot: string,
  relativePath: string,
): Promise<void> {
  const normalized = relativePath.replace(/\\/g, "/").replace(/^\/+|\/+$/g, "");
  if (!normalized) throw new Error("Folder path is required");
  const abs = safePath(workspaceRoot, normalized);
  await fs.mkdir(abs, { recursive: true });
}

export async function deleteDirectory(
  workspaceRoot: string,
  relativePath: string,
): Promise<void> {
  const normalized = relativePath.replace(/\\/g, "/").replace(/^\/+|\/+$/g, "");
  if (!normalized) throw new Error("Folder path is required");
  const abs = safePath(workspaceRoot, normalized);
  const entries = await fs.readdir(abs);
  const visible = entries.filter((e) => e !== ARCHITECT_DIR);
  if (visible.length > 0) throw new Error("Folder is not empty");
  await fs.rmdir(abs);
}

export async function readFile(
  workspaceRoot: string,
  relativePath: string,
): Promise<{ content: string; updatedAt: number }> {
  const abs = safePath(workspaceRoot, relativePath);
  const stat = await fs.stat(abs);
  if (!stat.isFile()) throw new Error("Not a file");
  const content = await fs.readFile(abs, "utf-8");
  return { content, updatedAt: stat.mtimeMs };
}

export async function writeFile(
  workspaceRoot: string,
  relativePath: string,
  content: string,
): Promise<{ updatedAt: number }> {
  const abs = safePath(workspaceRoot, relativePath);
  await fs.mkdir(path.dirname(abs), { recursive: true });
  await fs.writeFile(abs, content, "utf-8");
  const stat = await fs.stat(abs);
  return { updatedAt: stat.mtimeMs };
}

export async function createFile(
  workspaceRoot: string,
  relativePath: string,
  content = "",
): Promise<{ updatedAt: number }> {
  const normalized = relativePath.replace(/\\/g, "/").replace(/^\/+/, "");
  if (!isMarkdownFile(normalized)) {
    throw new Error("Only .md, .markdown, .txt files are allowed");
  }
  const abs = safePath(workspaceRoot, normalized);
  try {
    await fs.access(abs);
    throw new Error("File already exists");
  } catch (err) {
    if (err instanceof Error && err.message === "File already exists") throw err;
  }
  return writeFile(workspaceRoot, normalized, content);
}

export async function deleteFile(
  workspaceRoot: string,
  relativePath: string,
): Promise<void> {
  const abs = safePath(workspaceRoot, relativePath);
  await fs.unlink(abs);
}

export async function renameFile(
  workspaceRoot: string,
  relativePath: string,
  newPath: string,
): Promise<{ path: string; updatedAt: number }> {
  const from = safePath(workspaceRoot, relativePath);
  const to = safePath(workspaceRoot, newPath.replace(/\\/g, "/").replace(/^\/+/, ""));
  if (!isMarkdownFile(to)) {
    throw new Error("Target must be a markdown file");
  }
  await fs.mkdir(path.dirname(to), { recursive: true });
  await fs.rename(from, to);
  const stat = await fs.stat(to);
  return { path: path.relative(workspaceRoot, to).replace(/\\/g, "/"), updatedAt: stat.mtimeMs };
}

function historyFile(workspaceRoot: string, relativePath: string): string {
  const key = Buffer.from(relativePath).toString("base64url");
  return path.join(workspaceRoot, HISTORY_DIR, `${key}.json`);
}

export interface Snapshot {
  ts: number;
  content: string;
}

const MAX_SNAPSHOTS = 25;
const SNAPSHOT_INTERVAL_MS = 15000;

export async function appendHistorySnapshot(
  workspaceRoot: string,
  relativePath: string,
  content: string,
): Promise<void> {
  const file = historyFile(workspaceRoot, relativePath);
  let snaps: Snapshot[] = [];
  try {
    const raw = await fs.readFile(file, "utf-8");
    snaps = JSON.parse(raw) as Snapshot[];
  } catch {
    // new history file
  }

  const last = snaps[snaps.length - 1];
  const changed = !last || last.content !== content;
  const elapsed = !last || Date.now() - last.ts > SNAPSHOT_INTERVAL_MS;
  if (!changed || !elapsed) return;

  snaps = [...snaps, { ts: Date.now(), content }].slice(-MAX_SNAPSHOTS);
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, JSON.stringify(snaps, null, 2), "utf-8");
}

export async function getHistory(
  workspaceRoot: string,
  relativePath: string,
): Promise<Snapshot[]> {
  const file = historyFile(workspaceRoot, relativePath);
  try {
    const raw = await fs.readFile(file, "utf-8");
    return JSON.parse(raw) as Snapshot[];
  } catch {
    return [];
  }
}

export async function uniquePath(
  workspaceRoot: string,
  baseName: string,
): Promise<string> {
  const name = baseName.endsWith(".md") ? baseName : `${baseName}.md`;
  let candidate = name;
  let n = 1;
  while (true) {
    try {
      safePath(workspaceRoot, candidate);
      await fs.access(path.join(workspaceRoot, candidate));
      candidate = name.replace(/\.md$/i, `-${n}.md`);
      n++;
    } catch {
      return candidate;
    }
  }
}
