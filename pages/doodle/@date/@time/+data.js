import { useConfig } from "vike-react/useConfig";

import { adjacentInList, listDoodles } from "../../../../src/content/index.js";
import { countLikes } from "../../../../src/server/db.js";

export async function data(pageContext) {
  const { date, time } = pageContext.routeParams;
  const doodles = listDoodles();
  const doodle = doodles.find((item) => item.date === date && item.timeCompact === time) || null;
  const { prev, next } = adjacentInList(doodles, doodle?.url);

  const config = useConfig();
  config({ title: doodle ? `Dessin du ${doodle.date}` : "Dessin introuvable" });

  return {
    doodle,
    doodles,
    prev,
    next,
    likeCount: doodle ? countLikes(doodle.url) : 0,
    headerImage: doodle ? doodle.src : undefined,
  };
}
