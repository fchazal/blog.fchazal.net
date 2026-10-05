import { useConfig } from "vike-react/useConfig";

import { listPostsByTag } from "../../../src/content/index.js";

export async function data(pageContext) {
  const tag = pageContext.routeParams.tag;
  const posts = listPostsByTag(tag);

  const config = useConfig();
  config({ title: `Catégorie : ${tag}` });

  return { tag, posts };
}
