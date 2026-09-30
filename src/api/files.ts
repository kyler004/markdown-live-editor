export interface FileEntry {
  path: string;
  name: string;
  updatedAt: number;
}

export interface WorkspaceInfo {
  root: string;
  files: FileEntry[];
  folders: string[];
}

export interface FileContent {
  path: string;
  content: string;
  updatedAt: number;
}

export interface Snapshot {
  ts: number;
  content: string;
}

class FilesApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "FilesApiError";
    this.status = status;
  }
}

async function request<T>(
  url: string,
  init?: RequestInit,
): Promise<T> {
  const res = await fetch(url, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...init?.headers },
    ...init,
  });
  const data = (await res.json().catch(() => ({}))) as T & { error?: string };
  if (!res.ok) {
    throw new FilesApiError(data.error ?? res.statusText, res.status);
  }
  return data;
}

export async function checkHealth(): Promise<{ ok: boolean; auth: boolean }> {
  return request("/api/health");
}

export async function fetchWorkspace(): Promise<WorkspaceInfo> {
  return request("/api/workspace");
}

export async function fetchFile(path: string): Promise<FileContent> {
  return request(`/api/files?path=${encodeURIComponent(path)}`);
}

export async function saveFile(
  path: string,
  content: string,
): Promise<{ path: string; updatedAt: number }> {
  return request(`/api/files?path=${encodeURIComponent(path)}`, {
    method: "PUT",
    body: JSON.stringify({ content }),
  });
}

export async function createFile(
  path?: string,
  content = "",
): Promise<{ path: string; updatedAt: number }> {
  return request("/api/files", {
    method: "POST",
    body: JSON.stringify({ path, content }),
  });
}

export async function deleteFile(path: string): Promise<void> {
  await request(`/api/files?path=${encodeURIComponent(path)}`, {
    method: "DELETE",
  });
}

export async function renameFile(
  path: string,
  newPath: string,
): Promise<{ path: string; updatedAt: number }> {
  return request(`/api/files?path=${encodeURIComponent(path)}`, {
    method: "PATCH",
    body: JSON.stringify({ newPath }),
  });
}

export async function createFolder(
  path: string,
): Promise<{ path: string }> {
  return request("/api/folders", {
    method: "POST",
    body: JSON.stringify({ path }),
  });
}

export async function deleteFolder(path: string): Promise<void> {
  await request(`/api/folders?path=${encodeURIComponent(path)}`, {
    method: "DELETE",
  });
}

export async function fetchHistory(path: string): Promise<Snapshot[]> {
  const data = await request<{ snapshots: Snapshot[] }>(
    `/api/history?path=${encodeURIComponent(path)}`,
  );
  return data.snapshots;
}

export async function restoreHistory(
  path: string,
  ts: number,
): Promise<FileContent> {
  return request(`/api/history/restore?path=${encodeURIComponent(path)}`, {
    method: "POST",
    body: JSON.stringify({ ts }),
  });
}

export { FilesApiError };
