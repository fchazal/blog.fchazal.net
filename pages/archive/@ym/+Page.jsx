import { useData } from "vike-react/useData";

import { PostCard } from "../../../components/PostCard.jsx";
import { POST_LIST } from "../../../components/ui.js";

export default function Page() {
  const { items } = useData();
  return (
    <div className={POST_LIST}>
      {items.map((item) => (
        <PostCard key={item.url} entry={item} />
      ))}
    </div>
  );
}
