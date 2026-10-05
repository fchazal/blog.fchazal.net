import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { XMLParser } from "fast-xml-parser";
import matter from "gray-matter";
import TurndownService from "turndown";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");

/* ------------------------------------------------------------------ */
/* Arguments                                                          */
/* ------------------------------------------------------------------ */

const args = process.argv.slice(2);
const inputFile =
  args.find((a) => !a.startsWith("--")) ||
  "/Users/fchazal/Downloads/supplmentsd039meampboutsd039humanit.WordPress.2026-10-04.xml";
const includeDrafts = args.includes("--drafts");
const limitArg = args.find((a) => a.startsWith("--limit="));
const limit = limitArg ? Number(limitArg.split("=")[1]) : Infinity;

const outDir = path.join(root, "content", "posts");
const galleryRoot = path.join(root, "content", "gallery");
fs.mkdirSync(outDir, { recursive: true });

/* ------------------------------------------------------------------ */
/* Helpers                                                            */
/* ------------------------------------------------------------------ */

const turndown = new TurndownService({
  headingStyle: "atx",
  codeBlockStyle: "fenced",
  bulletListMarker: "-",
  emDelimiter: "*",
  strongDelimiter: "**",
  linkStyle: "inlined",
});

function slugify(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/['’]/g, "-")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function decodeEntities(value) {
  return String(value || "")
    .replace(/&#0?39;|&#8217;|&rsquo;/g, "’")
    .replace(/&#0?38;|&amp;/g, "&")
    .replace(/&quot;|&#34;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ");
}

function extFromUrl(url, contentType) {
  const fromPath = path.extname(new URL(url).pathname).toLowerCase();
  if (/^\.(jpe?g|png|gif|webp|avif|svg)$/.test(fromPath)) return fromPath;
  if (contentType.includes("png")) return ".png";
  if (contentType.includes("gif")) return ".gif";
  if (contentType.includes("webp")) return ".webp";
  if (contentType.includes("avif")) return ".avif";
  if (contentType.includes("svg")) return ".svg";
  return ".jpg";
}

const HOST_MAP = {
  "blog.chazal.me": "blog.fchazal.net",
  "www.chazal.me": "fchazal.net",
  "chazal.me": "fchazal.net",
};

function normalizeHost(host) {
  return HOST_MAP[host] || host;
}

/** URLs candidates : original (sans suffixe -WxH) puis version affichée. */
function candidateUrls(src) {
  let url;
  try {
    url = new URL(src);
  } catch {
    return [];
  }

  let origin = `https://${normalizeHost(url.hostname)}`;
  let pathname = url.pathname;

  if (/^i\d\.wp\.com$/.test(url.hostname)) {
    const parts = pathname.replace(/^\//, "").split("/");
    const host = normalizeHost(parts.shift());
    origin = `https://${host}`;
    pathname = "/" + parts.join("/");
  }

  const plain = `${origin}${pathname}`;
  const withoutSize = plain.replace(/-\d+x\d+(?=\.[a-zA-Z0-9]+$)/, "");

  const list = [];
  if (withoutSize !== plain) list.push(withoutSize);
  list.push(plain);
  return [...new Set(list)];
}

async function downloadImage(src, destDir, index, forcedName = null) {
  for (const url of candidateUrls(src)) {
    try {
      const response = await fetch(url, {
        headers: { "user-agent": "fchazal.net-import" },
        signal: AbortSignal.timeout(30000),
      });
      if (!response.ok) continue;
      const contentType = response.headers.get("content-type") || "";
      if (!contentType.startsWith("image/")) continue;

      const buffer = Buffer.from(await response.arrayBuffer());
      const urlPath = new URL(url).pathname;
      const originalExt = path.extname(urlPath);
      const ext = extFromUrl(url, contentType);
      const baseRaw = path.basename(urlPath, originalExt);
      const base = slugify(baseRaw).slice(0, 40) || "image";
      const name = forcedName
        ? `${forcedName}${ext}`
        : `${String(index).padStart(2, "0")}-${base}${ext}`;

      fs.writeFileSync(path.join(destDir, name), buffer);
      return name;
    } catch {
      /* essaie l'URL suivante */
    }
  }
  return null;
}

/**
 * Télécharge les images du contenu et réécrit leurs `src` en local.
 * Une seule image : à la racine, sous le nom du post (couverture).
 * Plusieurs images : dans un dossier du même nom (galerie).
 */
async function localizeImages(html, baseName) {
  const srcs = [
    ...html.matchAll(/<img\b[^>]*?\bsrc=("|')(.*?)\1/gi),
  ].map((m) => m[2]);
  const unique = [...new Set(srcs)];
  const single = unique.length === 1;
  const targetDir = single ? outDir : path.join(galleryRoot, baseName);
  if (!single) fs.mkdirSync(targetDir, { recursive: true });

  const map = new Map();
  let index = 0;
  for (const src of unique) {
    index += 1;
    const local = await downloadImage(
      decodeEntities(src),
      targetDir,
      index,
      single ? baseName : null,
    );
    if (local) {
      map.set(src, single ? local : `gallery/${baseName}/${local}`);
      process.stdout.write(".");
    } else {
      process.stdout.write("x");
    }
  }

  return html.replace(
    /(<img\b[^>]*?\bsrc=)("|')(.*?)\2/gi,
    (match, prefix, quote, src) => {
      const local = map.get(src) ?? map.get(decodeEntities(src));
      return local ? `${prefix}${quote}${local}${quote}` : match;
    },
  );
}

function htmlToMarkdown(html) {
  const withoutBlocks = html
    .replace(/<!--\s*\/?wp:.*?-->/g, "")
    .replace(/<!--[\s\S]*?-->/g, "");
  const markdown = turndown.turndown(withoutBlocks);
  return markdown
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]+\n/g, "\n")
    .trim();
}

/* ------------------------------------------------------------------ */
/* Parse WXR                                                          */
/* ------------------------------------------------------------------ */

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  trimValues: true,
  processEntities: true,
});

const xml = fs.readFileSync(inputFile, "utf8");
const doc = parser.parse(xml);
const items = doc?.rss?.channel?.item ?? [];
const list = Array.isArray(items) ? items : [items];

function text(node) {
  if (node == null) return "";
  if (typeof node === "string") return node;
  if (typeof node === "object" && "#text" in node) return node["#text"];
  return "";
}

/* ------------------------------------------------------------------ */
/* Convert                                                            */
/* ------------------------------------------------------------------ */

let written = 0;
let images = 0;
let skipped = 0;

for (const item of list) {
  const postType = text(item["wp:post_type"]);
  if (postType !== "post") continue;

  const status = text(item["wp:status"]) || "draft";
  if (status !== "publish" && !includeDrafts) continue;

  const dateRaw = text(item["wp:post_date"]);
  const date = dateRaw.slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    skipped += 1;
    continue;
  }

  const rawTitle = text(item.title);
  const name = text(item["wp:post_name"]);
  const slug = slugify(name) || slugify(rawTitle) || `brouillon-${text(item["wp:post_id"])}`;
  const baseName = `${date.replace(/-/g, "")}-${slug}`;

  const contentHtml = text(item["content:encoded"]);
  const categories = (Array.isArray(item.category) ? item.category : [item.category])
    .filter(Boolean)
    .filter((c) => (c["@_domain"] || "category") === "category")
    .map((c) => decodeEntities(typeof c === "string" ? c : c["#text"]))
    .filter(Boolean);

  let html = decodeEntities(contentHtml);

  // Détermine s'il faut télécharger des images
  const hasImages = /<img\b/i.test(html);

  const before = [...html.matchAll(/<img\b/gi)].length;
  if (hasImages) {
    html = await localizeImages(html, baseName);
  }
  const after = [...html.matchAll(/<img\b/gi)].length;
  images += before;

  const body = htmlToMarkdown(html);
  const front = {
    title: rawTitle || slug,
    tags: categories,
    status: status === "publish" ? "published" : "draft",
  };

  const output = matter.stringify(body ? body + "\n" : "", front);
  fs.writeFileSync(path.join(outDir, `${baseName}.md`), output);

  written += 1;
  process.stdout.write(`\n✓ ${baseName}.md (${categories.join(", ") || "sans tag"})\n`);

  if (limit && written >= limit) break;
}

console.log(
  `\n\n${written} articles importés, ${images} images traitées, ${skipped} ignorés.`,
);
