import { LikeButton } from "./LikeButton.jsx";
import { ShareButtons } from "./ShareButtons.jsx";
import { Webmentions } from "./Webmentions.jsx";
import { PILL_ACTIVE, PILL_BASE, PILL_IDLE, WIDGET_TITLE } from "./ui.js";

function SidebarDrawings({ drawings }) {
  const items = drawings || [];
  if (items.length === 0) return null;
  return (
    <div className="grid grid-cols-2 gap-3 max-sm:grid-cols-3">
      {items.map((drawing) => (
        <a
          className="block rounded-card leading-none shadow-[0_0_4px_rgba(0,0,0,0.13)] transition-[transform,box-shadow] duration-200 hover:z-[3] hover:scale-110 hover:shadow-doodle"
          key={drawing.url}
          href={drawing.url}
          title={drawing.date}
        >
          <img
            className="aspect-square w-full rounded-card bg-white object-contain"
            src={drawing.src}
            alt=""
            loading="lazy"
          />
        </a>
      ))}
    </div>
  );
}

function SidebarTags({ tags, basePath, active }) {
  return (
    <div>
      <h3 className={WIDGET_TITLE}>Catégories</h3>
      <div className="flex flex-wrap gap-2">
        <a
          href={basePath}
          className={`${PILL_BASE} ${!active ? PILL_ACTIVE : PILL_IDLE}`}
        >
          Tout
        </a>
        {tags.map((tag) => (
          <a
            key={tag.slug}
            href={`${basePath}?tag=${tag.slug}`}
            className={`${PILL_BASE} ${
              active === tag.slug ? PILL_ACTIVE : PILL_IDLE
            }`}
          >
            {tag.name}&nbsp;<span className="font-extralight opacity-60">({tag.count})</span>
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
        <h3 className={WIDGET_TITLE}>Réagir</h3>
        <LikeButton likeKey={likeKey} initialCount={likeCount} />
        <ShareButtons />
      </div>
      <div className="mt-8">
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
    <aside className="w-full wide:w-sidebar">
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
