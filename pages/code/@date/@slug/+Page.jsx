import { useData } from "vike-react/useData";

import { DateBadge } from "../../../../components/DateBadge.jsx";
import { ReaderNav } from "../../../../components/ReaderNav.jsx";

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
        <h1 className="post-title">Œuvre introuvable</h1>
        <p className="post-content">Cette œuvre n’existe pas ou n’est pas encore publiée.</p>
      </>
    );
  }

  return (
    <>
      <ReaderNav prev={prev} next={next} />
      <article className="post single">
        <div className="post-inner">
          <div className="post-header">
            <h1 className="post-title">
              <a href={work.url}>{work.title}</a>
            </h1>
            <div className="post-meta">
              <p className="post-date">
                <a href={work.url}>
                  <DateBadge date={work.date} />
                </a>
              </p>
            </div>
          </div>

          <div className="post-content entry-content">
            <div className="work-frame">
              <iframe
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
        </div>
      </article>
    </>
  );
}
