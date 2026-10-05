import { collectTags, listCode, listCodeByTag } from "../../src/content/index.js";

export async function data(pageContext) {
  const tag = pageContext.urlParsed?.search?.tag || null;
  const all = listCode();
  const works = tag ? listCodeByTag(tag) : all;

  return {
    works,
    sidebar: { kind: "tags", tags: collectTags(all), basePath: "/code", active: tag },
  };
}
