import { usePageContext } from "vike-react/usePageContext";

export function Link({ href, children }) {
  const { urlPathname } = usePageContext();
  const active =
    href === "/" ? urlPathname === "/" : urlPathname.startsWith(href);
  return (
    <a href={href} className={active ? "is-active" : undefined}>
      {children}
    </a>
  );
}
