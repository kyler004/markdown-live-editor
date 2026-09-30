# Markdown Live Editor

A real-time markdown editor with live preview, built with React, TypeScript, and Vite.

![Markdown Editor](https://img.shields.io/badge/React-19-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4)

##  Features

- **Live Preview**: See your markdown rendered in real-time as you type (via `react-markdown` + `remark-gfm`)
- **Synchronized Scrolling**: The editor and preview panes scroll together
- **LaTeX Support**: Inline (`$E=mc^2$`) and block (`$$...$$`) math via `remark-math` + `rehype-katex`
- **Syntax Highlighting**: Markdown editing powered by `react-simple-code-editor` + PrismJS
- **Themes**: `light-blue`, `cyber-green`, and `obsidian-silver` — shared across landing, docs, auth, and editor (persisted in `localStorage`)
- **i18n**: English and French (`react-i18next`) — language switcher on marketing/auth pages; preference stored in `architect-locale`
- **Built-in Terminal**: Toggle with `Ctrl+\``; supports `help`, `stats`, `theme`, `export md|html`, and more
- **Auto-save**: Documents are saved to disk in your local workspace folder
- **Local file server**: A Node.js API reads/writes markdown files on your machine (no cloud VPS needed)
- **Resizable Panels**: Adjust the sidebar, editor, preview, and terminal layout

## Authentication

- **Email + password** — sign up / sign in with per-user private workspace
- **OAuth** — Google & GitHub (configure `GOOGLE_*` / `GITHUB_*` in `.env`)
- **Profile menu** — avatar, name, email, change/set password, sign out
- OAuth accounts link automatically when the email matches an existing account

### OAuth redirect URIs

| Environment | Google / GitHub callback |
|-------------|--------------------------|
| Dev | `http://localhost:5173/api/auth/{google\|github}/callback` |
| Prod | `https://your-domain/api/auth/{google\|github}/callback` |

## Production (VPS / Docker)

```bash
cp .env.example .env
# Set APP_URL, SESSION_SECRET, TRUST_PROXY=true, COOKIE_SECURE=true

make docker
```

See **[docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)** for HTTPS (Caddy/Nginx), backups, and **[docs/MIGRATION_POSTGRESQL.md](docs/MIGRATION_POSTGRESQL.md)** for PostgreSQL migration.

## Local file workspace (per user)

Each authenticated user gets a **private folder** on disk:

```
data/users/{userId}/index.md
```

```bash
cp .env.example .env   # set SESSION_SECRET
make setup
make dev
```

| URL | Page |
|-----|------|
| http://localhost:5173/ | Landing |
| http://localhost:5173/docs | Documentation |
| http://localhost:5173/signup | Create account |
| http://localhost:5173/login | Sign in |
| http://localhost:5173/app | Editor (protected) |

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
git clone https://github.com/kyler004/markdown-live-editor.git
cd markdown-live-editor
npm install
cp .env.example .env   # optional — set WORKSPACE_ROOT
npm run dev
```

The app will be available at `http://localhost:5173`.

##  Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS v4** - Styling
- **Lucide React** - Icons

##  Project Structure

```
server/
├── index.ts            # Express API (read/write workspace files)
└── fs-utils.ts         # Safe path handling + history snapshots
workspace/              # Your markdown files on disk (default server root)
src/
├── api/
│   └── files.ts        # Frontend client for /api/*
```
├── components/
│   ├── Topbar.tsx        # Top menu bar + terminal toggle
│   ├── Sidebar.tsx       # Activity bar, explorer, outline
│   ├── Editor.tsx        # Markdown code editor (PrismJS highlighting)
│   ├── Preview.tsx       # Rendered markdown preview (react-markdown + KaTeX)
│   ├── Terminal.tsx      # Interactive command terminal
│   └── SettingsMenu.tsx  # Theme switcher menu (portal)
├── context/
│   ├── ThemeContext.ts   # Theme context + useTheme hook
│   └── ThemeProvider.tsx # Theme state + localStorage persistence
├── data/
│   └── initialMarkdown.ts # Default editor content
├── App.tsx               # Main application layout
├── main.tsx              # Entry point
└── index.css             # Global styles + theme tokens
```

##  Available Scripts

| Command           | Description              |
| ----------------- | ------------------------ |
| `npm run dev`     | Start development server |
| `npm run build`   | Build for production     |
| `npm run preview` | Preview production build |
| `npm run lint`    | Run ESLint               |

##  Supported Markdown

- Headers (`#`, `##`, `###`)
- **Bold** and _Italic_ text
- `Inline code` and code blocks
- Links and blockquotes
- Unordered and ordered lists
- Horizontal rules
- LaTeX math (inline and block)

##  License

MIT

---

