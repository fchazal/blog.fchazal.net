# fchazal.net

**Suppléments d'âme & Bouts d'humanité** — carnet littéraire auto-hébergé :
textes, essais, dessins et œuvres génératives (p5.js).

Rendu **côté serveur** (SSR), contenu en **Markdown**, thème clair/sombre,
recherche, flux RSS/JSON, Webmentions et likes.

---

## Sommaire

- [Fonctionnalités](#fonctionnalités)
- [Stack technique](#stack-technique)
- [Structure du projet](#structure-du-projet)
- [Contenu (Obsidian)](#contenu-obsidian)
- [Développement](#développement)
- [Configuration](#configuration)
- [Routes](#routes)
- [Déploiement](#déploiement)
  - [Docker (compose)](#docker-compose)
  - [CasaOS (store)](#casaos-store)
- [Scripts utilitaires](#scripts-utilitaires)

---

## Fonctionnalités

- **4 types de publication** : `post` (poésie/prose), `essay` (article long),
  `doodle` (dessin), `code` (œuvre p5.js).
- **SSR** (Vike) : HTML complet par page → SEO, partage, indexation.
- **Thème clair / sombre** persistant (`localStorage`).
- **Contenu Markdown** organisé pour Obsidian (frontmatter YAML, images locales).
- **Recherche** plein-texte (insensible aux accents).
- **Flux RSS/Atom + JSON Feed** (global et par type) + redirection `/feed`.
- **Webmentions** (commentaires/réactions via `webmention.io`).
- **Likes** natifs (SQLite intégré à Node).
- Galeries d'images, galerie de dessins en défilement, visionneuse d'œuvres p5.js.
- Infini-scroll, navigation précédent/suivant, barre de progression de lecture.

## Stack technique

- **Vike** + **Vite** + **React 19** (JavaScript, pas de TypeScript)
- **Fastify** (serveur HTTP + API)
- **`node:sqlite`** (module SQLite intégré à Node, aucune dépendance native)
- `gray-matter` (frontmatter), `markdown-it` (Markdown)
- CSS **pur** (variables CSS `:root` / `var()`, pas de framework CSS)

> Développé sur Node 26. Le conteneur utilise `node:24-slim` (nécessaire pour
> `node:sqlite`).

## Structure du projet

```
.
├── content/            # sources (Obsidian) — voir plus bas
├── src/
│   ├── content/        # lecture/rendu du contenu (fs, markdown)
│   ├── server/         # médias, likes (SQLite), flux, webmentions
│   └── shared/         # utilitaires partagés client/serveur
├── components/         # composants React
├── pages/              # routes Vike (+Page/+data), thème et styles CSS
├── scripts/            # import WordPress, normalisation du contenu
├── design/             # maquettes SVG (Penpot)
├── public/             # assets statiques (logo, image d'en-tête)
├── Dockerfile
├── docker-compose.yml
└── +server.js          # point d'entrée serveur (Fastify + Vike)
```

## Contenu (Obsidian)

Le contenu vit dans `content/` (monté en volume en production). Conventions :

```
content/
├── posts/
│   ├── 20260504-a-nouveau.md        # YYYYMMDD-slug.md
│   └── 20260504-a-nouveau.jpg       # image de couverture (même nom)
├── essays/
│   └── 20260110-sur-la-gravure.md
├── doodles/
│   ├── 20260615-1430.jpg            # YYYYMMDD-hhmm[ss].ext
│   └── publication.yml              # registre de publication
├── code/
│   ├── 20260615-flux.md             # métadonnées
│   ├── 20260615-flux.js             # sketch p5.js
│   ├── 20260615-flux.png            # vignette (optionnelle, même nom)
│   └── publication.yml
├── gallery/                         # images de galerie (multi-images)
│   └── 20200802-quimperle-au-soleil/…
└── pages/
    └── about.md
```

### Frontmatter

```yaml
---
title: "À nouveau"
tags: [démons, pensées]
status: published        # draft | scheduled | published
description: "Résumé court"   # optionnel (essais, partage)
date: 2026-05-04              # optionnel (sinon déduit du nom / mtime)
---
```

- **Une image seule** → fichier de couverture à la racine, même nom que l'article
  (`YYYYMMDD-slug.jpg`).
- **Plusieurs images** → dossier `content/gallery/YYYYMMDD-slug/`.
- Les images sont référencées automatiquement (`/media/…`) ; le contenu Markdown
  peut contenir des images embarquées.
- `publication.yml` (dans `doodles/` et `code/`) confirme la publication :
  ```yaml
  published:
    20260615-1430.jpg: "2026-06-15T14:30:00+02:00"
  ```

## Développement

```bash
npm install
npm run dev            # http://localhost:3000
```

Autres commandes :

```bash
npm run build          # build SSR (dist/client + dist/server)
npm run preview        # build + preview
npm run prod           # build + démarrage du serveur de production
```

## Configuration

Variables d'environnement (`.env`, voir `.env.example`) :

| Variable | Défaut | Description |
|---|---|---|
| `PORT` | `3000` | Port d'écoute |
| `SITE_URL` | `http://localhost:3000` | URL publique (URLs absolues : flux, Webmentions, OG) |
| `CONTENT_PATH` | `./content` | Dossier du contenu Markdown |
| `DATABASE_PATH` | `./data/interactions.sqlite` | Base SQLite (likes) |
| `WEBMENTION_IO_TOKEN` | — | Jeton webmention.io (lecture publique ; optionnel) |
| `PUBLICATION_WEBHOOK_URL` | — | Webhook de publication (n8n) |

## Routes

| Route | Description |
|---|---|
| `/` | Accueil (flux de textes) |
| `/posts`, `/post/:date/:slug` | Textes |
| `/essays`, `/essay/:date/:slug` | Essais |
| `/code`, `/code/:date/:slug` | Œuvres p5.js |
| `/doodles`, `/doodle/:date/:time` | Dessins |
| `/recherche?s=…` | Recherche |
| `/tag/:tag`, `/archive/:yyyy-mm` | Filtres |
| `/about` | Page statique |
| `/feed.xml`, `/feed.json` | Flux global (+ `/posts/feed.xml`, `/essays/feed.xml`, `/code/feed.xml`, `/doodles/feed.xml`) |
| `/feed` | Redirection 301 → `/feed.xml` |
| `/media/*` | Images et fichiers de `content/` |
| `/api/likes` | `GET ?key=…` / `POST { key }` |

---

## Déploiement

### Docker (compose)

Le projet inclut un `Dockerfile` multi-stage (build + runtime) et un
`docker-compose.yml`.

```bash
# 1. Variables d'environnement (créer un .env à côté du compose)
cat > .env <<'EOF'
SITE_URL=https://blog.fchazal.net
CONTENT_PATH=./content
# WEBMENTION_IO_TOKEN=
# PUBLICATION_WEBHOOK_URL=
EOF

# 2. Build + démarrage
docker compose up -d --build
```

- Le service expose le port **3000**.
- Volumes : `content/` (lu seul) et `./data` (SQLite).
- `SITE_URL` est indispensable pour les flux et les URL absolues.

### CasaOS (store)

Ce projet est publié dans le store CasaOS `fchazal/casaos-store`
(app **blog**, image `fchazal-net:latest`).

CasaOS **ne build pas** les images : il faut d'abord construire l'image sur le
serveur, puis installer l'app.

```bash
# depuis le dépôt casaos-store :
./build-and-load.sh -a blog user@casaos-host
#   -p <port>   port SSH (défaut 22)
#   -u          sudo pour docker
#   -r <path>   dossier de build distant (défaut /tmp/casaos-build)
```

Ensuite, dans CasaOS : **App Store → custom store → install « blog »**.
Pense à :

1. monter ton dossier de contenu Obsidian dans le volume `./content` ;
2. définir `SITE_URL` (ex. `https://blog.fchazal.net`) ;
3. (optionnel) renseigner `WEBMENTION_IO_TOKEN` et `PUBLICATION_WEBHOOK_URL`.

Le reverse proxy CasaOS pointe le domaine vers `http://<hôte>:3000`.

---

## Scripts utilitaires

- `scripts/import-wordpress.mjs` — importe un export WordPress (WXR) : convertit
  HTML → Markdown, télécharge les images (couverture unique ou galerie).
  ```bash
  node scripts/import-wordpress.mjs chemin/export.xml [--drafts] [--limit=2]
  ```
- `scripts/normalize-content.mjs` — réorganise le contenu (image unique à la
  racine, galeries dans `content/gallery/`, code aplati).
- `design/generate.mjs` — génère les maquettes SVG (Penpot) dans `design/`.
  ```bash
  node design/generate.mjs
  ```

---

## Licence / contenu

Le code du site est personnel. Les textes, dessins et images sont la propriété
de leur auteur.
