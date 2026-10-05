import { useData } from "vike-react/useData";

import { PostCard } from "../../../../components/PostCard.jsx";
import { ReaderNav } from "../../../../components/ReaderNav.jsx";

export default function Page() {
  const { essay, prev, next } = useData();

  if (!essay) {
    return (
      <>
        <h1 className="post-title">Essai introuvable</h1>
        <p className="post-content">Cet essai n’existe pas ou n’est pas encore publié.</p>
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
