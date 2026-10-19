import { useData } from "vike-react/useData";

import { PostCard } from "../../../../components/PostCard.jsx";
import { ReaderNav } from "../../../../components/ReaderNav.jsx";

export default function Page() {
  const { short, prev, next } = useData();

  if (!short) {
    return (
      <>
        <h1 className="post-title">Brève introuvable</h1>
        <p className="post-content">Cette brève n’existe pas ou n’est pas encore publiée.</p>
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
