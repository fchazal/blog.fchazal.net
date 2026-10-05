import { DateBadge } from "./DateBadge.jsx";
import { PostMedia } from "./PostMedia.jsx";
import { slugify } from "../src/shared/slug.js";

/**
 * Carte d'article : titre + catégories + date (fiche calendrier) + contenu.
 * `afterContent` permet d'insérer un bloc (ex. Webmentions) dans la carte.
 */
export function PostCard({ entry, headingLevel = 2, afterContent = null, showTags = true }) {
  const Heading = headingLevel === 1 ? "h1" : "h2";

  return (
    <article className={`post h-entry${headingLevel === 1 ? " single" : ""}`}>
      <div className="post-inner">
        <div className="post-header">
          <Heading className="post-title p-name">
            <a className="u-url" href={entry.url}>
              {entry.title}
            </a>
          </Heading>

          <div className="post-meta">
            <p className="post-date">
              <a href={entry.url}>
                {entry.date}
              </a>
            </p>

            {showTags && entry.tags && entry.tags.length > 0 && (
              <p className="post-categories">
                <span>dans </span>
                {entry.tags.map((tag, index) => (
                  <span key={tag}>
                    <a href={`/tag/${slugify(tag)}`} rel="tag">
                      {tag}
                    </a>
                    {index < entry.tags.length - 1 ? ", " : ""}
                  </span>
                ))}
              </p>
            )}

            {/*
              <a href={entry.url}>
                <DateBadge date={entry.date} />
              </a>
            */}
          </div>

        </div>

        <div className="post-content entry-content e-content">
          <PostMedia images={entry.images} />
          <div className="post-text" dangerouslySetInnerHTML={{ __html: entry.html }} />
        </div>

        {afterContent}
      </div>
    </article>
  );
}
