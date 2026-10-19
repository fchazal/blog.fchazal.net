import { usePageContext } from "vike-react/usePageContext";

export function Link({ href, children, match }) {
  const { urlPathname } = usePageContext();
  const active = match
    ? match.some((prefix) => urlPathname.startsWith(prefix))
    : href === "/"
      ? urlPathname === "/"
      : urlPathname.startsWith(href);
  return (
    <a href={href} className={active ? "is-active" : undefined}>
      {children}
    </a>
  );
}
