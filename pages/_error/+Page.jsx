import { usePageContext } from "vike-react/usePageContext";

export default function Page() {
  const { is404 } = usePageContext();
  return (
    <>
      <h1 className="post-title">
        {is404 ? "Page introuvable" : "Une erreur est survenue"}
      </h1>
      <p className="post-content">
        {is404
          ? "Cette page n’existe pas ou a été déplacée."
          : "Quelque chose s’est mal passé. Réessayez dans un instant."}
      </p>
    </>
  );
}
