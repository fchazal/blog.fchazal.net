import { formatDateFr } from "./format.js";
import { WIDGET_TITLE } from "./ui.js";

const AVATAR =
  "inline-flex items-center justify-center rounded-full bg-surface-2 object-cover font-ui text-[11px] font-black text-muted";

function initials(name) {
  const value = (name || "?").trim();
  return value.slice(0, 2).toUpperCase();
}

function authorName(mention) {
  return mention.author?.name || mention.author?.nickname || "Quelqu’un";
}

function contentText(mention) {
  const content = mention.content;
  if (!content) return "";
  if (typeof content === "string") return content;
  return content.text || "";
}

function Avatar({ person, size = 32 }) {
  const name = person?.name || person?.nickname || "";
  const url = person?.url;

  const inner = person?.photo ? (
    <img
      src={person.photo}
      alt={name}
      width={size}
      height={size}
      loading="lazy"
      referrerPolicy="no-referrer"
      className={AVATAR}
      style={{ width: size, height: size }}
    />
  ) : (
    <span className={AVATAR} style={{ width: size, height: size }}>
      {initials(name)}
    </span>
  );

  return url ? (
    <a href={url} title={name} rel="nofollow noopener noreferrer">
      {inner}
    </a>
  ) : (
    inner
  );
}

/** Réactions (likes/reposts) + réponses reçues via Webmentions. */
export function Webmentions({ data }) {
  if (!data) return null;
  const { likes = [], reposts = [], replies = [], endpoint } = data;
  const faces = [...likes, ...reposts];
  const reactions = faces.length;

  return (
    <section>
      {reactions > 0 && (
        <div>
          <h3 className={WIDGET_TITLE}>
            Réactions <span className="opacity-60">({reactions})</span>
          </h3>
          <ul className="m-0 flex list-none flex-wrap gap-1 p-0">
            {faces.map((mention) => (
              <li
                key={mention["wm-id"] || mention.url}
                title={`${authorName(mention)}${
                  mention["wm-property"] === "repost-of" ? " · repartagé" : " · aime"
                }`}
              >
                <Avatar person={mention.author} />
              </li>
            ))}
          </ul>
        </div>
      )}

      {replies.length > 0 && (
        <div className="mt-8">
          <h3 className={WIDGET_TITLE}>Réponses ({replies.length})</h3>
          {replies.map((mention) => (
            <article
              className="h-cite border-b border-line-soft py-4 last:border-b-0"
              key={mention["wm-id"] || mention.url}
            >
              <header className="flex items-center gap-3">
                <Avatar person={mention.author} size={40} />
                <div className="flex flex-col">
                  <a
                    className="h-card p-author font-ui font-bold text-fg no-underline"
                    href={mention.author?.url || mention.url}
                    rel="nofollow noopener noreferrer"
                  >
                    {authorName(mention)}
                  </a>
                  {mention.published && (
                    <time
                      className="dt-published font-ui text-[0.72rem] uppercase tracking-[1px] text-muted-2"
                      dateTime={mention.published}
                    >
                      {formatDateFr(mention.published.slice(0, 10))}
                    </time>
                  )}
                </div>
              </header>
              <div className="e-content mt-2.5 whitespace-pre-line font-body text-base text-fg-body">
                {contentText(mention)}
              </div>
              <a
                className="u-url mt-2.5 inline-block font-ui text-[0.7rem] font-black uppercase tracking-[1px] text-accent-link no-underline"
                href={mention.url}
                rel="nofollow noopener noreferrer"
              >
                Voir la source
              </a>
            </article>
          ))}
        </div>
      )}

      <p className="mt-6 font-ui text-[0.72rem] uppercase tracking-[1px] text-muted-2">
        Une réponse à publier ? Envoyez une <a href={endpoint}>webmention</a>.
      </p>
    </section>
  );
}
