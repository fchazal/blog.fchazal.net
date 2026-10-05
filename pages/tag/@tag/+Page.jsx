import { useData } from "vike-react/useData";

import { PostCard } from "../../../components/PostCard.jsx";

export default function Page() {
  const { items } = useData();
  return (
    <div className="posts">
      {items.map((item) => (
        <PostCard key={item.url} entry={item} />
      ))}
    </div>
  );
}
