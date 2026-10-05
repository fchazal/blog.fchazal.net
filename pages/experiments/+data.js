import {
  collectTags,
  listExperiments,
  listExperimentsByTag,
} from "../../src/content/index.js";

export async function data(pageContext) {
  const tag = pageContext.urlParsed?.search?.tag || null;
  const all = listExperiments();
  const works = tag ? listExperimentsByTag(tag) : all;

  return {
    works,
    sidebar: {
      kind: "tags",
      tags: collectTags(all),
      basePath: "/experiments",
      active: tag,
    },
  };
}
