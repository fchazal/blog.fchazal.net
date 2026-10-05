import { useData } from "vike-react/useData";

import { PostCard } from "../../../../components/PostCard.jsx";
import { ReaderNav } from "../../../../components/ReaderNav.jsx";

export default function Page() {
  const { short, prev, next } = useData();

  if (!short) {
    return (
      <>
        <h1 className="post-title">Short introuvable</h1>
        <p className="post-content">Ce short n’existe pas ou n’est pas encore publié.</p>
      </>
    );
  }

  return (
    <>
      <ReaderNav prev={prev} next={next} />
      <PostCard entry={short} headingLevel={1} />
    </>
  );
}
