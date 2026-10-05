import vike, { toFetchHandler } from "@vikejs/fastify";
import fastify from "fastify";
import rawBody from "fastify-raw-body";

import { addLike, countLikes } from "./src/server/db.js";
import { buildJsonFeed, buildRss, FEED_DEFINITIONS } from "./src/server/feeds.js";
import { fingerprintFor } from "./src/server/fingerprint.js";
import { registerMedia } from "./src/server/media.js";

const port = process.env.PORT ? Number.parseInt(process.env.PORT, 10) : 3000;

function isValidKey(key) {
  return typeof key === "string" && key.length > 0 && key.length <= 300;
}

async function getHandler() {
  const app = fastify({
    // Assure un HMR propre en développement
    forceCloseConnections: true,
  });

  // Nécessaire pour accéder au corps brut (webhook de publication, plus tard)
  await app.register(rawBody);

  // Fichiers Markdown/images exposés sous /media/
  await registerMedia(app);

  // API des likes (stockage SQLite)
  app.get("/api/likes", async (request, reply) => {
    const key = request.query?.key;
    if (!isValidKey(key)) {
      return reply.code(400).send({ error: "clé invalide" });
    }
    return { key, count: countLikes(key) };
  });

  app.post("/api/likes", async (request, reply) => {
    const key = request.body?.key;
    if (!isValidKey(key)) {
      return reply.code(400).send({ error: "clé invalide" });
    }
    const { count, added } = addLike(key, fingerprintFor(request));
    return { key, count, added };
  });

  // Flux RSS / JSON (global + par type)
  for (const def of FEED_DEFINITIONS) {
    app.get(def.rss, async (_request, reply) => {
      reply.type("application/rss+xml; charset=utf-8");
      return buildRss({
        type: def.type,
        title: def.title,
        description: def.description,
        link: def.link,
        selfPath: def.rss,
      });
    });

    app.get(def.json, async (_request, reply) => {
      reply.type("application/feed+json; charset=utf-8");
      return JSON.stringify(
        buildJsonFeed({
          type: def.type,
          title: def.title,
          description: def.description,
          link: def.link,
          selfPath: def.json,
        }),
      );
    });
  }

  // Compatibilité WordPress : /feed -> /feed.xml
  app.get("/feed", async (_request, reply) => reply.redirect("/feed.xml", 301));

  await vike(app, []);

  await app.ready();

  return toFetchHandler(app.routing.bind(app));
}

export default {
  fetch: await getHandler(),
  prod: { port },
};
