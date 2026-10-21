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

const READER_NAV =
  "fixed bottom-4 z-[90] flex h-11 w-11 items-center justify-center rounded-full border border-line bg-glass text-fg no-underline shadow-tool transition-colors hover:border-accent hover:bg-accent hover:text-on-dark wide:bottom-auto wide:top-1/2 wide:h-[52px] wide:w-[52px] wide:-translate-y-1/2";

/** Chevrons précédent / suivant, fixés sur les côtés (navigation de lecture). */
export function ReaderNav({ prev, next, prevLabel = "Précédent", nextLabel = "Suivant" }) {
  if (!prev && !next) return null;

  return (
    <>
      {prev ? (
        <a
          className={`${READER_NAV} left-3 wide:left-[18px]`}
          href={prev.url}
          title={`${prevLabel} : ${prev.title}`}
          aria-label={`${prevLabel} : ${prev.title}`}
        >
          <Chevron dir="left" />
        </a>
      ) : null}

      {next ? (
        <a
          className={`${READER_NAV} right-3 wide:right-[18px]`}
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
