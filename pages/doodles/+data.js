import { listDoodles } from "../../src/content/index.js";

export async function data() {
  return { doodles: listDoodles() };
}
