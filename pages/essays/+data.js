import { collectTags, listEssays, listEssaysByTag } from "../../src/content/index.js";

export async function data(pageContext) {
  const tag = pageContext.urlParsed?.search?.tag || null;
  const all = listEssays();
  const items = tag ? listEssaysByTag(tag) : all;

  return {
    items,
    sidebar: { kind: "tags", tags: collectTags(all), basePath: "/essays", active: tag },
  };
}
