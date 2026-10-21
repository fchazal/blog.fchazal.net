export function FeedEnd({ children = "Rien à afficher." }) {
  return (
    <p className="my-8 text-center font-ui text-[0.72rem] uppercase tracking-[1px] text-muted-2">
      {children}
    </p>
  );
}

export function FeedLoader({ sentinelRef, live = false }) {
  return (
    <div
      className="flex items-center justify-center gap-[0.6rem] py-10 font-ui text-[0.72rem] font-bold uppercase tracking-[1px] text-muted-2"
      ref={sentinelRef}
      aria-live={live ? "polite" : undefined}
    >
      <span className="inline-block h-[18px] w-[18px] animate-spin rounded-full border-2 border-line border-t-accent" />
      <span>Chargement…</span>
    </div>
  );
}
