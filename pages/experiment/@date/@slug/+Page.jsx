import { useData } from "vike-react/useData";

import { DateBadge } from "../../../../components/DateBadge.jsx";
import { ReaderNav } from "../../../../components/ReaderNav.jsx";
import { BODY_TEXT, CARD, PAGE_TITLE } from "../../../../components/ui.js";

function buildViewer(source) {
  const p5 = "https://cdn.jsdelivr.net/npm/p5@1.11.1/lib/p5.min.js";
  return [
    "<!doctype html><html lang='fr'><head><meta charset='utf-8'/>",
    "<style>html,body{margin:0;height:100%;background:#0d0d10;overflow:hidden}canvas{display:block}</style>",
    `<script src="${p5}"></scr` + `ipt></head>`,
    `<body><script>${source || ""}</scr` + `ipt></body></html>`,
  ].join("");
}

export default function Page() {
  const { work, prev, next } = useData();

  if (!work) {
    return (
      <>
        <h1 className={PAGE_TITLE}>Expérience introuvable</h1>
        <p className={BODY_TEXT}>
          Cette expérience n’existe pas ou n’est pas encore publiée.
        </p>
      </>
    );
  }

  return (
    <>
      <ReaderNav prev={prev} next={next} />
      <article className={`${CARD} p-[30px]`}>
        <h1 className="m-0 font-display text-[2.4em] font-bold uppercase leading-none text-fg">
          <a
            className="text-inherit no-underline hover:text-accent hover:no-underline"
            href={work.url}
          >
            {work.title}
          </a>
        </h1>
        <div className="mt-2 border-t border-line pt-2 font-ui text-[0.68rem] font-bold uppercase tracking-[1px]">
          <p className="m-0 inline-block pr-[0.4em] text-muted">
            <a className="no-underline" href={work.url}>
              <DateBadge date={work.date} />
            </a>
          </p>
        </div>

        <div className="entry-content mt-5">
          <div className="relative mb-5 aspect-square w-full overflow-hidden rounded-card bg-[#0d0d10]">
            <iframe
              className="block h-full w-full border-0"
              title={work.title}
              srcDoc={buildViewer(work.source)}
              sandbox="allow-scripts"
              loading="lazy"
            />
          </div>
          <div dangerouslySetInnerHTML={{ __html: work.html }} />
          {work.sketchUrl && (
            <p>
              <a href={work.sketchUrl}>Voir le code source</a>
            </p>
          )}
        </div>
      </article>
    </>
  );
}
