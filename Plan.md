Audit et plan d'amelioration de l'editeur Markdown

Contexte

App React 19 + Vite + Tailwind v4, 100% client. UI soignee mais erreurs de compilation, code mort, fonctions factices, et ecarts vs la promesse "Overleaf for markdown". Repo reel dans markdown-live-editor/markdown-live-editor/.

Phase 1 - Debloquer (build + runtime)





Reinstaller les deps manquantes: npm install (verifier react-simple-code-editor, prismjs presents dans node_modules).



Corriger App.tsx: importer useTheme et le type Theme depuis ./context/ThemeContext (lignes 20 et 203 cassent tsc).



Typer les callbacks de Editor.tsx (code: string) pour supprimer les any implicites.



Objectif: npm run build et npm run lint passent sans erreur.

Phase 2 - Bugs





Export HTML: dans Terminal.tsx, .preview-content n'existe pas. Ajouter la classe preview-content au conteneur rendu de Preview.tsx (ou passer le HTML via une ref) pour exporter le vrai rendu.



LaTeX: cabler remark-math + rehype-katex (ou katex) dans ReactMarkdown de Preview.tsx, conformement au README. Sinon retirer la mention du README.



Sync-scroll App.tsx: garder contre la division par zero (denominator <= 0), eviter les sauts.



Retirer les console.log/console.warn de toggleTerminal/closeTerminal.

Phase 3 - Nettoyage





Supprimer le code mort non importe: Header.tsx, EditorPanel.tsx, PreviewPanel.tsx, utils/markdownParser.ts.



Retirer la dependance inutilisee html2pdf.js (ou la reutiliser pour l'export PDF en Phase 4).



Retirer l'import inutilise Minus dans Terminal.tsx.



Mettre a jour le README (structure reelle, features reellement presentes).

Phase 4 - Combler les fonctionnalites factices

Persistance du document: sauvegarder markdown dans localStorage (debounce), restaurer au chargement.



Brancher les actions reelles: export Download (md/html/pdf) sur le bouton de Preview et Printer du Topbar; bouton PREVIEW/PanelRight pour basculer l'affichage.



Sidebar: rendre la liste de fichiers dynamique (au minimum stockage local multi-documents) ou marquer clairement comme demo.



Accessibilite: convertir les <div onClick> interactifs en <button> avec gestion clavier.

Phase 5 - Vision "Overleaf for markdown" (optionnel, plus large)





Multi-fichiers reels + arborescence persistee.



Backend (auth, stockage documents) + collaboration temps reel (CRDT type Yjs).



Export serveur (PDF) et partage par lien.



Tests (Vitest + RTL), error boundary, CI lint/build.

Verification





npm run lint et npm run build verts.



Test manuel: edition + preview live, scroll synchro, themes, commandes terminal (export md, export html, stats, theme), rechargement conserve le contenu.

