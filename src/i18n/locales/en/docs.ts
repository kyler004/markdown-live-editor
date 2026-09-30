export default {
  sections: {
    "getting-started": {
      title: "Getting Started",
      blocks: [
        {
          type: "p",
          text: "ARCHITECT_OS is a live markdown editor with per-user workspaces, real-time preview, and a built-in terminal. Create an account, open the editor, and start writing — your documents are saved automatically to your private workspace.",
        },
        { type: "h3", text: "Quick start" },
        {
          type: "ul",
          items: [
            "Visit /signup and create an account (email or OAuth)",
            "Open /app — your workspace loads index.md automatically",
            "Write markdown in the editor; preview updates in real time",
            "Use the sidebar to create, rename, or switch between files",
          ],
        },
        { type: "h3", text: "Local development" },
        {
          type: "code",
          text: "cp .env.example .env\nmake setup\nmake dev\n# → http://localhost:5173",
        },
      ],
    },
    markdown: {
      title: "Markdown Syntax",
      blocks: [
        {
          type: "p",
          text: "Standard GitHub-flavoured markdown is supported via remark-gfm. Use the editor toolbar for common formatting shortcuts.",
        },
        {
          type: "code",
          text: "# Heading 1\n## Heading 2\n\n**bold** and *italic*\n\n- Bullet list\n1. Ordered list\n\n`inline code`\n\n```javascript\nconst editor = new NeuralCore();\n```\n\n> Blockquote\n\n[Link text](https://example.com)",
        },
        {
          type: "ul",
          items: [
            "Headings appear in the sidebar outline — click to jump",
            "Task lists: - [ ] Todo / - [x] Done",
            "Tables, strikethrough, and autolinks via GFM",
          ],
        },
      ],
    },
    latex: {
      title: "LaTeX Math",
      blocks: [
        {
          type: "p",
          text: "Inline and block math are rendered with KaTeX. Wrap expressions in $ for inline or $$ for display math.",
        },
        {
          type: "code",
          text: "Inline: $E = mc^2$\n\nBlock:\n$$\n\\int_0^\\infty e^{-x^2}\\,dx = \\frac{\\sqrt{\\pi}}{2}\n$$",
        },
      ],
    },
    themes: {
      title: "Themes",
      blocks: [
        {
          type: "p",
          text: "Three visual themes are shared across the landing page, auth screens, and editor. Your choice is persisted in the browser.",
        },
        {
          type: "table",
          headers: ["Theme", "ID", "Character"],
          rows: [
            ["Architect Light", "light-blue", "Clean white UI, blue accent #0055ff"],
            ["Cyber Phosphor", "cyber-green", "Dark console, green accent #00ff66"],
            ["Obsidian Noir", "obsidian-silver", "Monochrome black, white accent"],
          ],
        },
        { type: "h3", text: "Switch themes" },
        {
          type: "ul",
          items: [
            "Landing / Docs / Login — language & theme switchers in the header",
            "Editor — Settings menu (gear icon) → Theme section",
            "Terminal — theme cyber-green (aliases: light, cyber, obsidian)",
          ],
        },
      ],
    },
    terminal: {
      title: "Terminal",
      blocks: [
        {
          type: "p",
          text: "Press Ctrl+` (backtick) to toggle the integrated terminal. It supports file stats, theme switching, and document export.",
        },
        {
          type: "code",
          text: "help                          # list commands\nstats                         # word / line / char count\ntheme cyber-green             # switch editor theme\nexport md                     # download current document\nexport html                   # export rendered preview\nclear                         # clear terminal output\nversion                       # app version info",
        },
      ],
    },
    keyboard: {
      title: "Keyboard Shortcuts",
      blocks: [
        {
          type: "table",
          headers: ["Shortcut", "Action"],
          rows: [
            ["Ctrl + `", "Toggle terminal"],
            ["Ctrl + B", "Bold (toolbar)"],
            ["Ctrl + S", "Save (auto-save is active)"],
          ],
        },
        {
          type: "p",
          text: "Editor and preview panes scroll in sync when both are visible in split mode.",
        },
      ],
    },
    auth: {
      title: "Authentication",
      blocks: [
        {
          type: "p",
          text: "Each user gets an isolated workspace at data/users/{userId}/ on the server. Sessions use HTTP-only cookies.",
        },
        {
          type: "ul",
          items: [
            "Email + password sign-up and sign-in",
            "OAuth via Google and GitHub (configure in .env)",
            "Profile menu: name, avatar, change/set password, sign out",
            "OAuth accounts link automatically when email matches",
          ],
        },
      ],
    },
    deployment: {
      title: "Deployment",
      blocks: [
        {
          type: "p",
          text: "Production deployment uses Docker. Set APP_URL, SESSION_SECRET, TRUST_PROXY, and COOKIE_SECURE for HTTPS.",
        },
        {
          type: "code",
          text: "cp .env.example .env\n# Edit APP_URL, SESSION_SECRET, OAuth keys…\nmake docker",
        },
        {
          type: "p",
          text: "See docs/DEPLOYMENT.md for Caddy/Nginx reverse proxy setup and docs/MIGRATION_POSTGRESQL.md for database migration.",
        },
      ],
    },
  },
} as const;
