import { useData } from "vike-react/useData";

import { PostCard } from "../../../components/PostCard.jsx";

export default function Page() {
  const { posts } = useData();

  return (
    <div className="posts" id="posts">
      {posts.map((post) => (
        <PostCard key={post.url} entry={post} />
      ))}
    </div>
  );
}
