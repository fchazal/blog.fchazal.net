import { usePageContext } from "vike-react/usePageContext";

import { BODY_TEXT, PAGE_TITLE } from "../../components/ui.js";

export default function Page() {
  const { is404 } = usePageContext();
  return (
    <>
      <h1 className={PAGE_TITLE}>
        {is404 ? "Page introuvable" : "Une erreur est survenue"}
      </h1>
      <p className={BODY_TEXT}>
        {is404
          ? "Cette page n’existe pas ou a été déplacée."
          : "Quelque chose s’est mal passé. Réessayez dans un instant."}
      </p>
    </>
  );
}
