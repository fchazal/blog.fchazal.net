import { useConfig } from "vike-react/useConfig";

import { adjacentInList, listEssays } from "../../../../src/content/index.js";
import { countLikes } from "../../../../src/server/db.js";
import { getWebmentions } from "../../../../src/server/webmentions.js";

export async function data(pageContext) {
  const { date, slug } = pageContext.routeParams;
  const essays = listEssays();
  const essay = essays.find((item) => item.date === date && item.slug === slug) || null;
  const { prev, next } = adjacentInList(essays, essay?.url);

  const config = useConfig();
  config({ title: essay ? essay.title : "Essai introuvable" });

  const webmentions = essay ? await getWebmentions(`/essay/${date}/${slug}`) : null;
  const likeCount = essay ? countLikes(essay.url) : 0;
  const headerImage = essay
    ? essay.cover || (essay.images && essay.images[0]) || undefined
    : undefined;

  return {
    essay,
    prev,
    next,
    headerImage,
    sidebar: { kind: "actions", likeKey: essay?.url, likeCount, webmentions },
  };
}
