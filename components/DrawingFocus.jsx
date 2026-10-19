import { LikeButton } from "./LikeButton.jsx";
import { ReaderNav } from "./ReaderNav.jsx";
import { formatDateFr } from "./format.js";

export function DrawingFocus({ drawing, drawings, prev, next, likeCount }) {
  if (!drawing) {
    return <h1 className="post-title">Dessin introuvable</h1>;
  }

  return (
    <>
      <ReaderNav prev={prev} next={next} />

      <article className="drawing-focus">
        <div className="doodle-strip">
          {drawings.map((item) => (
            <a
              key={item.url}
              href={item.url}
              title={item.date}
              className={item.url === drawing.url ? "is-current" : ""}
            >
              <img src={item.src} alt="" loading="lazy" />
            </a>
          ))}
        </div>

        <div className="doodle-stage">
          <img src={drawing.src} alt="" />
        </div>

        <p className="doodle-caption" style={{ textAlign: "center" }}>
          {formatDateFr(drawing.date)}
        </p>

        <div className="doodle-actions">
          <LikeButton likeKey={drawing.url} initialCount={likeCount} />
        </div>
      </article>
    </>
  );
}
