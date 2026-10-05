import { formatDateFr } from "./format.js";

/** Galerie horizontale de dessins (page dédiée ou bandeau latéral). */
export function DoodleGallery({ doodles, variant = "page" }) {
  if (!doodles || doodles.length === 0) return null;

  const page = variant === "page";

  return (
    <div className={`doodle-scroller${page ? " doodle-page" : ""}`}>
      {doodles.map((doodle) => (
        <a className="doodle-item" key={doodle.url} href={doodle.url} title={doodle.date}>
          <img src={doodle.src} alt="" loading="lazy" />
          {page ? (
            <span className="doodle-caption">{formatDateFr(doodle.date)}</span>
          ) : null}
        </a>
      ))}
    </div>
  );
}
