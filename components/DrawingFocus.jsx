import { LikeButton } from "./LikeButton.jsx";
import { ReaderNav } from "./ReaderNav.jsx";
import { formatDateFr } from "./format.js";

export function DrawingFocus({ drawing, drawings, prev, next, likeCount }) {
  if (!drawing) {
    return (
      <h1 className="m-0 font-display text-[2.4em] uppercase leading-none text-fg">
        Dessin introuvable
      </h1>
    );
  }

  return (
    <>
      <ReaderNav prev={prev} next={next} />

      <article>
        <div className="mb-5 flex gap-2.5 overflow-x-auto px-0.5 py-1.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {drawings.map((item) => (
            <a
              key={item.url}
              href={item.url}
              title={item.date}
              aria-current={item.url === drawing.url ? "true" : undefined}
              className="flex-none rounded-lg leading-none opacity-50 transition-[opacity,transform] duration-150 hover:scale-110 hover:opacity-100 aria-[current=true]:opacity-100 aria-[current=true]:shadow-[0_0_0_2px_var(--color-accent-link)]"
            >
              <img
                className="block h-[86px] w-[86px] rounded-lg bg-white object-contain p-1"
                src={item.src}
                alt=""
                loading="lazy"
              />
            </a>
          ))}
        </div>

        <div className="flex justify-center">
          <img
            className="max-h-[72vh] max-w-full rounded-card shadow-stage"
            src={drawing.src}
            alt=""
          />
        </div>

        <p className="mt-2 block text-center font-ui text-[0.68rem] font-black uppercase tracking-[1px] text-muted-2">
          {formatDateFr(drawing.date)}
        </p>

        <div className="mx-auto mt-6 max-w-[20rem]">
          <LikeButton likeKey={drawing.url} initialCount={likeCount} />
        </div>
      </article>
    </>
  );
}
