import { useConfig } from "vike-react/useConfig";

import { adjacentInList, listPosts } from "../../../../src/content/index.js";
import { countLikes } from "../../../../src/server/db.js";
import { getWebmentions } from "../../../../src/server/webmentions.js";

export async function data(pageContext) {
  const { date, slug } = pageContext.routeParams;
  const posts = listPosts();
  const post = posts.find((item) => item.date === date && item.slug === slug) || null;
  const { prev, next } = adjacentInList(posts, post?.url);

  const config = useConfig();
  config({ title: post ? post.title : "Texte introuvable" });

  const webmentions = post ? await getWebmentions(`/post/${date}/${slug}`) : null;
  const likeCount = post ? countLikes(post.url) : 0;
  const headerImage = post
    ? post.cover || (post.images && post.images[0]) || undefined
    : undefined;

  return {
    post,
    prev,
    next,
    headerImage,
    sidebar: { kind: "actions", likeKey: post?.url, likeCount, webmentions },
  };
}
