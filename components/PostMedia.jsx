/**
 * Première image d'un article, flottante à droite du texte.
 */
export function PostMedia({ image }) {
  if (!image) return null;

  return (
    <a className="float-right mb-2.5 ml-[18px] mt-1 leading-none" href={image}>
      <img
        className="block aspect-square h-[264px] w-[264px] max-w-none rounded-card object-cover max-sm:h-[150px] max-sm:w-[150px]"
        src={image}
        alt=""
        loading="lazy"
      />
    </a>
  );
}

/**
 * Carrousel horizontal des images suivantes, en fin d'article.
 */
export function PostMediaCarousel({ images }) {
  if (!images || images.length === 0) return null;

  return (
    <div className="clear-both mt-6">
      <div className="mx-auto flex w-fit max-w-full gap-2.5 overflow-x-auto px-0.5 py-1.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {images.map((src) => (
          <a key={src} className="flex-none leading-none" href={src}>
            <img
              className="block h-[120px] w-[120px] max-w-none rounded-lg object-cover max-sm:h-24 max-sm:w-24"
              src={src}
              alt=""
              loading="lazy"
            />
          </a>
        ))}
      </div>
    </div>
  );
}
