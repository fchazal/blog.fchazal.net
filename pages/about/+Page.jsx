import { useData } from "vike-react/useData";

export default function Page() {
  const { page } = useData();

  return (
    <article>
      <h1 className="post-title">{page ? page.title : "À propos"}</h1>
      {page && (
        <div
          className="post-content article-prose"
          dangerouslySetInnerHTML={{ __html: page.html }}
        />
      )}
    </article>
  );
}
