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

export function SearchForm({ defaultValue = "" }) {
  return (
    <form method="get" action="/recherche" className="relative">
      <input
        type="search"
        name="s"
        defaultValue={defaultValue}
        placeholder="Rechercher dans le carnet…"
        aria-label="Rechercher"
        className="w-full rounded-card border-0 bg-surface-2 px-4 py-4 pr-16 text-fg shadow-[0_0_5px_rgba(0,0,0,0.07)] outline-none"
      />
      <button
        type="submit"
        className="absolute inset-y-0 right-0 flex w-14 items-center justify-center border-l border-line bg-transparent text-fg"
      >
        <SearchIcon />
        <span className="sr-only">Rechercher</span>
      </button>
    </form>
  );
}
