import { useEffect, useState } from "react";

/** Boutons de partage (copie du lien + réseaux). */
export function ShareButtons() {
  const [url, setUrl] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setUrl(window.location.href);
  }, []);

  const title = typeof document !== "undefined" ? document.title : "";
  const enc = encodeURIComponent;
  const shareText = url ? `${title} ${url}` : title;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url || window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* presse-papiers indisponible */
    }
  }

  return (
    <div className="share">
      <h3 className="widget-title">Partager</h3>
      <div className="share-buttons">
        <button type="button" className="share-btn" onClick={copyLink}>
          {copied ? "Lien copié" : "Copier le lien"}
        </button>
        <a
          className="share-btn"
          href={`https://mastodon.social/share?text=${enc(shareText)}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Mastodon
        </a>
        <a
          className="share-btn"
          href={`https://bsky.app/intent/compose?text=${enc(shareText)}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Bluesky
        </a>
        <a
          className="share-btn"
          href={`https://twitter.com/intent/tweet?text=${enc(title)}&url=${enc(url)}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          X
        </a>
      </div>
    </div>
  );
}
