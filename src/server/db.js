import fs from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";

import { rootDir } from "../content/paths.js";

const dbPath = process.env.DATABASE_PATH
  ? path.resolve(process.env.DATABASE_PATH)
  : path.join(rootDir, "data", "interactions.sqlite");

fs.mkdirSync(path.dirname(dbPath), { recursive: true });

export const db = new DatabaseSync(dbPath);

try {
  db.exec("PRAGMA journal_mode = WAL;");
} catch {
  /* WAL non critique */
}

db.exec(`
  CREATE TABLE IF NOT EXISTS likes (
    key          TEXT NOT NULL,
    fingerprint  TEXT NOT NULL,
    created_at   TEXT NOT NULL,
    PRIMARY KEY (key, fingerprint)
  );
  CREATE INDEX IF NOT EXISTS idx_likes_key ON likes(key);
`);

/**
 * Une « clé » = chemin de la ressource likée (ex: /post/2026-05-04/a-nouveau).
 * On stocke un événement par (clé, empreinte navigateur) pour éviter les doublons.
 */
export function countLikes(key) {
  const row = db
    .prepare("SELECT COUNT(*) AS n FROM likes WHERE key = ?")
    .get(key);
  return row ? Number(row.n) : 0;
}

export function addLike(key, fingerprint) {
  const info = db
    .prepare(
      "INSERT OR IGNORE INTO likes (key, fingerprint, created_at) VALUES (?, ?, ?)",
    )
    .run(key, fingerprint, new Date().toISOString());
  return { count: countLikes(key), added: info.changes > 0 };
}
