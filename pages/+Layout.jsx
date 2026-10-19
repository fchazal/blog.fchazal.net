import { useEffect, useRef, useState } from "react";

import { usePageContext } from "vike-react/usePageContext";

import { ScrollProgress } from "../components/ScrollProgress.jsx";
import { SearchForm, SearchToggle } from "../components/Search.jsx";
import { Sidebar } from "../components/Sidebar.jsx";
import { ThemeToggle } from "../components/ThemeToggle.jsx";
import { Link } from "../components/Link.jsx";

import "../style/index.css";

const PAGE_TYPES = [
  { href: "/texts", label: "Textes", match: ["/texts", "/text/"] },
  { href: "/shorts", label: "Brèves", match: ["/shorts", "/short/"] },
  { href: "/essays", label: "Essais", match: ["/essays", "/essay/"] },
  { href: "/experiments", label: "Expériences", match: ["/experiments", "/experiment/"] },
  { href: "/drawings", label: "Dessins", match: ["/drawings", "/drawing/"] },
//  { href: "/about", label: "À propos" },
];

export default function Layout({ children }) {
  const pageContext = usePageContext();
  const data = pageContext.data || {};
  const headerImage = data.headerImage || "/site-header.jpg";
  const hideHeaderVisual = data.hideHeaderVisual === true;
  const sidebar = data.sidebar || null;

  const [searchOpen, setSearchOpen] = useState(false);
  const [compact, setCompact] = useState(false);

  const topbarRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 90);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const topbar = topbarRef.current;
    if (!topbar) return;
    const root = document.documentElement;
    const sync = () => {
      root.style.setProperty("--topbar-height", `${topbar.offsetHeight}px`);
    };
    sync();
    const observer = new ResizeObserver(sync);
    observer.observe(topbar);
    return () => {
      observer.disconnect();
      root.style.removeProperty("--topbar-height");
    };
  }, []);

  return (
    <div className={`site${hideHeaderVisual ? " no-header-visual" : ""}`}>
      <ScrollProgress />

      <div ref={topbarRef} className={`topbar${compact ? " is-compact" : ""}`}>
        <div className="header-wrap">
          <div className="header-tools">
            <SearchToggle open={searchOpen} onToggle={() => setSearchOpen((v) => !v)} />
            <ThemeToggle />
          </div>

          <header className="header">
            <h1 className="blog-title">
              <a href="/">
                <span className="blog-title-text">Suppléments d’âme</span>
                <img className="title-logo" src="/artboard.png" alt="&" />
                <span className="blog-title-text">Bouts d’humanité</span>
              </a>
            </h1>
          </header>
        </div>

        {searchOpen && (
          <div className="top-search">
            <div className="wrap">
              <SearchForm />
            </div>
          </div>
        )}
      </div>

      <nav className="page-types-bar" aria-label="Types de publications">
        <ul className="page-types">
          {PAGE_TYPES.map((item) => (
            <li key={item.href}>
              <Link href={item.href} match={item.match}>{item.label}</Link>
            </li>
          ))}
        </ul>
      </nav>

      {hideHeaderVisual ? (
        <div className="header-spacer" aria-hidden="true" />
      ) : (
        <figure className="header-visual">
          <img src={headerImage} alt="" />
          <span className="header-fade" aria-hidden="true" />
        </figure>
      )}

      <main className="wrap main-wrap">
        <div className="layout">
          <div className={`content${sidebar ? "" : " no-sidebar"}`}>{children}</div>
          {sidebar ? <Sidebar sidebar={sidebar} /> : null}
        </div>
      </main>

      <footer className="credits">
        <div className="wrap">
          <p className="credits-tagline">fchazal, quondam incipio auctor ab MMVII</p>
          <p className="credits-line">
            <span>MMVII</span>
            <span className="sep">/</span>
            <a href="/feed.xml">Flux RSS</a>
          </p>
        </div>
      </footer>
    </div>
  );
}
