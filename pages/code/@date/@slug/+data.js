import { useConfig } from "vike-react/useConfig";

import { adjacentInList, listCode } from "../../../../src/content/index.js";
import { countLikes } from "../../../../src/server/db.js";
import { getWebmentions } from "../../../../src/server/webmentions.js";

export async function data(pageContext) {
  const { date, slug } = pageContext.routeParams;
  const works = listCode({ withSource: true });
  const work = works.find((item) => item.date === date && item.slug === slug) || null;
  const { prev, next } = adjacentInList(works, work?.url);

  const config = useConfig();
  config({ title: work ? work.title : "Œuvre introuvable" });

  const webmentions = work ? await getWebmentions(`/code/${date}/${slug}`) : null;
  const likeCount = work ? countLikes(work.url) : 0;

  return {
    work,
    prev,
    next,
    sidebar: { kind: "actions", likeKey: work?.url, likeCount, webmentions },
  };
}
