import { useConfig } from "vike-react/useConfig";

import { searchContent } from "../../src/content/index.js";

export async function data(pageContext) {
  const raw = pageContext.urlParsed?.search?.s;
  const query = (Array.isArray(raw) ? raw[0] : raw) || "";

  const config = useConfig();
  config({ title: query ? `Recherche : ${query}` : "Recherche" });

  return { query, results: searchContent(query) };
}
