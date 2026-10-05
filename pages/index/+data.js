import { listDoodles, listPosts } from "../../src/content/index.js";

export async function data() {
  return {
    posts: listPosts(),
    sidebar: { kind: "doodles", doodles: listDoodles() },
  };
}
