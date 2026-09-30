# Migration SQLite → PostgreSQL

ARCHITECT_OS utilise **SQLite** par défaut (`better-sqlite3`). Ce guide décrit comment migrer vers **PostgreSQL** pour un déploiement à plus grande échelle.

## Quand migrer ?

- Plusieurs instances de l'app (SQLite = un seul writer)
- Besoin de réplication / sauvegardes managées
- Volume utilisateurs élevé sur les tables `sessions` / `users`

Les **fichiers markdown** restent sur disque (`DATA_ROOT/users/{userId}/`) — seule la métadonnée auth migre.

## Schéma PostgreSQL

```sql
CREATE EXTENSION IF NOT EXISTS citext;

CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email CITEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  password_hash TEXT NOT NULL DEFAULT '',
  image TEXT,
  created_at BIGINT NOT NULL
);

CREATE TABLE sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at BIGINT NOT NULL
);

CREATE TABLE oauth_accounts (
  provider TEXT NOT NULL,
  provider_account_id TEXT NOT NULL,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  PRIMARY KEY (provider, provider_account_id)
);

CREATE INDEX idx_sessions_user ON sessions(user_id);
CREATE INDEX idx_sessions_expires ON sessions(expires_at);
CREATE INDEX idx_oauth_user ON oauth_accounts(user_id);
```

`CITEXT` remplace `COLLATE NOCASE` de SQLite pour l'unicité email insensible à la casse.

## Export depuis SQLite

```bash
sqlite3 -header -csv data/app.db "SELECT * FROM users;" > users.csv
sqlite3 -header -csv data/app.db "SELECT * FROM sessions;" > sessions.csv
sqlite3 -header -csv data/app.db "SELECT * FROM oauth_accounts;" > oauth.csv
```

## Import dans PostgreSQL

```bash
psql "$DATABASE_URL" -f schema.sql
psql "$DATABASE_URL" -c "\copy users FROM 'users.csv' CSV HEADER"
psql "$DATABASE_URL" -c "\copy sessions FROM 'sessions.csv' CSV HEADER"
psql "$DATABASE_URL" -c "\copy oauth_accounts FROM 'oauth.csv' CSV HEADER"
```

## Adapter le code serveur

Remplacer `server/db.ts` par un driver `pg` (ou Drizzle / Prisma) avec les mêmes requêtes SQL.

Variables d'environnement :

```env
DATABASE_URL=postgresql://architect:secret@db:5432/architect
```

Retirer `better-sqlite3` une fois la migration validée.

## docker-compose (service db)

```yaml
services:
  db:
    image: postgres:16-alpine
    restart: unless-stopped
    environment:
      POSTGRES_USER: architect
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: architect
    volumes:
      - pg-data:/var/lib/postgresql/data

volumes:
  pg-data:
```

## Points d'attention

| Sujet | Recommandation |
|-------|----------------|
| Sessions actives | Migrer la table `sessions` telle quelle, ou forcer une reconnexion |
| Emails | Utiliser `citext` ou contrainte `UNIQUE (LOWER(email))` |
| Fichiers | Copier `data/users/` vers le nouveau volume — chemins inchangés |
| Rollback | Garder une copie de `app.db` avant bascule |

## Vérification post-migration

1. Connexion email + OAuth
2. `GET /api/auth/profile` retourne le bon utilisateur
3. Lecture/écriture fichiers dans le workspace
4. Nouvelle session après redémarrage

Voir aussi [DEPLOYMENT.md](./DEPLOYMENT.md) pour le déploiement VPS complet.
