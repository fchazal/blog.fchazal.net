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
      className="tool-btn"
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
    <form method="get" action="/recherche" className="search-form">
      <input
        type="search"
        name="s"
        defaultValue={defaultValue}
        placeholder="Rechercher dans le carnet…"
        aria-label="Rechercher"
        className="search-field"
      />
      <button type="submit" className="search-button">
        <SearchIcon />
        <span className="sr-only">Rechercher</span>
      </button>
    </form>
  );
}
