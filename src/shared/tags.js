import { slugify } from "./slug.js";

/** Agrège les tags d'une liste d'entrées (client-safe). */
export function collectTags(items) {
  const counts = new Map();
  for (const item of items || []) {
    for (const tag of item.tags || []) {
      counts.set(tag, (counts.get(tag) || 0) + 1);
    }
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => ({ name, slug: slugify(name), count }));
}
