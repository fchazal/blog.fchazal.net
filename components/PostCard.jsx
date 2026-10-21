import { PostMedia, PostMediaCarousel } from "./PostMedia.jsx";
import { formatDateFr } from "./format.js";
import { slugify } from "../src/shared/slug.js";

/**
 * Carte d'article : titre + catégories + date (fiche calendrier) + contenu.
 * `afterContent` permet d'insérer un bloc (ex. Webmentions) dans la carte.
 */
export function PostCard({
  entry,
  headingLevel = 2,
  afterContent = null,
  showTags = true,
  variant = "default",
}) {
  const Heading = headingLevel === 1 ? "h1" : "h2";
  const isShort = variant === "short";

  return (
    <article className="h-entry rounded-card bg-surface- shadow-card max-sm:rounded-none">
      <div className="p-[30px]">
        {!isShort && (
          <div>
            <Heading className="p-name m-0 font-display text-[2.4em] font-bold uppercase leading-none text-fg">
              <a
                className="u-url text-inherit no-underline hover:text-accent hover:no-underline"
                href={entry.url}
              >
                {entry.title}
              </a>
            </Heading>

            <div className="font-ui text-[0.68rem] font-bold uppercase tracking-[1px]">
              <p className="m-0 inline-block pr-[0.4em] text-muted">
                <a className="text-accent no-underline" href={entry.url}>
                  {entry.date}
                </a>
              </p>

              {showTags && entry.tags && entry.tags.length > 0 && (
                <p className="mb-0 mt-[0.6rem] inline-block text-muted-2">
                  <span className="text-muted"> dans </span>
                  {entry.tags.map((tag, index) => (
                    <span key={tag}>
                      <a
                        className="text-muted-2 no-underline hover:text-accent-link"
                        href={`/tag/${slugify(tag)}`}
                        rel="tag"
                      >
                        {tag}
                      </a>
                      {index < entry.tags.length - 1 ? ", " : ""}
                    </span>
                  ))}
                </p>
              )}
            </div>
          </div>
        )}

        <div
          className={`entry-content e-content flow-root ${isShort ? "mt-0" : "mt-5"}`}
        >
          <PostMedia image={entry.images && entry.images[0]} />
          <div dangerouslySetInnerHTML={{ __html: entry.html }} />
          <PostMediaCarousel
            images={entry.images ? entry.images.slice(1) : []}
          />
          {isShort && (
            <time
              className="mt-4 block text-right font-body text-[0.9rem] italic text-muted"
              dateTime={entry.date}
            >
              {formatDateFr(entry.date)}
            </time>
          )}
        </div>

        {afterContent}
      </div>
    </article>
  );
}
