import { useConfig } from "vike-react/useConfig";

import { adjacentInList, listDrawings } from "../../src/content/index.js";
import { countLikes } from "../../src/server/db.js";

export async function data() {
  const drawings = listDrawings();
  const drawing = drawings[0] || null;
  const { prev, next } = adjacentInList(drawings, drawing?.url);

  const config = useConfig();
  config({ title: "Dessins" });

  return {
    drawing,
    drawings,
    prev,
    next,
    likeCount: drawing ? countLikes(drawing.url) : 0,
    hideHeaderVisual: true,
  };
}
