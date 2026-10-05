import { collectTags, listTexts, listTextsByTag } from "../../src/content/index.js";

export async function data(pageContext) {
  const tag = pageContext.urlParsed?.search?.tag || null;
  const all = listTexts();
  const items = tag ? listTextsByTag(tag) : all;

  return {
    items,
    sidebar: { kind: "tags", tags: collectTags(all), basePath: "/texts", active: tag },
  };
}
