import { useData } from "vike-react/useData";

import { PostCard } from "../../../../components/PostCard.jsx";
import { ReaderNav } from "../../../../components/ReaderNav.jsx";
import { BODY_TEXT, PAGE_TITLE } from "../../../../components/ui.js";

export default function Page() {
  const { short, prev, next } = useData();

  if (!short) {
    return (
      <>
        <h1 className={PAGE_TITLE}>Brève introuvable</h1>
        <p className={BODY_TEXT}>Cette brève n’existe pas ou n’est pas encore publiée.</p>
      </>
    );
  }

  return (
    <>
      <ReaderNav prev={prev} next={next} />
      <PostCard entry={short} headingLevel={1} variant="short" />
    </>
  );
}
