import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Instant (never smooth) scroll handling: jump to the top when the page
 * changes, or to the #hash target when one is given — an element with that
 * id, or one that declares it in data-hash-targets (the product tabs answer
 * for their panels' hashes). Filter changes on the same page (query string
 * only) keep the scroll position.
 * First render: a reload (F5, Ctrl+R, the refresh button) always starts at the top, even with a #hash
 * still in the address bar; any other arrival with a #hash (a deep link) goes to its target. Browser scroll
 * restoration is off (entry-client.jsx), so nothing puts the old position back afterwards.
 */
const isReload = () => performance.getEntriesByType?.('navigation')?.[0]?.type === 'reload';

export default function ScrollManager() {
  const { pathname, hash } = useLocation();
  const last = useRef(null);   // the location handled last (also keeps StrictMode's second effect run a no-op)
  useEffect(() => {
    const key = pathname + hash;
    if (last.current === key) return;
    const initial = last.current === null;
    last.current = key;
    if (initial && isReload()) { window.scrollTo(0, 0); return; }
    if (hash) {
      const id = decodeURIComponent(hash.slice(1));
      const el = document.getElementById(id) || [...document.querySelectorAll('[data-hash-targets]')].find((n) => n.dataset.hashTargets.split(' ').includes(id));
      if (el) { el.scrollIntoView({ block: 'start' }); return; }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}
