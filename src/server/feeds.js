import {
  listCode,
  listDoodles,
  listEssays,
  listPosts,
} from "../content/index.js";

export const SITE_TITLE = "Suppléments d’âme & Bouts d’humanité";
export const SITE_DESCRIPTION = "fchazal, quondam incipio auctor ab MMVII";

export function siteUrl() {
  return (process.env.SITE_URL || "http://localhost:3000").replace(/\/+$/, "");
}

export function xmlEscape(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function cdata(value) {
  return `<![CDATA[${String(value ?? "").replace(/]]>/g, "]]]]><![CDATA[>")}]]>`;
}

function absolute(path) {
  if (!path) return "";
  if (/^https?:\/\//.test(path)) return path;
  return `${siteUrl()}${path}`;
}

function itemDate(item) {
  if (item.type === "doodle" && item.publishedAt) {
    const date = new Date(item.publishedAt);
    if (!Number.isNaN(date.getTime())) return date;
  }
  return new Date(`${item.date}T00:00:00Z`);
}

function titleOf(item) {
  if (item.type === "doodle") return `Dessin du ${item.date}`;
  return item.title;
}

/** Construit la liste unifiée des publications (tous types). */
export function collectEntries(type = "all") {
  const items = [];

  const add = (kind, entry) => {
    items.push({
      type: kind,
      title: entry.title,
      url: entry.url,
      date: entry.date,
      publishedAt: entry.publishedAt,
      excerpt: entry.excerpt || entry.description || "",
      tags: entry.tags || [],
      images: entry.images && entry.images.length ? entry.images : entry.src ? [entry.src] : [],
      html: entry.html || "",
    });
  };

  if (type === "all" || type === "post") listPosts().forEach((e) => add("post", e));
  if (type === "all" || type === "essay") listEssays().forEach((e) => add("essay", e));
  if (type === "all" || type === "code") listCode().forEach((e) => add("code", e));
  if (type === "all" || type === "doodle") listDoodles().forEach((e) => add("doodle", e));

  return items.sort((a, b) => itemDate(b) - itemDate(a));
}

function itemContentHtml(item) {
  const images = item.images
    .map((src) => `<p><img src="${absolute(src)}" alt="" /></p>`)
    .join("");
  return `${images}${item.html}`;
}

/** Flux RSS 2.0. */
export function buildRss({
  type = "all",
  title = SITE_TITLE,
  description = SITE_DESCRIPTION,
  link = "/",
  selfPath = "/feed.xml",
} = {}) {
  const items = collectEntries(type);
  const lastBuild = items[0] ? itemDate(items[0]).toUTCString() : new Date().toUTCString();

  const body = items
    .map((item) => {
      const url = absolute(item.url);
      const date = itemDate(item).toUTCString();
      const categories = item.tags
        .map((tag) => `      <category>${xmlEscape(tag)}</category>`)
        .join("\n");

      return `    <item>
      <title>${xmlEscape(titleOf(item))}</title>
      <link>${xmlEscape(url)}</link>
      <guid isPermaLink="true">${xmlEscape(url)}</guid>
      <pubDate>${date}</pubDate>
${categories ? categories + "\n" : ""}      <description>${xmlEscape(item.excerpt)}</description>
      <content:encoded>${cdata(itemContentHtml(item))}</content:encoded>
    </item>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${xmlEscape(title)}</title>
    <link>${xmlEscape(absolute(link))}</link>
    <description>${xmlEscape(description)}</description>
    <language>fr</language>
    <lastBuildDate>${lastBuild}</lastBuildDate>
    <atom:link href="${xmlEscape(absolute(selfPath))}" rel="self" type="application/rss+xml" />
${body}
  </channel>
</rss>
`;
}

/** Flux JSON Feed 1.1. */
export function buildJsonFeed({
  type = "all",
  title = SITE_TITLE,
  description = SITE_DESCRIPTION,
  link = "/",
  selfPath = "/feed.json",
} = {}) {
  const items = collectEntries(type);
  return {
    version: "https://jsonfeed.org/version/1.1",
    title,
    home_page_url: absolute(link),
    feed_url: absolute(selfPath),
    description,
    language: "fr",
    items: items.map((item) => ({
      id: absolute(item.url),
      url: absolute(item.url),
      title: titleOf(item),
      date_published: itemDate(item).toISOString(),
      summary: item.excerpt,
      content_html: itemContentHtml(item).replace(
        /src="(\/media\/[^"]+)"/g,
        (_m, p) => `src="${absolute(p)}"`,
      ),
      tags: item.tags,
      image: item.images[0] ? absolute(item.images[0]) : undefined,
    })),
  };
}

/** Définition des flux servis par le serveur. */
export const FEED_DEFINITIONS = [
  { type: "all", rss: "/feed.xml", json: "/feed.json", title: SITE_TITLE, description: SITE_DESCRIPTION, link: "/" },
  { type: "post", rss: "/posts/feed.xml", json: "/posts/feed.json", title: `${SITE_TITLE} — Textes`, description: SITE_DESCRIPTION, link: "/posts" },
  { type: "essay", rss: "/essays/feed.xml", json: "/essays/feed.json", title: `${SITE_TITLE} — Essais`, description: SITE_DESCRIPTION, link: "/essays" },
  { type: "code", rss: "/code/feed.xml", json: "/code/feed.json", title: `${SITE_TITLE} — Code`, description: SITE_DESCRIPTION, link: "/code" },
  { type: "doodle", rss: "/doodles/feed.xml", json: "/doodles/feed.json", title: `${SITE_TITLE} — Dessins`, description: SITE_DESCRIPTION, link: "/doodles" },
];
