import { useConfig } from "vike-react/useConfig";

import { listTextsByTag } from "../../../src/content/index.js";

export async function data(pageContext) {
  const tag = pageContext.routeParams.tag;
  const items = listTextsByTag(tag);

  const config = useConfig();
  config({ title: `Catégorie : ${tag}` });

  return { tag, items };
}
