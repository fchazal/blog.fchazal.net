import { useData } from "vike-react/useData";

import { PostCard } from "../../../../components/PostCard.jsx";
import { ReaderNav } from "../../../../components/ReaderNav.jsx";
import { BODY_TEXT, PAGE_TITLE } from "../../../../components/ui.js";

export default function Page() {
  const { essay, prev, next } = useData();

  if (!essay) {
    return (
      <>
        <h1 className={PAGE_TITLE}>Essai introuvable</h1>
        <p className={BODY_TEXT}>Cet essai n’existe pas ou n’est pas encore publié.</p>
      </>
    );
  }

  return (
    <>
      <ReaderNav prev={prev} next={next} />
      <PostCard entry={essay} headingLevel={1} />
    </>
  );
}
