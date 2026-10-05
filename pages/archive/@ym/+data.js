import { useConfig } from "vike-react/useConfig";

import { listPostsByMonth } from "../../../src/content/index.js";
import { formatMonthFr } from "../../../components/format.js";

export async function data(pageContext) {
  const ym = pageContext.routeParams.ym;
  const posts = listPostsByMonth(ym);

  const config = useConfig();
  config({ title: `Archives : ${formatMonthFr(ym)}` });

  return { ym, posts };
}
