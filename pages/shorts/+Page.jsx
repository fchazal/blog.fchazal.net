import { useData } from "vike-react/useData";

import { PostFeed } from "../../components/PostFeed.jsx";

export default function Page() {
  const { items } = useData();
  return <PostFeed items={items} showTags={false} />;
}
