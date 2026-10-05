import { listDrawings } from "../../src/content/index.js";

export async function data() {
  return { drawings: listDrawings() };
}
