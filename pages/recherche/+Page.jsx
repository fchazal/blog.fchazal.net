import { useData } from "vike-react/useData";

import { SearchForm } from "../../components/Search.jsx";
import { formatDateFr } from "../../components/format.js";

const TYPE_LABEL = {
  text: "Texte",
  short: "Short",
  essay: "Essai",
  experiment: "Expérience",
};

export default function Page() {
  const { query, results } = useData();

  return (
    <div className="search-page">
      <SearchForm defaultValue={query} />

      {query ? (
        <p className="search-count">
          {results.length} résultat{results.length > 1 ? "s" : ""} pour «&nbsp;{query}&nbsp;»
        </p>
      ) : null}

      {results.length > 0 && (
        <ul className="search-results">
          {results.map((result) => (
            <li key={`${result.type}-${result.url}`}>
              <a href={result.url}>
                <span className="result-type">{TYPE_LABEL[result.type] || result.type}</span>
                <span className="result-title">{result.title}</span>
                <span className="result-meta">
                  {formatDateFr(result.date)}
                  {result.tags && result.tags.length > 0
                    ? ` · ${result.tags.join(", ")}`
                    : ""}
                </span>
                {result.excerpt ? (
                  <span className="result-excerpt">{result.excerpt}</span>
                ) : null}
              </a>
            </li>
          ))}
        </ul>
      )}

      {query && results.length === 0 && <p className="feed-end">Aucun résultat.</p>}
    </div>
  );
}
