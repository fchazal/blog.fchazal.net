import { useConfig } from "vike-react/useConfig";

import { adjacentInList, listDrawings } from "../../../../src/content/index.js";
import { countLikes } from "../../../../src/server/db.js";

export async function data(pageContext) {
  const { date, time } = pageContext.routeParams;
  const drawings = listDrawings();
  const drawing =
    drawings.find((item) => item.date === date && item.timeCompact === time) || null;
  const { prev, next } = adjacentInList(drawings, drawing?.url);

  const config = useConfig();
  config({ title: drawing ? `Dessin du ${drawing.date}` : "Dessin introuvable" });

  return {
    drawing,
    drawings,
    prev,
    next,
    likeCount: drawing ? countLikes(drawing.url) : 0,
    headerImage: drawing ? drawing.src : undefined,
  };
}
