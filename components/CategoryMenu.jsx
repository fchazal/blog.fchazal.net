import { useEffect, useRef, useState } from "react";

import { usePageContext } from "vike-react/usePageContext";

import { Link } from "./Link.jsx";

const TRIGGER =
  "inline-flex items-center justify-center gap-2 rounded-pill border px-4 py-2 font-ui text-[0.72rem] font-black uppercase tracking-[0.08em] shadow-menu backdrop-blur-[16px] backdrop-saturate-[140%] transition-colors max-sm:px-[0.8rem] max-sm:text-[0.66rem]";

const TRIGGER_ACTIVE =
  "border-accent bg-accent text-white hover:bg-accent hover:text-white";

const TRIGGER_IDLE =
  "border-line/60 bg-surface/[0.72] text-fg hover:border-accent hover:text-accent";

const ITEM =
  "block whitespace-nowrap rounded-pill px-4 py-2 text-left font-ui text-[0.72rem] font-black uppercase tracking-[0.08em] no-underline transition-colors";

const ITEM_ACTIVE = "bg-accent text-white hover:bg-accent hover:text-white";

const ITEM_IDLE = "text-fg hover:bg-accent/10 hover:text-accent";

function Chevron({ open }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="14"
      height="14"
      aria-hidden="true"
      focusable="false"
      className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
    >
      <path
        d="M6 9l6 6 6-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BurgerIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
      <g stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <line x1="4" y1="7" x2="20" y2="7" />
        <line x1="4" y1="12" x2="20" y2="12" />
        <line x1="4" y1="17" x2="20" y2="17" />
      </g>
    </svg>
  );
}

/** Menu de catégories replié en pill (mobile / header compact). */
export function CategoryMenu({ items, active, compact }) {
  const { urlPathname } = usePageContext();
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const closeTimer = useRef(null);
  const pointerType = useRef("mouse");

  const cancelClose = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  useEffect(() => () => clearTimeout(closeTimer.current), []);

  useEffect(() => {
    setOpen(false);
  }, [urlPathname, compact]);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 639px)");
    const onChange = () => setOpen(false);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event) => {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  function onPointerEnter(event) {
    if (event.pointerType !== "mouse") return;
    cancelClose();
    setOpen(true);
  }

  function onPointerLeave(event) {
    if (event.pointerType !== "mouse") return;
    cancelClose();
    closeTimer.current = setTimeout(() => setOpen(false), 140);
  }

  function onTriggerClick(event) {
    cancelClose();
    if (event.detail === 0 || pointerType.current !== "mouse") {
      setOpen((value) => !value);
      return;
    }
    setOpen(true);
  }

  return (
    <div
      ref={rootRef}
      className="relative"
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
    >
      <button
        ref={triggerRef}
        type="button"
        className={`${TRIGGER} ${active ? TRIGGER_ACTIVE : TRIGGER_IDLE}`}
        onPointerDown={(event) => {
          pointerType.current = event.pointerType || "mouse";
        }}
        onClick={onTriggerClick}
        aria-expanded={open}
        aria-controls="category-menu"
        aria-label={active ? `Menu des catégories — ${active.label}` : "Ouvrir le menu des catégories"}
      >
        {active ? (
          <>
            <span>{active.label}</span>
            <Chevron open={open} />
          </>
        ) : (
          <BurgerIcon />
        )}
      </button>

      <ul
        id="category-menu"
        aria-hidden={!open}
        inert={!open}
        className={`absolute left-0 top-full z-[96] mt-2 flex w-max origin-top list-none flex-col gap-1 rounded-[1.25rem] border border-line/60 bg-surface/[0.9] p-1 shadow-menu backdrop-blur-[16px] backdrop-saturate-[140%] transition-[opacity,transform] duration-200 ease-out ${
          open
            ? "visible translate-y-0 scale-y-100 opacity-100"
            : "invisible -translate-y-1 scale-y-95 opacity-0 pointer-events-none"
        }`}
      >
        {items.map((item) => (
          <li key={item.href} className="m-0" onClick={() => setOpen(false)}>
            <Link
              href={item.href}
              match={item.match}
              className={`${ITEM} ${active?.href === item.href ? ITEM_ACTIVE : ITEM_IDLE}`}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
