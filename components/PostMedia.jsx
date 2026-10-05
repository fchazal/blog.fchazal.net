/**
 * Images d'un article : vignette unique flottante, ou grille si plusieurs.
 */
export function PostMedia({ images }) {
  if (!images || images.length === 0) return null;

  if (images.length === 1) {
    return (
      <a className="post-thumb" href={images[0]}>
        <img src={images[0]} alt="" loading="lazy" />
      </a>
    );
  }

  return (
    <div className="post-thumb-grid">
      {images.map((src) => (
        <a key={src} href={src}>
          <img src={src} alt="" loading="lazy" />
        </a>
      ))}
    </div>
  );
}
