import { useConfig } from "vike-react/useConfig";

import { adjacentInList, listTexts } from "../../../../src/content/index.js";
import { countLikes } from "../../../../src/server/db.js";
import { getWebmentions } from "../../../../src/server/webmentions.js";

export async function data(pageContext) {
  const { date, slug } = pageContext.routeParams;
  const texts = listTexts();
  const text = texts.find((item) => item.date === date && item.slug === slug) || null;
  const { prev, next } = adjacentInList(texts, text?.url);

  const config = useConfig();
  config({ title: text ? text.title : "Texte introuvable" });

  const webmentions = text ? await getWebmentions(`/text/${date}/${slug}`) : null;
  const likeCount = text ? countLikes(text.url) : 0;
  const headerImage = text
    ? text.cover || (text.images && text.images[0]) || undefined
    : undefined;

  return {
    text,
    prev,
    next,
    headerImage,
    sidebar: { kind: "actions", likeKey: text?.url, likeCount, webmentions },
  };
}
