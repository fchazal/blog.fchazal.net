import { useData } from "vike-react/useData";

import { FeedEnd } from "../../components/FeedStatus.jsx";
import { formatDateFr } from "../../components/format.js";

const TYPE_LABEL = {
  text: "Texte",
  short: "Brève",
  essay: "Essai",
  experiment: "Expérience",
};

export default function Page() {
  const { query, results } = useData();

  return (
    <div className="mx-auto max-w-[42rem]">
      {query ? (
        <p className="my-4 font-ui text-[0.74rem] font-bold uppercase tracking-[1px] text-muted-2">
          {results.length} résultat{results.length > 1 ? "s" : ""} pour «&nbsp;{query}&nbsp;»
        </p>
      ) : null}

      {results.length > 0 && (
        <ul className="m-0 list-none p-0">
          {results.map((result) => (
            <li
              className="border-b border-line-soft"
              key={`${result.type}-${result.url}`}
            >
              <a className="block py-4 no-underline" href={result.url}>
                <span className="mr-2 font-ui text-[0.62rem] font-black uppercase tracking-[1px] text-accent">
                  {TYPE_LABEL[result.type] || result.type}
                </span>
                <span className="font-display text-[1.3rem] text-fg">
                  {result.title}
                </span>
                <span className="mt-1 block font-ui text-[0.68rem] font-bold uppercase tracking-[1px] text-muted-2">
                  {formatDateFr(result.date)}
                  {result.tags && result.tags.length > 0
                    ? ` · ${result.tags.join(", ")}`
                    : ""}
                </span>
                {result.excerpt ? (
                  <span className="mt-1.5 block font-body text-fg-body">
                    {result.excerpt}
                  </span>
                ) : null}
              </a>
            </li>
          ))}
        </ul>
      )}

      {query && results.length === 0 && <FeedEnd>Aucun résultat.</FeedEnd>}
    </div>
  );
}
