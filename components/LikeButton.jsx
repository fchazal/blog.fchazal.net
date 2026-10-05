import { useEffect, useState } from "react";

function HeartIcon({ filled }) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false">
      <path
        d="M12 20.5C6.5 16.6 3 13.2 3 9.4 3 6.7 5 4.8 7.5 4.8c1.7 0 3.2.9 4.5 2.6 1.3-1.7 2.8-2.6 4.5-2.6C19 4.8 21 6.7 21 9.4c0 3.8-3.5 7.2-9 11.1Z"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Bouton « J'aime » natif, compteur stocké en base (API /api/likes). */
export function LikeButton({ likeKey, initialCount = 0 }) {
  const [count, setCount] = useState(initialCount);
  const [liked, setLiked] = useState(false);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    try {
      setLiked(localStorage.getItem(`liked:${likeKey}`) === "1");
    } catch {
      /* stockage indisponible */
    }
  }, [likeKey]);

  async function like() {
    if (liked || pending) return;
    setPending(true);
    setCount((value) => value + 1);
    try {
      const response = await fetch("/api/likes", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ key: likeKey }),
      });
      if (!response.ok) throw new Error("échec");
      const data = await response.json();
      setCount(data.count);
      setLiked(true);
      try {
        localStorage.setItem(`liked:${likeKey}`, "1");
      } catch {
        /* stockage indisponible */
      }
    } catch {
      setCount((value) => Math.max(0, value - 1));
    } finally {
      setPending(false);
    }
  }

  return (
    <button
      type="button"
      className={`like-button${liked ? " is-liked" : ""}`}
      onClick={like}
      aria-pressed={liked}
      aria-label={liked ? "Vous aimez ce texte" : "Aimer ce texte"}
      disabled={liked || pending}
    >
      <HeartIcon filled={liked} />
      <span>{count}</span>
      <span>{liked ? "Aimé" : "J’aime"}</span>
    </button>
  );
}
