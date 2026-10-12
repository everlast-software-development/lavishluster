import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Instant (never smooth) scroll handling: jump to the top when the page
 * changes, or to the #hash target when one is given — an element with that
 * id, or one that declares it in data-hash-targets (the product tabs answer
 * for their panels' hashes). Filter changes on the same page (query string
 * only) keep the scroll position.
 * On the first render only a hash is handled: the prerendered page is already showing, so the visitor may
 * have scrolled before the app started (or the browser restored the position on a reload) — no jump back.
 */
export default function ScrollManager() {
  const { pathname, hash } = useLocation();
  const last = useRef(null);   // the location handled last (also keeps StrictMode's second effect run a no-op)
  useEffect(() => {
    const key = pathname + hash;
    if (last.current === key) return;
    const initial = last.current === null;
    last.current = key;
    if (hash) {
      const id = decodeURIComponent(hash.slice(1));
      const el = document.getElementById(id) || [...document.querySelectorAll('[data-hash-targets]')].find((n) => n.dataset.hashTargets.split(' ').includes(id));
      if (el) { el.scrollIntoView({ block: 'start' }); return; }
    }
    if (!initial) window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}
