import { useEffect, useRef, useState } from "react";

import { usePageContext } from "vike-react/usePageContext";

import { ScrollProgress } from "../components/ScrollProgress.jsx";
import { SearchForm, SearchToggle } from "../components/Search.jsx";
import { Sidebar } from "../components/Sidebar.jsx";
import { ThemeToggle } from "../components/ThemeToggle.jsx";
import { Link } from "../components/Link.jsx";

import "./theme.css";
import "./styles.css";

const DESKTOP_NAV = [
  { href: "/posts", label: "Textes" },
  { href: "/essays", label: "Essais" },
  { href: "/code", label: "Code" },
  { href: "/about", label: "À propos" },
];

const MOBILE_NAV = [
  { href: "/posts", label: "Textes" },
  { href: "/essays", label: "Essais" },
  { href: "/doodles", label: "Dessins" },
  { href: "/code", label: "Code" },
  { href: "/about", label: "À propos" },
];

export default function Layout({ children }) {
  const pageContext = usePageContext();
  const data = pageContext.data || {};
  const headerImage = data.headerImage || "/site-header.jpg";
  const sidebar = data.sidebar || null;

  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [compact, setCompact] = useState(false);

  const topbarRef = useRef(null);
  const spacerRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 90);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const topbar = topbarRef.current;
    const spacer = spacerRef.current;
    if (!topbar || !spacer) return;
    const sync = () => {
      spacer.style.height = `${topbar.offsetHeight}px`;
    };
    sync();
    const observer = new ResizeObserver(sync);
    observer.observe(topbar);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="site">
      <ScrollProgress />

      <div ref={topbarRef} className={`topbar${compact ? " is-compact" : ""}`}>
        <div className="header-wrap">
          <header className="header">
            <div className="wrap">
              <h1 className="blog-title">
                <a href="/">
                  Suppléments d’âme
                  <img className="title-logo" src="/artboard.png" alt="&" />
                  Bouts d’humanité
                </a>
              </h1>
            </div>
          </header>

          <div className="header-tools">
            <SearchToggle open={searchOpen} onToggle={() => setSearchOpen((v) => !v)} />
            <ThemeToggle />
          </div>

          <button
            type="button"
            className="nav-toggle"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-label="Ouvrir le menu"
          >
            <span className="bar" />
            <span className="bar" />
            <span className="bar" />
          </button>
        </div>

        <nav className="navigation">
          <div className="wrap">
            {menuOpen && (
              <ul className="mobile-menu">
                {MOBILE_NAV.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href}>{item.label}</Link>
                  </li>
                ))}
              </ul>
            )}

            <ul className="main-menu">
              {DESKTOP_NAV.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {searchOpen && (
          <div className="top-search">
            <div className="wrap">
              <SearchForm />
            </div>
          </div>
        )}
      </div>

      {/*<div ref={spacerRef} className="topbar-spacer" />*/}

      <figure className="header-visual topbar-spacer">
        <img src={headerImage} alt="" />
        <span className="header-fade" aria-hidden="true" />
      </figure>

      <main>
        <div className="wrap" style={{ paddingTop: "3rem", paddingBottom: "3rem" }}>
          <div className="layout">
            <div className={`content${sidebar ? "" : " no-sidebar"}`}>{children}</div>
            {sidebar ? <Sidebar sidebar={sidebar} /> : null}
          </div>
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
