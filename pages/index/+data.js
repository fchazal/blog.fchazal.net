import { listDrawings, listTexts } from "../../src/content/index.js";

export async function data() {
  return {
    texts: listTexts(),
    sidebar: { kind: "drawings", drawings: listDrawings().slice(0, 20) },
  };
}
