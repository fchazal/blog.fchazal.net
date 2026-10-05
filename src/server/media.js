import fs from "node:fs";
import path from "node:path";

import { contentDir } from "../content/paths.js";

const MIME = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".avif": "image/avif",
  ".svg": "image/svg+xml",
  ".js": "application/javascript; charset=utf-8",
  ".mjs": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".md": "text/plain; charset=utf-8",
  ".html": "text/html; charset=utf-8",
};

/**
 * Expose les fichiers de `content/` en lecture, sous `/media/`.
 * Ex: content/texts/20260504-a-nouveau.jpg -> /media/texts/20260504-a-nouveau.jpg
 *
 * Note : on n'utilise pas `@fastify/static` car ses réponses 304 (requêtes
 * conditionnelles) ne sont pas convertibles en `Response` par l'adaptateur
 * fetch de Vike (`srvx`). On sert donc le flux, sans ETag/Last-Modified, avec
 * un cache immutable : le navigateur ne revalide pas.
 */
export async function registerMedia(app) {
  app.get("/media/*", async (request, reply) => {
    const relative = request.params["*"] || "";
    const target = path.resolve(contentDir, relative);

    const withinContent =
      target === contentDir || target.startsWith(contentDir + path.sep);
    if (!withinContent) {
      return reply.code(403).send({ message: "Forbidden" });
    }

    let stat;
    try {
      stat = fs.statSync(target);
    } catch {
      return reply.code(404).send({ message: "Not found" });
    }
    if (!stat.isFile()) {
      return reply.code(404).send({ message: "Not found" });
    }

    reply
      .header(
        "Content-Type",
        MIME[path.extname(target).toLowerCase()] || "application/octet-stream",
      )
      .header("Content-Length", stat.size)
      .header("Cache-Control", "public, max-age=31536000, immutable")
      .header("Last-Modified", new Date(stat.mtimeMs).toUTCString());

    return reply.send(fs.createReadStream(target));
  });
}
