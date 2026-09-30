import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  handleMe,
  handleSignIn,
  handleSignOut,
  handleSignUp,
  requireAuth,
  sessionSecret,
  type AuthedRequest,
} from "./auth.js";
import { getDb } from "./db.js";
import {
  getOAuthProviders,
  handleGithubCallback,
  handleGithubStart,
  handleGoogleCallback,
  handleGoogleStart,
} from "./oauth.js";
import {
  handleGetProfile,
  handleUpdateProfile,
  handleChangePassword,
} from "./profile.js";
import {
  appendHistorySnapshot,
  createDirectory,
  createFile,
  deleteDirectory,
  deleteFile,
  getHistory,
  listFiles,
  listFolders,
  readFile,
  renameFile,
  uniquePath,
  writeFile,
} from "./fs-utils.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT ?? 3001);
const APP_URL = process.env.APP_URL?.trim() || "http://localhost:5173";

const app = express();

if (process.env.TRUST_PROXY === "true") {
  app.set("trust proxy", 1);
}

app.use(
  cors({
    origin: APP_URL,
    credentials: true,
  }),
);
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser(sessionSecret()));

function requirePath(queryPath: unknown): string {
  const p = String(queryPath ?? "").trim();
  if (!p) throw new Error("path query parameter is required");
  return p;
}

function message(err: unknown): string {
  return err instanceof Error ? err.message : "Unknown error";
}

function workspace(req: AuthedRequest): string {
  return req.workspaceRoot!;
}

// ── Public ────────────────────────────────────────────────────
app.get("/api/health", (_req, res) => {
  res.json({ ok: true, auth: true });
});

app.post("/api/auth/sign-up", (req, res) => void handleSignUp(req, res));
app.post("/api/auth/sign-in", (req, res) => void handleSignIn(req, res));
app.post("/api/auth/sign-out", handleSignOut);
app.get("/api/auth/me", handleMe);
app.get("/api/auth/providers", (_req, res) => {
  res.json(getOAuthProviders());
});

app.get("/api/auth/google", handleGoogleStart);
app.get("/api/auth/google/callback", handleGoogleCallback);
app.get("/api/auth/github", handleGithubStart);
app.get("/api/auth/github/callback", handleGithubCallback);

app.get("/api/auth/profile", requireAuth, handleGetProfile);
app.patch("/api/auth/profile", requireAuth, (req, res) =>
  void handleUpdateProfile(req as AuthedRequest, res),
);
app.post("/api/auth/change-password", requireAuth, (req, res) =>
  void handleChangePassword(req as AuthedRequest, res),
);

// ── Protected file API (per-user workspace) ─────────────────────
app.get("/api/workspace", requireAuth, async (req: AuthedRequest, res) => {
  try {
    const root = workspace(req);
    const [files, folders] = await Promise.all([
      listFiles(root),
      listFolders(root),
    ]);
    res.json({ root, files, folders });
  } catch (err) {
    res.status(500).json({ error: message(err) });
  }
});

app.get("/api/files", requireAuth, async (req: AuthedRequest, res) => {
  try {
    const rel = requirePath(req.query.path);
    const data = await readFile(workspace(req), rel);
    res.json({ path: rel, ...data });
  } catch (err) {
    const msg = message(err);
    const status =
      msg === "path query parameter is required" || msg === "Path escapes workspace"
        ? 400
        : 404;
    res.status(status).json({ error: msg });
  }
});

app.put("/api/files", requireAuth, async (req: AuthedRequest, res) => {
  try {
    const rel = requirePath(req.query.path);
    const content = String(req.body?.content ?? "");
    const root = workspace(req);
    const { updatedAt } = await writeFile(root, rel, content);
    await appendHistorySnapshot(root, rel, content);
    res.json({ path: rel, updatedAt });
  } catch (err) {
    res.status(400).json({ error: message(err) });
  }
});

app.post("/api/files", requireAuth, async (req: AuthedRequest, res) => {
  try {
    const root = workspace(req);
    let rel = String(req.body?.path ?? "").trim();
    const content = String(req.body?.content ?? "");

    if (!rel) {
      rel = await uniquePath(root, "untitled.md");
    } else if (!/\.(md|markdown|txt)$/i.test(rel)) {
      rel = `${rel}.md`;
    }

    const { updatedAt } = await createFile(root, rel, content);
    res.status(201).json({ path: rel, updatedAt });
  } catch (err) {
    res.status(400).json({ error: message(err) });
  }
});

app.patch("/api/files", requireAuth, async (req: AuthedRequest, res) => {
  try {
    const rel = requirePath(req.query.path);
    const newPath = String(req.body?.newPath ?? "").trim();
    if (!newPath) {
      res.status(400).json({ error: "newPath is required" });
      return;
    }
    const result = await renameFile(workspace(req), rel, newPath);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: message(err) });
  }
});

app.delete("/api/files", requireAuth, async (req: AuthedRequest, res) => {
  try {
    const rel = requirePath(req.query.path);
    await deleteFile(workspace(req), rel);
    res.json({ ok: true });
  } catch (err) {
    res.status(400).json({ error: message(err) });
  }
});

app.post("/api/folders", requireAuth, async (req: AuthedRequest, res) => {
  try {
    const rel = String(req.body?.path ?? "").trim();
    if (!rel) {
      res.status(400).json({ error: "path is required" });
      return;
    }
    await createDirectory(workspace(req), rel);
    res.status(201).json({ path: rel.replace(/\\/g, "/").replace(/^\/+|\/+$/g, "") });
  } catch (err) {
    res.status(400).json({ error: message(err) });
  }
});

app.delete("/api/folders", requireAuth, async (req: AuthedRequest, res) => {
  try {
    const rel = requirePath(req.query.path);
    await deleteDirectory(workspace(req), rel);
    res.json({ ok: true });
  } catch (err) {
    res.status(400).json({ error: message(err) });
  }
});

app.get("/api/history", requireAuth, async (req: AuthedRequest, res) => {
  try {
    const rel = requirePath(req.query.path);
    const snapshots = await getHistory(workspace(req), rel);
    res.json({ path: rel, snapshots });
  } catch (err) {
    res.status(400).json({ error: message(err) });
  }
});

app.post("/api/history/restore", requireAuth, async (req: AuthedRequest, res) => {
  try {
    const rel = requirePath(req.query.path);
    const ts = Number(req.body?.ts);
    const root = workspace(req);
    const snapshots = await getHistory(root, rel);
    const snap = snapshots.find((s) => s.ts === ts);
    if (!snap) {
      res.status(404).json({ error: "Snapshot not found" });
      return;
    }
    const { updatedAt } = await writeFile(root, rel, snap.content);
    res.json({ path: rel, content: snap.content, updatedAt });
  } catch (err) {
    res.status(400).json({ error: message(err) });
  }
});

// ── Static (production) ───────────────────────────────────────
const distPath = path.resolve(__dirname, "../dist");
app.use(express.static(distPath));
app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api/")) return next();
  res.sendFile(path.join(distPath, "index.html"), (err) => {
    if (err) res.status(404).send("Build the client first: npm run build");
  });
});

async function main() {
  getDb();
  app.listen(PORT, () => {
    console.log(`ARCHITECT_OS server  http://localhost:${PORT}`);
    console.log(`CORS origin        ${APP_URL}`);
    console.log(`User data          data/users/{userId}/`);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
