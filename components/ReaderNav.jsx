function Chevron({ dir }) {
  const path = dir === "left" ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7";
  return (
    <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true" focusable="false">
      <path
        d={path}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Chevrons précédent / suivant, fixés sur les côtés (navigation de lecture). */
export function ReaderNav({ prev, next, prevLabel = "Précédent", nextLabel = "Suivant" }) {
  if (!prev && !next) return null;

  return (
    <>
      {prev ? (
        <a
          className="reader-nav reader-nav-prev"
          href={prev.url}
          title={`${prevLabel} : ${prev.title}`}
          aria-label={`${prevLabel} : ${prev.title}`}
        >
          <Chevron dir="left" />
        </a>
      ) : null}

      {next ? (
        <a
          className="reader-nav reader-nav-next"
          href={next.url}
          title={`${nextLabel} : ${next.title}`}
          aria-label={`${nextLabel} : ${next.title}`}
        >
          <Chevron dir="right" />
        </a>
      ) : null}
    </>
  );
}
