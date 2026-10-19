import { useData } from "vike-react/useData";

import { PostFeed } from "../../components/PostFeed.jsx";

export default function Page() {
  const { texts } = useData();
  return <PostFeed items={texts} showTags={true} />;
}
