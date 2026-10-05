const themeInit = `(function(){try{var t=localStorage.getItem('theme');if(t!=='dark'&&t!=='light'){t='light';}document.documentElement.setAttribute('data-theme',t);}catch(e){document.documentElement.setAttribute('data-theme','light');}})();`;

export function Head() {
  return (
    <>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/artboard.png" type="image/png" />
      <link
        rel="apple-touch-icon"
        href="/artboard.png"
      />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,wght@0,400;0,600;1,400;1,600&family=Lato:ital,wght@0,400;0,700;0,900;1,400&family=Petrona:ital,wght@0,300;0,500;1,300;1,500&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap"
      />
      <link
        rel="alternate"
        type="application/rss+xml"
        title="Suppléments d’âme & Bouts d’humanité"
        href="/feed.xml"
      />
      <link
        rel="webmention"
        href="https://webmention.io/blog.fchazal.net/webmention"
      />
      <script dangerouslySetInnerHTML={{ __html: themeInit }} />
    </>
  );
}
