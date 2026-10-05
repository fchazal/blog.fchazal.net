import { collectTags, listShorts, listShortsByTag } from "../../src/content/index.js";

export async function data(pageContext) {
  const tag = pageContext.urlParsed?.search?.tag || null;
  const all = listShorts();
  const items = tag ? listShortsByTag(tag) : all;

  return {
    items,
    sidebar: { kind: "tags", tags: collectTags(all), basePath: "/shorts", active: tag },
  };
}
