import { useData } from "vike-react/useData";

import { GLASS, PAGE_TITLE } from "../../components/ui.js";

export default function Page() {
  const { page } = useData();

  return (
    <article className={GLASS}>
      <h1 className={PAGE_TITLE}>{page ? page.title : "À propos"}</h1>
      {page && (
        <div
          className="article-prose mt-5"
          dangerouslySetInnerHTML={{ __html: page.html }}
        />
      )}
    </article>
  );
}
