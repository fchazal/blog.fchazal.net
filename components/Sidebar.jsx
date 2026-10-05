import { LikeButton } from "./LikeButton.jsx";
import { ShareButtons } from "./ShareButtons.jsx";
import { Webmentions } from "./Webmentions.jsx";

function SidebarDrawings({ drawings }) {
  const items = drawings || [];
  if (items.length === 0) return null;
  return (
    <div className="sidebar-doodles">
      {items.map((drawing) => (
        <a key={drawing.url} href={drawing.url} title={drawing.date}>
          <img src={drawing.src} alt="" loading="lazy" />
        </a>
      ))}
    </div>
  );
}

function SidebarTags({ tags, basePath, active }) {
  return (
    <div className="widget_tags">
      <h3 className="widget-title">Catégories</h3>
      <div className="sidebar-tags">
        <a href={basePath} className={`tag-pill${!active ? " is-active" : ""}`}>
          Tout
        </a>
        {tags.map((tag) => (
          <a
            key={tag.slug}
            href={`${basePath}?tag=${tag.slug}`}
            className={`tag-pill${active === tag.slug ? " is-active" : ""}`}
          >
            {tag.name}&nbsp;<span>({tag.count})</span>
          </a>
        ))}
      </div>
    </div>
  );
}

function SidebarActions({ likeKey, likeCount, webmentions }) {
  return (
    <>
      <div>
        <h3 className="widget-title">Réagir</h3>
        <LikeButton likeKey={likeKey} initialCount={likeCount} />
        <ShareButtons />
      </div>
      <div style={{ marginTop: "2rem" }}>
        <Webmentions data={webmentions} />
      </div>
    </>
  );
}

/**
 * Bandeau latéral contextuel :
 * - accueil  -> dessins
 * - collection -> catégories
 * - publication -> réagir (like + partage) + commentaires
 */
export function Sidebar({ sidebar }) {
  if (!sidebar) return null;

  return (
    <aside className={`sidebar sidebar--${sidebar.kind}`}>
      {sidebar.kind === "drawings" && (
        <SidebarDrawings drawings={sidebar.drawings} />
      )}
      {sidebar.kind === "tags" && (
        <SidebarTags
          tags={sidebar.tags}
          basePath={sidebar.basePath}
          active={sidebar.active}
        />
      )}
      {sidebar.kind === "actions" && (
        <SidebarActions
          likeKey={sidebar.likeKey}
          likeCount={sidebar.likeCount}
          webmentions={sidebar.webmentions}
        />
      )}
    </aside>
  );
}
