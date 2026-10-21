import { useEffect, useRef, useState } from "react";

import { FeedEnd, FeedLoader } from "./FeedStatus.jsx";
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
    return <FeedEnd />;
  }

  return (
    <>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(230px,1fr))] gap-5 max-sm:px-5">
        {works.slice(0, visible).map((work, index) => (
          <a
            className="animate-reveal flex flex-col overflow-hidden rounded-card border border-line bg-surface no-underline shadow-card transition-[transform,box-shadow] duration-200 hover:-translate-y-[3px] hover:shadow-card-hover"
            key={work.url}
            href={work.url}
            style={{ animationDelay: `${Math.min(index, 8) * 40}ms` }}
          >
            {work.image ? (
              <img
                className="block h-[170px] w-full object-cover"
                src={work.image}
                alt=""
                loading="lazy"
              />
            ) : (
              <span
                className="flex h-[170px] items-center justify-center bg-[linear-gradient(135deg,#1c1a15_0%,#ba0d0d_130%)] font-display text-[3.4rem] text-[#f0eadc]"
                aria-hidden="true"
              >
                {work.title.slice(0, 1)}
              </span>
            )}
            <span className="flex flex-col gap-1 p-4">
              <span className="font-display text-[1.2rem] text-fg">{work.title}</span>
              <span className="font-ui text-[0.68rem] font-black uppercase tracking-[1px] text-muted-2">
                {formatDateFr(work.date)}
              </span>
              {work.excerpt ? (
                <span className="mt-1 font-body text-[0.95rem] text-fg-body">
                  {work.excerpt}
                </span>
              ) : null}
            </span>
          </a>
        ))}
      </div>

      {visible < works.length && <FeedLoader sentinelRef={sentinelRef} />}
    </>
  );
}
