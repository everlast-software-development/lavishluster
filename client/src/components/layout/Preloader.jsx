import { useEffect, useState } from 'react';
import { getBrandImage } from '../../utils/assets.js';
import './Preloader.css';

// The original lavishluster.com preloader image (Lavish-luster-logo-08, 1582×292), kept as brand/preloader-logo.png.
const logo = getBrandImage('preloader-logo');

const REMOVE_AFTER = 1500;   // ms after the load: the original's script hides the veil then (its animation duration)
const MAX_WAIT = 6000;       // ms: start the exit even if the load event is held back (the original has no cap)

/**
 * The original site's page preloader (see Preloader.css). It is part of the prerendered HTML, so it covers the
 * page from the first paint. On `pageshow` (after the load) it starts fading; 1.5s later it unmounts.
 * Rendered once in App: a full load or browser refresh shows it, in-app navigation does not.
 * (The original also faded the veil back in on `beforeunload` before leaving a page; that is left out, since
 * a refresh replaces the page at once and some links fire `beforeunload` without leaving, e.g. mailto.)
 */
export default function Preloader() {
  const [phase, setPhase] = useState('shown');   // shown → leaving → gone

  useEffect(() => {
    let removeTimer;
    let started = false;
    const start = () => {
      if (started) return;
      started = true;
      setPhase('leaving');
      removeTimer = setTimeout(() => setPhase('gone'), REMOVE_AFTER);
    };
    if (document.readyState === 'complete') start();
    else window.addEventListener('pageshow', start, { once: true });
    const cap = setTimeout(start, Math.max(0, MAX_WAIT - performance.now()));
    return () => { window.removeEventListener('pageshow', start); clearTimeout(cap); clearTimeout(removeTimer); };
  }, []);

  if (phase === 'gone') return null;
  return (
    <div className={`preloader${phase === 'leaving' ? ' is-leaving' : ''}`} aria-hidden="true">
      <div className="preloader__image">
        <img src={logo} alt="" width="1582" height="292" decoding="async" />
      </div>
    </div>
  );
}
