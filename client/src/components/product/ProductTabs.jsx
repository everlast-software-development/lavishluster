import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;
const reducedMotion = () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
const pad = (n) => String(n).padStart(2, '0');

/**
 * Product detail tabs (WAI-ARIA tabs, manual activation): one tab per block the product has, one panel
 * shown at a time. Arrow keys / Home / End move focus between tabs (roving tabindex), Enter / Space
 * select. Hidden panels keep their content in the DOM (the `hidden` attribute), so every field is in the
 * prerendered HTML. The selected tab is mirrored in the URL hash (#ingredients); a hash on load or a
 * hash change selects its tab. Panels are id="panel-<block>" (not the hash itself), so the browser never
 * auto-focuses or scrolls to a panel on load — this component handles the hash. The panel area keeps the
 * height of the product's tallest panel, so switching never makes the page jump.
 */
export default function ProductTabs({ blocks, labelledBy }) {
  const [selected, setSelected] = useState(0);
  const [minHeight, setMinHeight] = useState(null);
  const tabs = useRef([]);
  const panels = useRef([]);
  const list = useRef(null);
  const ids = blocks.map((b) => b.id).join(' ');

  const select = useCallback((i, { updateHash = true } = {}) => {
    setSelected(i);
    if (updateHash) window.history.replaceState(window.history.state, '', `#${blocks[i].id}`);
  }, [ids]); // eslint-disable-line react-hooks/exhaustive-deps

  // A hash on load (or a later hash change) selects its tab. The bar declares those hashes
  // (data-hash-targets), so the shared ScrollManager brings it into view.
  useIsoLayoutEffect(() => {
    const fromHash = () => blocks.findIndex((b) => `#${b.id}` === window.location.hash);
    const first = fromHash();
    if (first >= 0) setSelected(first);
    const onHash = () => { const i = fromHash(); if (i >= 0) setSelected(i); };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, [ids]); // eslint-disable-line react-hooks/exhaustive-deps

  // The tallest panel sets the area's min-height: each hidden panel is shown for one synchronous read
  // (no paint in between). Re-measured on resize and once the web font has loaded.
  const measure = useCallback(() => {
    let max = 0;
    panels.current.forEach((p) => {
      if (!p) return;
      const wasHidden = p.hidden;
      p.hidden = false;
      max = Math.max(max, Math.ceil(p.getBoundingClientRect().height));   // fractional heights round up: never short
      p.hidden = wasHidden;
    });
    setMinHeight(max || null);
  }, []);
  useIsoLayoutEffect(() => {
    measure();
    window.addEventListener('resize', measure);
    document.fonts?.ready.then(measure);
    return () => window.removeEventListener('resize', measure);
  }, [ids, measure]);

  // On a narrow screen the selected tab scrolls into view inside the bar (never the page).
  useEffect(() => {
    const bar = list.current, tab = tabs.current[selected];
    if (!bar || !tab || bar.scrollWidth <= bar.clientWidth) return;
    bar.scrollTo({ left: tab.offsetLeft - (bar.clientWidth - tab.offsetWidth) / 2, behavior: reducedMotion() ? 'auto' : 'smooth' });
  }, [selected]);

  const onKeyDown = (e) => {
    const current = tabs.current.indexOf(document.activeElement);
    if (current < 0) return;
    const last = blocks.length - 1;
    const next = { ArrowRight: current === last ? 0 : current + 1, ArrowLeft: current === 0 ? last : current - 1, Home: 0, End: last }[e.key];
    if (next === undefined) return;
    e.preventDefault();
    tabs.current[next]?.focus();
  };

  return (
    <>
      <div className="pdp-tabs" data-hash-targets={ids}>
        <div ref={list} className="pdp-tabs__list" role="tablist" aria-labelledby={labelledBy} onKeyDown={onKeyDown}>
          {blocks.map((b, i) => (
            <button
              key={b.id}
              ref={(el) => { tabs.current[i] = el; }}
              type="button"
              role="tab"
              id={`tab-${b.id}`}
              className="pdp-tab"
              aria-selected={i === selected}
              aria-controls={`panel-${b.id}`}
              tabIndex={i === selected ? 0 : -1}
              onClick={() => select(i)}
            >
              {b.tab}
            </button>
          ))}
        </div>
      </div>
      <div className="pdp-panels" style={minHeight ? { minHeight } : undefined}>
        {blocks.map((b, i) => (
          <section
            key={b.id}
            ref={(el) => { panels.current[i] = el; }}
            id={`panel-${b.id}`}
            className="pdp-panel"
            role="tabpanel"
            aria-labelledby={`tab-${b.id}`}
            tabIndex={0}
            hidden={i !== selected}
          >
            <div className="pdp-panel__head">
              <p className="home-eyebrow pdp-panel__num">{pad(i + 1)}</p>
              <h2 className="pdp-panel__title">{b.title}</h2>
            </div>
            <div className="pdp-panel__body">{b.body}</div>
          </section>
        ))}
      </div>
    </>
  );
}
