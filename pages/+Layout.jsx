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

const NAV_LINK =
  "block whitespace-nowrap rounded-pill px-4 py-[0.55rem] font-ui text-[0.72rem] font-black uppercase tracking-[0.08em] text-fg no-underline transition-colors hover:bg-accent/10 hover:text-accent aria-[current=page]:bg-accent aria-[current=page]:text-white aria-[current=page]:shadow-[0_4px_12px_rgba(186,13,13,0.32)] max-sm:px-[0.8rem] max-sm:py-2 max-sm:text-[0.66rem]";

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
    <div className="flex min-h-screen flex-col">
      <ScrollProgress />
      <div
        ref={topbarRef}
        className={`fixed inset-x-0 top-0 z-[100] shadow-[0_1px_0px_#fff8] bg-gradient-to-b from-surface to-surface/70 transition-shadow backdrop-blur-[10px] duration-[250ms] ${
          compact ? "shadow-[0_4px_18px_rgba(0,0,0,0.13)]" : ""
        }`}
      >
        <div className="relative text-center">
          <header
            className={`transition-[padding] duration-[250ms] ${
              compact ? "p-4" : "p-6"
            }`}
          >
            <h1
              className={`m-0 text-center font-display font-extralight leading-none text-fg transition-[font-size] duration-[250ms] ${
                compact ? "text-[1.5em]" : "sm:text-[2.25em] text-[2em]"
              }`}
            >
              <a
                href="/"
                className="inline-flex flex-wrap items-center justify-center gap-[0.1em] text-fg no-underline hover:no-underline"
              >
                <span>Suppléments d’âme</span>
                <img
                  className="inline-block mx-[0.18em] h-[1.1em] w-auto rounded-full align-[-0.08em]"
                  src="/artboard.png"
                  alt="&"
                />
                <span>Bouts d’humanité</span>
              </a>
            </h1>
          </header>
        </div>
      </div>

      <div
        className={`isolate fixed right-2 top-2 z-500 flex gap-[2px] rounded-full p-[2px]  border border-line/70 bg-surface/[0.3] shadow-menu backdrop-blur-[16px] backdrop-saturate-[140%]  ${
          compact ? "flex-row-reverse" : "flex-col"
        }`}
      >
        <SearchToggle open={searchOpen} onToggle={() => setSearchOpen((v) => !v)} />
        <ThemeToggle />
      </div>

      <nav
        className="pointer-events-none fixed inset-x-0 top-[var(--topbar-height,216px)] z-[95] flex justify-center px-5 pt-4 transition-[top] duration-[250ms] motion-reduce:transition-none max-sm:px-3 max-sm:pt-3"
        aria-label="Types de publications"
      >
        <ul className="pointer-events-auto flex min-w-0 max-w-full list-none gap-1 overflow-x-auto overscroll-x-contain rounded-pill border border-line/60 bg-surface/[0.72] p-[0.15rem] shadow-menu backdrop-blur-[16px] backdrop-saturate-[140%] [-webkit-overflow-scrolling:touch] [scrollbar-width:none] max-sm:gap-[0.15rem] [&::-webkit-scrollbar]:hidden">
          {PAGE_TYPES.map((item) => (
            <li key={item.href} className="m-0 flex-none leading-none">
              <Link href={item.href} match={item.match} className={NAV_LINK}>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {hideHeaderVisual ? (
        <div className="h-[calc(var(--topbar-height,216px)+4.5rem)]" aria-hidden="true" />
      ) : (
        <figure className="relative m-0 h-[clamp(200px,25vw,400px)] w-full overflow-hidden">
          <img className="block h-full w-full object-cover" src={headerImage} alt="" />
          <span className="pointer-events-none absolute inset-0" aria-hidden="true" />
        </figure>
      )}

      <main className="relative z-[1] mx-auto w-full max-w-site flex-1 px-5 py-5 max-sm:p-0">

      {searchOpen && (
        <SearchForm />
      )}

        <div className="wide:flex wide:items-start wide:gap-10">
          <div
            className={`${sidebar ? "wide:w-content" : "w-full"} ${
              hideHeaderVisual ? "" : "wide:-mt-24"
            }`}
          >
            {children}
          </div>
          {sidebar ? <Sidebar sidebar={sidebar} /> : null}
        </div>
      </main>

      <footer className="border-t border-line bg-ink py-6 text-center">
        <div className="mx-auto w-full max-w-site px-5">
          <p className="mb-3 font-display text-sm italic text-white/70">
            fchazal, quondam incipio auctor ab MMVII
          </p>
          <p className="m-0 font-ui text-xs font-bold uppercase tracking-[1px] text-on-dark">
            <span>MMVII</span>
            <span className="mx-1.5 text-accent">/</span>
            <a className="text-inherit no-underline hover:text-accent" href="/feed.xml">
              Flux RSS
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
