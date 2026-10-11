import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

const SCRIPT = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
let loader = null;

/** Loads the Turnstile script once, on demand (only pages that render the widget — the Contact form). */
function loadTurnstile() {
  if (typeof window === 'undefined') return Promise.reject(new Error('no window'));
  if (window.turnstile) return Promise.resolve(window.turnstile);
  if (!loader) {
    loader = new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = SCRIPT;
      s.async = true;
      s.defer = true;
      s.onload = () => (window.turnstile ? resolve(window.turnstile) : reject(new Error('turnstile missing')));
      s.onerror = () => { loader = null; reject(new Error('turnstile script failed')); };
      document.head.append(s);
    });
  }
  return loader;
}

/**
 * Cloudflare Turnstile widget (explicit render, light theme). Reports the token through `onToken`
 * (null when it expires or fails); `ref.current.reset()` clears it for the next submit.
 */
const Turnstile = forwardRef(function Turnstile({ siteKey, onToken, className = '' }, ref) {
  const box = useRef(null);
  const widget = useRef(null);
  const report = useRef(onToken);
  report.current = onToken;

  useImperativeHandle(ref, () => ({
    reset() {
      if (widget.current !== null) window.turnstile?.reset(widget.current);
      report.current(null);
    },
  }), []);

  useEffect(() => {
    if (!siteKey) return undefined;
    let cancelled = false;
    loadTurnstile()
      .then((ts) => {
        if (cancelled || !box.current) return;
        widget.current = ts.render(box.current, {
          sitekey: siteKey,
          theme: 'light',
          callback: (token) => report.current(token),
          'expired-callback': () => report.current(null),
          'error-callback': () => report.current(null),
        });
      })
      .catch(() => report.current(null));
    return () => {
      cancelled = true;
      if (widget.current !== null) window.turnstile?.remove(widget.current);
      widget.current = null;
    };
  }, [siteKey]);

  return <div ref={box} className={className} />;
});

export default Turnstile;
