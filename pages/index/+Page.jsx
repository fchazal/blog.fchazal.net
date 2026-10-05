import { useData } from "vike-react/useData";

import { PostFeed } from "../../components/PostFeed.jsx";

export default function Page() {
  const { posts } = useData();
  return <PostFeed items={posts} showTags={true} />;
}
