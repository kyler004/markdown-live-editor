# Déploiement VPS — ARCHITECT_OS

Guide pour héberger l'éditeur sur un VPS avec Docker, HTTPS et persistance des données.

## Prérequis

- Docker + Docker Compose
- Un nom de domaine pointant vers le VPS
- Reverse proxy HTTPS (Caddy ou Nginx recommandé)

## Démarrage rapide

```bash
cp .env.example .env
# Éditer .env : APP_URL, SESSION_SECRET, OAuth…

make docker
# ou: docker compose up -d --build
```

L'application écoute sur le port **3001**. Les fichiers utilisateurs et la base SQLite sont dans le volume Docker `architect-data` (`/app/data`).

## Variables d'environnement (production)

| Variable | Description |
|----------|-------------|
| `APP_URL` | URL publique HTTPS, ex. `https://editor.example.com` |
| `SESSION_SECRET` | Chaîne aléatoire ≥ 32 caractères (`openssl rand -hex 32`) |
| `DATABASE_URL` | `./data/app.db` (défaut, dans le volume) |
| `DATA_ROOT` | `./data` |
| `TRUST_PROXY` | `true` derrière un reverse proxy |
| `COOKIE_SECURE` | `true` en HTTPS (cookies `Secure`) |
| `GOOGLE_CLIENT_ID` / `SECRET` | OAuth Google (optionnel) |
| `GITHUB_CLIENT_ID` / `SECRET` | OAuth GitHub (optionnel) |

### OAuth — URIs de redirection

En production, enregistrer :

- `https://votre-domaine/api/auth/google/callback`
- `https://votre-domaine/api/auth/github/callback`

Le proxy doit transmettre `/api` vers le conteneur (ou servir l'app en mode `npm run start` sur un seul port).

## HTTPS avec Caddy (exemple)

```caddyfile
editor.example.com {
    reverse_proxy localhost:3001
}
```

Caddy gère Let's Encrypt automatiquement. Dans `.env` :

```env
APP_URL=https://editor.example.com
TRUST_PROXY=true
COOKIE_SECURE=true
NODE_ENV=production
```

## HTTPS avec Nginx (extrait)

```nginx
server {
    listen 443 ssl http2;
    server_name editor.example.com;

    ssl_certificate     /etc/letsencrypt/live/editor.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/editor.example.com/privkey.pem;

    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## Sauvegarde des données

```bash
docker compose exec app ls -la /app/data
docker run --rm -v markdown-live-editor_architect-data:/data -v $(pwd):/backup \
  alpine tar czf /backup/architect-data-backup.tar.gz -C /data .
```

Contenu important :

- `data/app.db` — utilisateurs, sessions, comptes OAuth
- `data/users/{userId}/` — workspaces markdown

## Migration SQLite → PostgreSQL

L'application utilise **SQLite** par défaut. Pour migrer vers PostgreSQL :

**[docs/MIGRATION_POSTGRESQL.md](./MIGRATION_POSTGRESQL.md)**

## Mode développement vs production

| | Dev | Production |
|---|-----|------------|
| Client | Vite `:5173` | Servi depuis `dist/` par Express |
| API | `:3001` + proxy Vite | Même port `:3001` |
| Cookies Secure | `false` | `true` (`COOKIE_SECURE`) |
| CORS | `APP_URL` local | URL HTTPS publique |

## Vérification post-déploiement

1. `curl https://votre-domaine/api/health` → `{"ok":true,"auth":true}`
2. Inscription / connexion email
3. OAuth (si configuré)
4. Création de fichier → persiste après `docker compose restart`
5. Cookie `architect_session` avec flag `Secure` en HTTPS
