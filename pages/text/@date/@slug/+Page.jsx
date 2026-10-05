import { useData } from "vike-react/useData";

import { PostCard } from "../../../../components/PostCard.jsx";
import { ReaderNav } from "../../../../components/ReaderNav.jsx";

export default function Page() {
  const { text, prev, next } = useData();

  if (!text) {
    return (
      <>
        <h1 className="post-title">Texte introuvable</h1>
        <p className="post-content">Ce texte n’existe pas ou n’est pas encore publié.</p>
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
