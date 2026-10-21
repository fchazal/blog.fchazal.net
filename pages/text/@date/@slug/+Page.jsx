import { useData } from "vike-react/useData";

import { PostCard } from "../../../../components/PostCard.jsx";
import { ReaderNav } from "../../../../components/ReaderNav.jsx";
import { BODY_TEXT, PAGE_TITLE } from "../../../../components/ui.js";

export default function Page() {
  const { text, prev, next } = useData();

  if (!text) {
    return (
      <>
        <h1 className={PAGE_TITLE}>Texte introuvable</h1>
        <p className={BODY_TEXT}>Ce texte n’existe pas ou n’est pas encore publié.</p>
      </>
    );
  }

  return (
    <>
      <ReaderNav prev={prev} next={next} />
      <PostCard entry={text} headingLevel={1} />
    </>
  );
}
