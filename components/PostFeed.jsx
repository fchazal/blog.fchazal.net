import { useEffect, useRef, useState } from "react";

import { PostCard } from "./PostCard.jsx";

/** Flux d'articles/essais : chargement progressif + apparition latérale. */
export function PostFeed({ items, pageSize = 6, showTags = false }) {
  const [visible, setVisible] = useState(pageSize);
  const sentinelRef = useRef(null);
  const visibleRef = useRef(visible);

  useEffect(() => {
    visibleRef.current = visible;
  }, [visible]);

  useEffect(() => {
    setVisible(pageSize);
  }, [items, pageSize]);

  useEffect(() => {
    const element = sentinelRef.current;
    if (!element) return;
    let timer;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        if (visibleRef.current >= items.length) return;
        timer = setTimeout(() => {
          setVisible((value) => Math.min(value + pageSize, items.length));
        }, 260);
      },
      { rootMargin: "300px" },
    );
    observer.observe(element);
    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, [items.length, pageSize]);

  if (!items || items.length === 0) {
    return <p className="feed-end">Rien à afficher.</p>;
  }

  return (
    <>
      <div className="posts">
        {items.slice(0, visible).map((item, index) => (
          <div
            className="reveal"
            key={item.url}
            style={{ animationDelay: `${Math.min(index, 6) * 45}ms` }}
          >
            <PostCard entry={item} showTags={showTags} />
          </div>
        ))}
      </div>

      {visible < items.length && (
        <div className="feed-loader" ref={sentinelRef} aria-live="polite">
          <span className="spinner" />
          <span>Chargement…</span>
        </div>
      )}
    </>
  );
}
