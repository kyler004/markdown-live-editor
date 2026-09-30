export default {
  sections: {
    "getting-started": {
      title: "Premiers pas",
      blocks: [
        {
          type: "p",
          text: "ARCHITECT_OS est un éditeur markdown live avec espaces par utilisateur, aperçu temps réel et terminal intégré. Créez un compte, ouvrez l'éditeur et écrivez — vos documents sont sauvegardés automatiquement dans votre espace privé.",
        },
        { type: "h3", text: "Démarrage rapide" },
        {
          type: "ul",
          items: [
            "Allez sur /signup et créez un compte (e-mail ou OAuth)",
            "Ouvrez /app — votre espace charge index.md automatiquement",
            "Écrivez du markdown ; l'aperçu se met à jour en temps réel",
            "Utilisez la barre latérale pour créer, renommer ou changer de fichier",
          ],
        },
        { type: "h3", text: "Développement local" },
        {
          type: "code",
          text: "cp .env.example .env\nmake setup\nmake dev\n# → http://localhost:5173",
        },
      ],
    },
    markdown: {
      title: "Syntaxe Markdown",
      blocks: [
        {
          type: "p",
          text: "Le markdown GitHub-flavoured est pris en charge via remark-gfm. Utilisez la barre d'outils de l'éditeur pour le formatage courant.",
        },
        {
          type: "code",
          text: "# Titre 1\n## Titre 2\n\n**gras** et *italique*\n\n- Liste à puces\n1. Liste numérotée\n\n`code inline`\n\n```javascript\nconst editor = new NeuralCore();\n```\n\n> Citation\n\n[Texte du lien](https://example.com)",
        },
        {
          type: "ul",
          items: [
            "Les titres apparaissent dans le plan latéral — cliquez pour naviguer",
            "Listes de tâches : - [ ] À faire / - [x] Fait",
            "Tableaux, barré et autolinks via GFM",
          ],
        },
      ],
    },
    latex: {
      title: "Mathématiques LaTeX",
      blocks: [
        {
          type: "p",
          text: "Les formules inline et en bloc sont rendues avec KaTeX. Entourez les expressions de $ (inline) ou $$ (bloc).",
        },
        {
          type: "code",
          text: "Inline : $E = mc^2$\n\nBloc :\n$$\n\\int_0^\\infty e^{-x^2}\\,dx = \\frac{\\sqrt{\\pi}}{2}\n$$",
        },
      ],
    },
    themes: {
      title: "Thèmes",
      blocks: [
        {
          type: "p",
          text: "Trois thèmes visuels sont partagés entre la landing, l'authentification et l'éditeur. Votre choix est enregistré dans le navigateur.",
        },
        {
          type: "table",
          headers: ["Thème", "ID", "Caractère"],
          rows: [
            ["Architect Light", "light-blue", "UI claire, accent bleu #0055ff"],
            ["Cyber Phosphor", "cyber-green", "Console sombre, accent vert #00ff66"],
            ["Obsidian Noir", "obsidian-silver", "Noir monochrome, accent blanc"],
          ],
        },
        { type: "h3", text: "Changer de thème" },
        {
          type: "ul",
          items: [
            "Landing / Docs / Login — sélecteurs langue et thème dans l'en-tête",
            "Éditeur — menu Paramètres (engrenage) → section Thème",
            "Terminal — theme cyber-green (alias : light, cyber, obsidian)",
          ],
        },
      ],
    },
    terminal: {
      title: "Terminal",
      blocks: [
        {
          type: "p",
          text: "Appuyez sur Ctrl+` (accent grave) pour afficher le terminal intégré. Stats, changement de thème et export de documents.",
        },
        {
          type: "code",
          text: "help                          # liste des commandes\nstats                         # mots / lignes / caractères\ntheme cyber-green             # changer le thème\nexport md                     # télécharger le document\nexport html                   # exporter l'aperçu rendu\nclear                         # effacer le terminal\nversion                       # version de l'app",
        },
      ],
    },
    keyboard: {
      title: "Raccourcis clavier",
      blocks: [
        {
          type: "table",
          headers: ["Raccourci", "Action"],
          rows: [
            ["Ctrl + `", "Afficher le terminal"],
            ["Ctrl + B", "Gras (barre d'outils)"],
            ["Ctrl + S", "Sauvegarder (auto-save actif)"],
          ],
        },
        {
          type: "p",
          text: "L'éditeur et l'aperçu défilent en synchronisation en mode split.",
        },
      ],
    },
    auth: {
      title: "Authentification",
      blocks: [
        {
          type: "p",
          text: "Chaque utilisateur dispose d'un espace isolé dans data/users/{userId}/ sur le serveur. Les sessions utilisent des cookies HTTP-only.",
        },
        {
          type: "ul",
          items: [
            "Inscription et connexion par e-mail + mot de passe",
            "OAuth Google et GitHub (à configurer dans .env)",
            "Menu profil : nom, avatar, mot de passe, déconnexion",
            "Les comptes OAuth se lient automatiquement si l'e-mail correspond",
          ],
        },
      ],
    },
    deployment: {
      title: "Déploiement",
      blocks: [
        {
          type: "p",
          text: "Le déploiement production utilise Docker. Définissez APP_URL, SESSION_SECRET, TRUST_PROXY et COOKIE_SECURE pour HTTPS.",
        },
        {
          type: "code",
          text: "cp .env.example .env\n# Éditer APP_URL, SESSION_SECRET, clés OAuth…\nmake docker",
        },
        {
          type: "p",
          text: "Voir docs/DEPLOYMENT.md pour Caddy/Nginx et docs/MIGRATION_POSTGRESQL.md pour la migration base de données.",
        },
      ],
    },
  },
} as const;
