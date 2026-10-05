import { useConfig } from "vike-react/useConfig";

import { adjacentInList, listShorts } from "../../../../src/content/index.js";
import { countLikes } from "../../../../src/server/db.js";
import { getWebmentions } from "../../../../src/server/webmentions.js";

export async function data(pageContext) {
  const { date, slug } = pageContext.routeParams;
  const shorts = listShorts();
  const short = shorts.find((item) => item.date === date && item.slug === slug) || null;
  const { prev, next } = adjacentInList(shorts, short?.url);

  const config = useConfig();
  config({ title: short ? short.title : "Short introuvable" });

  const webmentions = short ? await getWebmentions(`/short/${date}/${slug}`) : null;
  const likeCount = short ? countLikes(short.url) : 0;
  const headerImage = short
    ? short.cover || (short.images && short.images[0]) || undefined
    : undefined;

  return {
    short,
    prev,
    next,
    headerImage,
    sidebar: { kind: "actions", likeKey: short?.url, likeCount, webmentions },
  };
}
