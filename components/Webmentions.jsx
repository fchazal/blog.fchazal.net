import { formatDateFr } from "./format.js";

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
      className="wm-avatar"
      style={{ width: size, height: size }}
    />
  ) : (
    <span className="wm-avatar" style={{ width: size, height: size }}>
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
    <section className="webmentions">
      {reactions > 0 && (
        <div>
          <h3 className="widget-title">
            Réactions <span style={{ opacity: 0.6 }}>({reactions})</span>
          </h3>
          <ul className="wm-faces">
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
        <div style={{ marginTop: "2rem" }}>
          <h3 className="widget-title">Réponses ({replies.length})</h3>
          {replies.map((mention) => (
            <article className="wm-reply h-cite" key={mention["wm-id"] || mention.url}>
              <header className="wm-reply-header">
                <Avatar person={mention.author} size={40} />
                <div className="wm-reply-meta">
                  <a
                    className="p-author h-card"
                    href={mention.author?.url || mention.url}
                    rel="nofollow noopener noreferrer"
                  >
                    {authorName(mention)}
                  </a>
                  {mention.published && (
                    <time className="dt-published" dateTime={mention.published}>
                      {formatDateFr(mention.published.slice(0, 10))}
                    </time>
                  )}
                </div>
              </header>
              <div className="wm-reply-content e-content">{contentText(mention)}</div>
              <a
                className="wm-reply-source u-url"
                href={mention.url}
                rel="nofollow noopener noreferrer"
              >
                Voir la source
              </a>
            </article>
          ))}
        </div>
      )}

      <p className="wm-respond">
        Une réponse à publier ? Envoyez une <a href={endpoint}>webmention</a>.
      </p>
    </section>
  );
}
