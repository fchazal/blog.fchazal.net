import { useEffect, useState } from "react";

import { PILL, WIDGET_TITLE } from "./ui.js";

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
    <div className="mt-5">
      <h3 className={WIDGET_TITLE}>Partager</h3>
      <div className="flex flex-wrap gap-2">
        <button type="button" className={PILL} onClick={copyLink}>
          {copied ? "Lien copié" : "Copier le lien"}
        </button>
        <a
          className={PILL}
          href={`https://mastodon.social/share?text=${enc(shareText)}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Mastodon
        </a>
        <a
          className={PILL}
          href={`https://bsky.app/intent/compose?text=${enc(shareText)}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Bluesky
        </a>
        <a
          className={PILL}
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
