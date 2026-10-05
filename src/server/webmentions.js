const CACHE_TTL = 10 * 60 * 1000;
const cache = new Map();

/** Configuration depuis l'environnement. */
export function webmentionConfig() {
  const siteUrl = (process.env.SITE_URL || "http://localhost:3000").replace(/\/+$/, "");
  const token = process.env.WEBMENTION_IO_TOKEN || "";
  let host = "localhost";
  try {
    host = new URL(siteUrl).host;
  } catch {
    /* ignore */
  }
  return {
    siteUrl,
    token,
    endpoint: `https://webmention.io/${host}/webmention`,
  };
}

function categorize(children) {
  const likes = [];
  const reposts = [];
  const replies = [];
  const mentions = [];

  for (const item of children) {
    const property = String(item["wm-property"] || "").toLowerCase();
    if (property === "like-of") likes.push(item);
    else if (property === "repost-of") reposts.push(item);
    else if (property === "in-reply-to") replies.push(item);
    else mentions.push(item);
  }

  return { likes, reposts, replies, mentions, total: children.length };
}

/**
 * Récupère les Webmentions reçues pour une URL du site.
 * Lecture publique de webmention.io ; silencieux en cas d'échec.
 * @param {string} pathname chemin de la page (ex: `/post/2026-05-04/a-nouveau`)
 */
export async function getWebmentions(pathname) {
  const { siteUrl, token } = webmentionConfig();
  const target = `${siteUrl}${pathname}`;
  const now = Date.now();
  const cached = cache.get(target);
  if (cached && now - cached.at < CACHE_TTL) {
    return { ...cached.data, endpoint: webmentionConfig().endpoint };
  }

  const url = new URL("https://webmention.io/api/mentions.jf2");
  url.searchParams.set("target", target);
  if (token) url.searchParams.set("token", token);

  let children = [];
  try {
    const res = await fetch(url, {
      headers: { accept: "application/json" },
      signal: AbortSignal.timeout(8000),
    });
    if (res.ok) {
      const json = await res.json();
      children = Array.isArray(json.children) ? json.children : [];
    }
  } catch {
    children = [];
  }

  const data = categorize(children);
  cache.set(target, { at: now, data });
  return { ...data, endpoint: webmentionConfig().endpoint };
}
