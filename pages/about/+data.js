import { getPage } from "../../src/content/index.js";

export async function data() {
  return { page: getPage("about") };
}
