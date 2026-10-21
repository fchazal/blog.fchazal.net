import { useEffect, useRef } from "react";

import { TOOL_BUTTON } from "./ui.js";

export function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
      <circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" strokeWidth="2" />
      <line x1="15.5" y1="15.5" x2="21" y2="21" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

export function SearchToggle({ open, onToggle }) {
  return (
    <button
      type="button"
      className={TOOL_BUTTON}
      onClick={onToggle}
      aria-expanded={open}
      aria-label={open ? "Fermer la recherche" : "Ouvrir la recherche"}
      title="Rechercher"
    >
      <SearchIcon />
    </button>
  );
}

/** Recherche plein écran façon Spotlight : panneau en verre, fond flouté. */
export function SearchOverlay({ onClose, defaultValue = "" }) {
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[500] flex items-center justify-center bg-white/40 px-4 backdrop-blur-3xl max-sm:px-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      role="presentation"
    >
      <form
        method="get"
        action="/search"
        role="dialog"
        aria-modal="true"
        aria-label="Rechercher dans le carnet"
        className="w-full max-w-xl overflow-hidden rounded-full border border-black/10 bg-white shadow-[0_24px_80px_rgba(0,0,0,0.28)]"
      >
        <div className="flex items-center gap-3 px-5">
          <span className="shrink-0 text-[#111]" aria-hidden="true">
            <SearchIcon />
          </span>
          <input
            ref={inputRef}
            type="search"
            name="s"
            defaultValue={defaultValue}
            placeholder="Rechercher dans le carnet…"
            aria-label="Rechercher"
            autoComplete="off"
            className="min-w-0 flex-1 border-0 bg-transparent py-5 text-lg text-[#111] outline-none placeholder:text-[#777]"
          />
          <button
            type="submit"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-on-dark transition-opacity hover:opacity-90"
          >
            <SearchIcon />
            <span className="sr-only">Rechercher</span>
          </button>
        </div>
      </form>
    </div>
  );
}
