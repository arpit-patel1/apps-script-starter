import {
  APPLE_TOUCH_ICON_HREF,
  FAVICON_HREF,
  ICON_192_HREF,
  ICON_CDN,
} from '@/lib/appIcons';

function addLink(rel: string, href: string, attrs: Record<string, string> = {}) {
  const link = document.createElement('link');
  link.rel = rel;
  link.href = href;
  Object.entries(attrs).forEach(([k, v]) => link.setAttribute(k, v));
  document.head.appendChild(link);
}

function upsertMeta(name: string, content: string) {
  let meta = document.head.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
  if (!meta) {
    meta = document.createElement('meta');
    meta.name = name;
    document.head.appendChild(meta);
  }
  meta.content = content;
}

/** Favicon, Apple touch icon, and web manifest for Add to Home Screen. */
export function installAppIcons() {
  upsertMeta('apple-mobile-web-app-capable', 'yes');
  upsertMeta('mobile-web-app-capable', 'yes');
  upsertMeta('apple-mobile-web-app-title', 'Playground');
  upsertMeta('apple-mobile-web-app-status-bar-style', 'black-translucent');
  upsertMeta('theme-color', '#1F6B56');
  upsertMeta('application-name', 'Playground');

  // CDN first (best for iOS Add to Home Screen), then embedded data-URI fallbacks.
  addLink('apple-touch-icon', ICON_CDN.apple, { sizes: '180x180' });
  addLink('apple-touch-icon', APPLE_TOUCH_ICON_HREF);
  addLink('icon', ICON_CDN.favicon, { type: 'image/png', sizes: '32x32' });
  addLink('icon', FAVICON_HREF, { type: 'image/png', sizes: '32x32' });
  addLink('icon', ICON_CDN.icon192, { type: 'image/png', sizes: '192x192' });
  addLink('icon', ICON_192_HREF, { type: 'image/png', sizes: '192x192' });

  const manifest = {
    name: 'Kids Homework Playground',
    short_name: 'Playground',
    description: 'Grades 3–5 homework practice',
    display: 'standalone',
    start_url: '.',
    background_color: '#0f1c18',
    theme_color: '#1F6B56',
    icons: [
      { src: ICON_CDN.icon192, sizes: '192x192', type: 'image/png', purpose: 'any maskable' },
      { src: ICON_CDN.icon512, sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
      { src: ICON_192_HREF, sizes: '192x192', type: 'image/png', purpose: 'any' },
    ],
  };

  const manifestHref =
    'data:application/manifest+json,' + encodeURIComponent(JSON.stringify(manifest));
  addLink('manifest', manifestHref);
}
