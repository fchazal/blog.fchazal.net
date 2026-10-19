import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

import { contentDir } from "./paths.js";
import { plainText, renderMarkdown } from "./markdown.js";
import { slugify } from "../shared/slug.js";

export { slugify };

const IMAGE_EXT = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"];
const IMAGE_EXT_SET = new Set(IMAGE_EXT);
const MEDIA_ROOT = "/media";

const ENTRY_DIR = /^(\d{4})(\d{2})(\d{2})-(.+)$/;

function dirPath(...parts) {
  return path.join(contentDir, ...parts);
}

function readDirSafe(dir) {
  try {
    return fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return [];
  }
}

function isImage(name) {
  return IMAGE_EXT_SET.has(path.extname(name).toLowerCase());
}

function naturalCompare(a, b) {
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });
}

function mediaUrl(...parts) {
  const joined = parts
    .flatMap((p) => String(p).split("/"))
    .filter(Boolean)
    .map((part) => encodeURIComponent(part))
    .join("/");
  return `${MEDIA_ROOT}/${joined}`;
}

function listFiles(dir) {
  return readDirSafe(dir)
    .filter((item) => item.isFile())
    .map((item) => item.name)
    .sort(naturalCompare);
}

function listImages(dir) {
  return listFiles(dir).filter(isImage);
}

function parseEntryDir(name) {
  const match = ENTRY_DIR.exec(name);
  if (!match) return null;
  const [, y, mo, d, folderSlug] = match;
  return {
    date: `${y}-${mo}-${d}`,
    compact: `${y}${mo}${d}`,
    folderSlug,
    base: name,
  };
}

function readContentFile(fullPath) {
  return matter(fs.readFileSync(fullPath, "utf8"));
}

function entryDateInFuture(date) {
  return new Date(date).getTime() > Date.now();
}

function isDraft(data) {
  const status = data?.status;
  return status === false || status === "false" || status === "draft";
}

function shouldSkip(data, date) {
  if (isDraft(data)) return true;
  return data?.status === "scheduled" && entryDateInFuture(date);
}

function sortByDateDesc(a, b) {
  if (a.date === b.date) return a.slug < b.slug ? 1 : -1;
  return a.date < b.date ? 1 : -1;
}

function entryTags(entry) {
  const tags = entry.data.tags;
  if (Array.isArray(tags)) return tags;
  return tags ? [tags] : [];
}

function stripImages(html) {
  return html
    .replace(
      /<figure[^>]*>\s*<img[^>]*>\s*(?:<figcaption[\s\S]*?<\/figcaption>)?\s*<\/figure>/gi,
      "",
    )
    .replace(/<a[^>]*>\s*<img[^>]*>\s*<\/a>/gi, "")
    .replace(/<img[^>]*>/gi, "")
    .replace(/<p>\s*(?:&nbsp;|\s)*<\/p>/gi, "")
    .replace(/<li>\s*(?:&nbsp;|\s)*<\/li>/gi, "")
    .replace(/<ul>\s*(?:&nbsp;|\s)*<\/ul>/gi, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function renderEntryHtml(entry) {
  return renderMarkdown(entry.content, {
    mediaBase: entry.mediaBase,
    rootMediaBase: MEDIA_ROOT,
  });
}

function readEntry(collection, folderName) {
  const parsed = parseEntryDir(folderName);
  if (!parsed) return null;

  const dir = dirPath(collection, folderName);
  const indexPath = path.join(dir, "index.md");

  let stat;
  try {
    stat = fs.statSync(indexPath);
  } catch {
    return null;
  }
  if (!stat.isFile()) return null;

  const { data, content } = readContentFile(indexPath);
  if (shouldSkip(data, parsed.date)) return null;

  const rawSlug = typeof data.slug === "string" ? data.slug.trim() : "";
  const slug = slugify(rawSlug) || slugify(parsed.folderSlug) || parsed.folderSlug;

  const imageFiles = listImages(dir);
  const gallery = imageFiles.map((name) => mediaUrl(collection, folderName, name));

  return {
    ...parsed,
    slug,
    collection,
    dir,
    files: listFiles(dir),
    imageFiles,
    data,
    content,
    mediaBase: mediaUrl(collection, folderName),
    cover: gallery[0] || null,
    gallery,
  };
}

function summaryFromEntry(entry) {
  const rendered = renderEntryHtml(entry);
  const images = entry.gallery.length
    ? entry.gallery
    : entry.cover
      ? [entry.cover]
      : [];

  return {
    title: entry.data.title || entry.slug,
    date: entry.date,
    slug: entry.slug,
    url: entry.url,
    tags: entryTags(entry),
    description: entry.data.description || plainText(entry.content, 180),
    excerpt: plainText(entry.content, 260),
    cover: entry.cover,
    gallery: entry.gallery,
    images,
    html: stripImages(rendered),
  };
}

/* ------------------------------------------------------------------ */
/* Collections datées (`YYYYMMDD-slug/index.md`)                       */
/* ------------------------------------------------------------------ */

function loadDatedCollection(collection, urlSegment) {
  const dir = dirPath(collection);
  const entries = [];

  for (const item of readDirSafe(dir)) {
    if (!item.isDirectory()) continue;

    const entry = readEntry(collection, item.name);
    if (!entry) continue;

    entries.push({
      ...entry,
      url: `/${urlSegment}/${entry.date}/${entry.slug}`,
    });
  }

  return entries.sort(sortByDateDesc);
}

/* Textes */
export function listTexts() {
  return loadDatedCollection("texts", "text").map(summaryFromEntry);
}

export function getText(date, slug) {
  return listTexts().find((p) => p.date === date && p.slug === slug) || null;
}

export function listTextsByTag(tagSlug) {
  return listTexts().filter((p) => p.tags.some((t) => slugify(t) === tagSlug));
}

export function listTextsByMonth(ym) {
  return listTexts().filter((p) => p.date.slice(0, 7) === ym);
}

/* Essais */
export function listEssays() {
  return loadDatedCollection("essays", "essay").map(summaryFromEntry);
}

export function getEssay(date, slug) {
  return listEssays().find((p) => p.date === date && p.slug === slug) || null;
}

export function listEssaysByTag(tagSlug) {
  return listEssays().filter((p) => p.tags.some((t) => slugify(t) === tagSlug));
}

/* Shorts */
export function listShorts() {
  return loadDatedCollection("shorts", "short").map(summaryFromEntry);
}

export function getShort(date, slug) {
  return listShorts().find((p) => p.date === date && p.slug === slug) || null;
}

export function listShortsByTag(tagSlug) {
  return listShorts().filter((p) => p.tags.some((t) => slugify(t) === tagSlug));
}

/* Dessins (`YYYYMMDD-NN/index.md`) */
export function listDrawings() {
  const dir = dirPath("drawings");
  const drawings = [];

  for (const item of readDirSafe(dir)) {
    if (!item.isDirectory()) continue;

    const entry = readEntry("drawings", item.name);
    if (!entry) continue;

    const imageName = entry.imageFiles[0];
    if (!imageName) continue;

    const timeCompact = entry.folderSlug;

    drawings.push({
      date: entry.date,
      time: timeCompact,
      timeCompact,
      filename: imageName,
      src: mediaUrl("drawings", item.name, imageName),
      url: `/drawing/${entry.date}/${timeCompact}`,
      publishedAt: entry.data.published
        ? String(entry.data.published)
        : `${entry.date}T00:00:00`,
    });
  }

  return drawings.sort((a, b) =>
    `${a.date}${a.timeCompact}` < `${b.date}${b.timeCompact}` ? 1 : -1,
  );
}

export function getDrawing(date, timeCompact) {
  return listDrawings().find((d) => d.date === date && d.timeCompact === timeCompact) || null;
}

/* Expérimentations p5.js (`YYYYMMDD-slug/index.md`) */
export function listExperiments({ withSource = false } = {}) {
  const dir = dirPath("experiments");
  const works = [];

  for (const item of readDirSafe(dir)) {
    if (!item.isDirectory()) continue;

    const entry = readEntry("experiments", item.name);
    if (!entry) continue;

    const sketchName = entry.files.find(
      (name) => path.extname(name).toLowerCase() === ".js",
    );
    const imageName = entry.imageFiles[0];
    const source =
      withSource && sketchName
        ? fs.readFileSync(path.join(entry.dir, sketchName), "utf8")
        : null;

    works.push({
      ...entry,
      url: `/experiment/${entry.date}/${entry.slug}`,
      title: entry.data.title || entry.slug,
      tags: entryTags(entry),
      description: entry.data.description || plainText(entry.content, 180),
      excerpt: plainText(entry.content, 260),
      html: renderEntryHtml(entry),
      image: imageName ? mediaUrl("experiments", item.name, imageName) : null,
      sketchUrl: sketchName
        ? mediaUrl("experiments", item.name, sketchName)
        : null,
      source,
    });
  }

  return works.sort(sortByDateDesc);
}

export function getExperiment(date, slug) {
  return (
    listExperiments({ withSource: true }).find(
      (w) => w.date === date && w.slug === slug,
    ) || null
  );
}

export function listExperimentsByTag(tagSlug) {
  return listExperiments().filter((w) => w.tags.some((t) => slugify(t) === tagSlug));
}

/* ------------------------------------------------------------------ */
/* Pages statiques                                                     */
/* ------------------------------------------------------------------ */

export function getPage(slug) {
  const file = dirPath(`${slug}.md`);
  if (!fs.existsSync(file)) return null;
  const { data, content } = readContentFile(file);
  return {
    title: data.title || slug,
    description: data.description || "",
    html: renderMarkdown(content, {
      mediaBase: MEDIA_ROOT,
      rootMediaBase: MEDIA_ROOT,
    }),
  };
}

/* ------------------------------------------------------------------ */
/* Tags & recherche                                                    */
/* ------------------------------------------------------------------ */

/** Agrège les tags d'une liste d'entrées, triés par fréquence. */
export function collectTags(items) {
  const counts = new Map();
  for (const item of items) {
    for (const tag of item.tags || []) {
      counts.set(tag, (counts.get(tag) || 0) + 1);
    }
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => ({ name, slug: slugify(name), count }));
}

/** Voisins (précédent / suivant) d'un élément dans une liste ordonnée. */
export function adjacentInList(list, url) {
  const index = list.findIndex((item) => item.url === url);
  if (index === -1) return { prev: null, next: null };
  const pick = (item) => (item ? { title: item.title, url: item.url } : null);
  return { prev: pick(list[index - 1]), next: pick(list[index + 1]) };
}

function normalizeText(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

/** Recherche plein-texte simple sur tout le contenu. */
export function searchContent(query) {
  const terms = normalizeText(query).trim().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return [];

  const corpus = [
    ...listTexts().map((e) => ({ ...e, type: "text" })),
    ...listShorts().map((e) => ({ ...e, type: "short" })),
    ...listEssays().map((e) => ({ ...e, type: "essay" })),
    ...listExperiments().map((e) => ({ ...e, type: "experiment" })),
  ];

  const results = [];
  for (const item of corpus) {
    const haystack = normalizeText(
      `${item.title} ${(item.tags || []).join(" ")} ${item.excerpt || ""} ${
        item.description || ""
      }`,
    );
    if (terms.every((term) => haystack.includes(term))) {
      results.push({
        type: item.type,
        title: item.title,
        url: item.url,
        date: item.date,
        tags: item.tags || [],
        excerpt: item.excerpt || item.description || "",
        cover: item.cover || null,
      });
    }
  }

  return results.sort((a, b) => (a.date < b.date ? 1 : -1));
}
