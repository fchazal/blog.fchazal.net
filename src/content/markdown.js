import MarkdownIt from "markdown-it";
import footnote from "markdown-it-footnote";

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
});

md.use(footnote);

function isAbsoluteTarget(value) {
  return (
    /^(https?:)?\/\//.test(value) ||
    value.startsWith("/") ||
    value.startsWith("data:") ||
    value.startsWith("#")
  );
}

function encodePath(value) {
  return value
    .split("/")
    .map((part) => encodeURIComponent(part))
    .join("/");
}

function resolveMedia(target, env = {}) {
  const clean = String(target || "").trim().replace(/^\.\//, "");
  if (!clean || isAbsoluteTarget(clean)) return clean;

  const base = clean.includes("/")
    ? env.rootMediaBase || env.mediaBase
    : env.mediaBase || env.rootMediaBase;

  if (!base) return encodePath(clean);
  return `${String(base).replace(/\/+$/, "")}/${encodePath(clean)}`;
}

const renderImage =
  md.renderer.rules.image ||
  ((tokens, idx, options, _env, self) => self.renderToken(tokens, idx, options));

/** Résout les images relatives dans le dossier de l'entrée ou à la racine du vault. */
md.renderer.rules.image = (tokens, idx, options, env, self) => {
  const token = tokens[idx];
  const srcIdx = token.attrIndex("src");
  if (srcIdx >= 0 && env) {
    const src = token.attrs[srcIdx][1];
    token.attrs[srcIdx][1] = resolveMedia(src, env);
  }
  return renderImage(tokens, idx, options, env, self);
};

/**
 * Convertit les embeds Obsidian en Markdown standard.
 * - `![[image.png|alt]]` -> image (résolue sous `mediaBase`)
 * - `[[page|label]]`     -> lien
 */
function preprocessObsidian(src, env = {}) {
  return src
    .replace(/!\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (_m, target, alt) => {
      return `![${(alt || "").trim()}](${resolveMedia(target, env)})`;
    })
    .replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (_m, target, label) => {
      return `[${(label || target).trim()}](${resolveMedia(target, env)})`;
    });
}

/**
 * Rend un contenu Markdown en HTML.
 * @param {string} src
 * @param {{ mediaBase?: string, rootMediaBase?: string }} [options]
 */
export function renderMarkdown(src, options = {}) {
  const env = {
    mediaBase: options.mediaBase || "",
    rootMediaBase: options.rootMediaBase || options.mediaBase || "",
  };
  const prepared = preprocessObsidian(src || "", env);
  return md.render(prepared, env);
}

/** Extrait un texte brut approximatif depuis du Markdown (pour les extraits). */
export function plainText(src, maxLength = 240) {
  const text = (src || "")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[#>*_`~\-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).replace(/\s+\S*$/, "") + "…";
}
