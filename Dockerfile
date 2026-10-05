# syntax=docker/dockerfile:1

# ---------------------------------------------------------------- Builder
FROM node:24-slim AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# ---------------------------------------------------------------- Runner
FROM node:24-slim AS runner
WORKDIR /app
ENV NODE_ENV=production

# Dépendances de production uniquement
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Build SSR (client + serveur)
COPY --from=builder /app/dist ./dist

# Dossiers runtime (montés en volumes)
RUN mkdir -p /app/content /app/data

ENV PORT=3000
ENV DATABASE_PATH=/app/data/interactions.sqlite
EXPOSE 3000

CMD ["node", "./dist/server/index.mjs"]
