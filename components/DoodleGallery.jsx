import { formatDateFr } from "./format.js";

/** Galerie horizontale de dessins (page dédiée ou bandeau latéral). */
export function DoodleGallery({ doodles, variant = "page" }) {
  if (!doodles || doodles.length === 0) return null;

  const page = variant === "page";

  return (
    <div className="flex gap-3.5 overflow-x-auto pb-3 [scroll-snap-type:x_mandatory] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {doodles.map((doodle) => (
        <a
          className="block flex-none leading-none transition-[transform,box-shadow] duration-200 [scroll-snap-align:start] hover:z-[3] hover:scale-110 hover:shadow-doodle"
          key={doodle.url}
          href={doodle.url}
          title={doodle.date}
        >
          <img
            className={`block rounded-card object-cover ${
              page ? "h-[340px] w-[340px] max-sm:h-[240px] max-sm:w-[240px]" : ""
            }`}
            src={doodle.src}
            alt=""
            loading="lazy"
          />
          {page ? (
            <span className="mt-2 block font-ui text-[0.68rem] font-black uppercase tracking-[1px] text-muted-2">
              {formatDateFr(doodle.date)}
            </span>
          ) : null}
        </a>
      ))}
    </div>
  );
}
