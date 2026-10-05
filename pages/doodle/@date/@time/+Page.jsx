import { useData } from "vike-react/useData";

import { LikeButton } from "../../../../components/LikeButton.jsx";
import { ReaderNav } from "../../../../components/ReaderNav.jsx";
import { formatDateFr } from "../../../../components/format.js";

export default function Page() {
  const { doodle, doodles, prev, next, likeCount } = useData();

  if (!doodle) {
    return <h1 className="post-title">Dessin introuvable</h1>;
  }

  return (
    <>
      <ReaderNav prev={prev} next={next} />

      <article>
        <div className="doodle-stage">
          <img src={doodle.src} alt="" />
        </div>

        <p className="doodle-caption" style={{ textAlign: "center" }}>
          {formatDateFr(doodle.date)} · {doodle.time}
        </p>

        <div className="doodle-strip">
          {doodles.map((item) => (
            <a
              key={item.url}
              href={item.url}
              title={item.date}
              className={item.url === doodle.url ? "is-current" : ""}
            >
              <img src={item.src} alt="" loading="lazy" />
            </a>
          ))}
        </div>

        <div className="doodle-actions">
          <LikeButton likeKey={doodle.url} initialCount={likeCount} />
        </div>
      </article>
    </>
  );
}
