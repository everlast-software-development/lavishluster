import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Instant (never smooth) scroll handling: jump to the top when the page
 * changes, or to the #hash target when one is given — an element with that
 * id, or one that declares it in data-hash-targets (the product tabs answer
 * for their panels' hashes). Filter changes on the same page (query string
 * only) keep the scroll position.
 */
export default function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const id = decodeURIComponent(hash.slice(1));
      const el = document.getElementById(id) || [...document.querySelectorAll('[data-hash-targets]')].find((n) => n.dataset.hashTargets.split(' ').includes(id));
      if (el) { el.scrollIntoView({ block: 'start' }); return; }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}
