import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Instant (never smooth) scroll handling: jump to the top when the page
 * changes, or to the #hash target when one is given. Filter changes on the
 * same page (query string only) keep the scroll position.
 */
export default function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (el) { el.scrollIntoView({ block: 'start' }); return; }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}
