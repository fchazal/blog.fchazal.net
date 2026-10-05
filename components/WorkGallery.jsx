import { useEffect, useRef, useState } from "react";

import { formatDateFr } from "./format.js";

/** Galerie d'œuvres p5.js (grille), avec chargement progressif. */
export function WorkGallery({ works, pageSize = 9 }) {
  const [visible, setVisible] = useState(pageSize);
  const sentinelRef = useRef(null);
  const visibleRef = useRef(visible);

  useEffect(() => {
    visibleRef.current = visible;
  }, [visible]);

  useEffect(() => {
    setVisible(pageSize);
  }, [works, pageSize]);

  useEffect(() => {
    const element = sentinelRef.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && visibleRef.current < works.length) {
          setVisible((value) => Math.min(value + pageSize, works.length));
        }
      },
      { rootMargin: "300px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [works.length, pageSize]);

  if (!works || works.length === 0) {
    return <p className="feed-end">Rien à afficher.</p>;
  }

  return (
    <>
      <div className="work-grid">
        {works.slice(0, visible).map((work, index) => (
          <a
            className="work-card reveal"
            key={work.url}
            href={work.url}
            style={{ animationDelay: `${Math.min(index, 8) * 40}ms` }}
          >
            {work.image ? (
              <img className="work-card-image" src={work.image} alt="" loading="lazy" />
            ) : (
              <span className="work-card-canvas" aria-hidden="true">
                {work.title.slice(0, 1)}
              </span>
            )}
            <span className="work-card-body">
              <span className="work-card-title">{work.title}</span>
              <span className="work-card-date">{formatDateFr(work.date)}</span>
              {work.excerpt ? (
                <span className="work-card-excerpt">{work.excerpt}</span>
              ) : null}
            </span>
          </a>
        ))}
      </div>

      {visible < works.length && (
        <div className="feed-loader" ref={sentinelRef}>
          <span className="spinner" />
          <span>Chargement…</span>
        </div>
      )}
    </>
  );
}
