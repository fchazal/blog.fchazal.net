import { useEffect, useState } from "react";

/** Barre de progression de lecture, fixée sur le bord droit. */
export function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const root = document.documentElement;
      const max = root.scrollHeight - root.clientHeight;
      setProgress(max > 0 ? Math.min(1, root.scrollTop / max) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed right-0 top-0 z-[200] h-screen w-[3px]" aria-hidden="true">
      <span
        className="block h-full w-full origin-top bg-accent"
        style={{ transform: `scaleY(${progress})` }}
      />
    </div>
  );
}
