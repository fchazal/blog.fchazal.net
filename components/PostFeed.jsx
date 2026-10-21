import { useEffect, useRef, useState } from "react";

import { PostCard } from "./PostCard.jsx";
import { FeedEnd, FeedLoader } from "./FeedStatus.jsx";

/** Flux d'articles/essais : chargement progressif + apparition latérale. */
export function PostFeed({ items, pageSize = 6, showTags = false, variant = "default" }) {
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
    return <FeedEnd />;
  }

  return (
    <>
      {items.slice(0, visible).map((item, index) => (
        <PostCard
          key={item.url}
          entry={item}
          showTags={showTags}
          variant={variant}
          className="animate-reveal"
          style={{ animationDelay: `${Math.min(index, 6) * 45}ms` }}
        />
      ))}

      {visible < items.length && <FeedLoader sentinelRef={sentinelRef} live />}
    </>
  );
}
