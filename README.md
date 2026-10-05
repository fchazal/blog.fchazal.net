# fchazal.net

**Suppléments d'âme & Bouts d'humanité** — carnet littéraire auto-hébergé :
textes, shorts (haïkus), essais, dessins et expériences génératives (p5.js).

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
- [Scripts utilitaires](#scripts-utilitaires)

---

## Fonctionnalités

- **5 types de publication** :
  - `text` — textes (poésie / prose),
  - `short` — formats courts (haïkus, aphorismes),
  - `essay` — articles longs,
  - `experiment` — œuvres p5.js,
  - `drawing` — dessins.
- **SSR** (Vike) : HTML complet par page → SEO et partage.
- **Thème clair / sombre** persistant (`localStorage`).
- **Contenu Markdown** organisé pour Obsidian (frontmatter YAML, images locales).
- **Recherche** plein-texte (insensible aux accents).
- **Flux RSS + JSON Feed** (global et par type) + redirection `/feed`.
- **Webmentions** (commentaires/réactions via `webmention.io`) et **likes** natifs (SQLite).
- Galeries d'images, galerie de dessins en défilement, visionneuse p5.js.
- Infini-scroll, navigation précédent/suivant, barre de progression de lecture.

## Stack technique

- **Vike** + **Vite** + **React 19** (JavaScript, pas de TypeScript)
- **Fastify** (serveur HTTP + API)
- **`node:sqlite`** (module SQLite intégré à Node, aucune dépendance native)
- `gray-matter` (frontmatter), `markdown-it` (Markdown)
- CSS **pur** (variables CSS `:root` / `var()`)

> Développé sur Node 26. Le conteneur utilise `node:24-slim` (nécessaire pour `node:sqlite`).

## Structure du projet

```
.
├── content/            # sources (Obsidian) — ou dossier externe via CONTENT_PATH
├── src/
│   ├── content/        # lecture/rendu du contenu (fs, markdown)
│   ├── server/         # médias, likes (SQLite), flux, webmentions
│   └── shared/         # utilitaires partagés client/serveur
├── components/         # composants React
├── pages/              # routes Vike (+Page/+data), styles CSS
├── scripts/            # import WordPress, normalisation du contenu
├── public/             # assets statiques (logo, image d'en-tête)
├── Dockerfile
├── docker-compose.yml
└── +server.js          # point d'entrée serveur (Fastify + Vike)
```

## Contenu (Obsidian)

Le contenu vit dans `content/` — ou dans un autre dossier via `CONTENT_PATH`
(le vault Obsidian). Conventions :

```
content/
├── texts/
│   ├── 20260504-a-nouveau.md        # YYYYMMDD-slug.md
│   └── 20260504-a-nouveau.jpg       # image de couverture (même nom)
├── shorts/
│   └── 20260601-haiku.md
├── essays/
│   └── 20260110-sur-la-gravure.md
├── experiments/
│   ├── 20260615-flux.md             # métadonnées
│   ├── 20260615-flux.js             # sketch p5.js
│   ├── 20260615-flux.png            # vignette (optionnelle, même nom)
│   └── publication.yml              # registre de publication
├── drawings/
│   ├── 20260615-1430.jpg            # YYYYMMDD-hhmm[ss].ext
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
description: "Résumé court"   # optionnel
date: 2026-05-04              # optionnel (sinon déduit du nom / mtime)
---
```

- **Une image seule** → fichier de couverture à la racine, même nom que l'article
  (`YYYYMMDD-slug.jpg`).
- **Plusieurs images** → dossier `content/gallery/YYYYMMDD-slug/`.
- `publication.yml` (dans `drawings/` et `experiments/`) confirme la publication :
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
| `CONTENT_PATH` | `./content` | Dossier du contenu Markdown (`~` accepté) |
| `DATABASE_PATH` | `./data/interactions.sqlite` | Base SQLite (likes) |
| `WEBMENTION_IO_TOKEN` | — | Jeton webmention.io (lecture publique ; optionnel) |
| `PUBLICATION_WEBHOOK_URL` | — | Webhook de publication (n8n) |

Le fichier `.env` est chargé automatiquement au démarrage.

## Routes

| Route | Description |
|---|---|
| `/` | Accueil (flux de textes) |
| `/texts`, `/text/:date/:slug` | Textes |
| `/shorts`, `/short/:date/:slug` | Shorts |
| `/essays`, `/essay/:date/:slug` | Essais |
| `/experiments`, `/experiment/:date/:slug` | Expériences p5.js |
| `/drawings`, `/drawing/:date/:time` | Dessins |
| `/recherche?s=…` | Recherche |
| `/tag/:tag`, `/archive/:yyyy-mm` | Filtres |
| `/about` | Page statique |
| `/feed.xml`, `/feed.json` | Flux global (et `/texts`, `/shorts`, `/essays`, `/experiments`, `/drawings`) |
| `/feed` | Redirection 301 → `/feed.xml` |
| `/media/*` | Images et fichiers de `content/` |
| `/api/likes` | `GET ?key=…` / `POST { key }` |

---

## Déploiement

### Docker (compose)

```bash
cat > .env <<'EOF'
SITE_URL=https://blog.fchazal.net
CONTENT_PATH=/chemin/vers/le/contenu
EOF
docker compose up -d --build
```

- Service exposé sur le port **3000**.
- Volumes : `content/` (lu seul) et `./data` (SQLite).

### CasaOS (store)

Publié dans le store `fchazal/casaos-store` (app **blog**, image `fchazal-net:latest`).
CasaOS ne builde pas : construire l'image sur le serveur puis installer l'app.

```bash
# depuis le dépôt casaos-store :
./build-and-load.sh -a blog user@casaos-host
```

Dans CasaOS : **App Store → custom store → install « blog »**, puis monter le
dossier de contenu, définir `SITE_URL`, et éventuellement les tokens.

---

## Scripts utilitaires

- `scripts/import-wordpress.mjs` — importe un export WordPress (WXR) : HTML → Markdown,
  téléchargement des images (couverture unique ou galerie).
  ```bash
  node scripts/import-wordpress.mjs chemin/export.xml [--drafts] [--limit=2]
  ```
- `scripts/normalize-content.mjs` — réorganise le contenu (image unique à la racine,
  galeries dans `content/gallery/`, expériences aplaties).

---

Le code du site est personnel. Les textes, dessins et images sont la propriété de leur auteur.
