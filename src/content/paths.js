import "../server/load-env.js";

import os from "node:os";
import path from "node:path";

/**
 * Racine de travail. Le serveur est lancé depuis la racine du projet
 * (ou depuis /app dans le conteneur), et le bundling ne doit pas
 * influencer la résolution des chemins — on n'utilise donc pas `import.meta.url`.
 */
export const rootDir = process.cwd();

/** Développe un éventuel `~` en dossier personnel. */
function expandHome(value) {
  if (value === "~") return os.homedir();
  if (value.startsWith("~/")) return path.join(os.homedir(), value.slice(2));
  return value;
}

/** Dossier des sources Markdown, surchargeable via CONTENT_PATH. */
export const contentDir = process.env.CONTENT_PATH
  ? path.resolve(expandHome(process.env.CONTENT_PATH))
  : path.join(rootDir, "content");
