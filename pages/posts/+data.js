import { collectTags, listPosts, listPostsByTag } from "../../src/content/index.js";

export async function data(pageContext) {
  const tag = pageContext.urlParsed?.search?.tag || null;
  const all = listPosts();
  const items = tag ? listPostsByTag(tag) : all;

  return {
    items,
    sidebar: { kind: "tags", tags: collectTags(all), basePath: "/posts", active: tag },
  };
}
