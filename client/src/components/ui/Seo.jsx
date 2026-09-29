import { createContext, useContext, useEffect } from 'react';
import { buildMeta } from '../../utils/seo.js';

const HeadContext = createContext(null);
export const HeadProvider = HeadContext.Provider;

function setMeta(attr, key, value) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!value) { el?.remove(); return; }
  if (!el) { el = document.createElement('meta'); el.setAttribute(attr, key); document.head.appendChild(el); }
  el.setAttribute('content', value);
}

/**
 * Page metadata. During prerender the data is collected into the HTML head;
 * in the browser it updates the document head on navigation.
 */
export default function Seo(props) {
  const meta = buildMeta(props);
  const collector = useContext(HeadContext);
  if (collector) collector.data = meta;

  useEffect(() => {
    document.title = meta.title;
    setMeta('name', 'description', meta.description);
    setMeta('name', 'robots', meta.noindex ? 'noindex' : null);
    setMeta('property', 'og:title', meta.title);
    setMeta('property', 'og:description', meta.description);
    setMeta('property', 'og:url', meta.canonical);
    setMeta('property', 'og:type', meta.type);
    setMeta('property', 'og:image', meta.image);
    let link = document.head.querySelector('link[rel="canonical"]');
    if (!link) { link = document.createElement('link'); link.rel = 'canonical'; document.head.appendChild(link); }
    link.href = meta.canonical;
    document.head.querySelectorAll('script[type="application/ld+json"]').forEach((s) => s.remove());
    if (meta.jsonLd) {
      const s = document.createElement('script');
      s.type = 'application/ld+json';
      s.textContent = JSON.stringify(meta.jsonLd);
      document.head.appendChild(s);
    }
  }, [meta.title, meta.description, meta.canonical, meta.image, meta.type, meta.noindex, JSON.stringify(meta.jsonLd)]);

  return null;
}
