import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useCompact } from '../ui/nb.jsx';

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
 * Below 1024px (compact): the bar is sticky (Product.css); the panel area takes each panel's own height and
 * animates between them (not under reduced motion); a bar that is stuck stays in place and the new panel is
 * shown from its start. Edge fades mark tabs scrolled out of view.
 */
export default function ProductTabs({ blocks, labelledBy }) {
  const [selected, setSelected] = useState(0);
  const [minHeight, setMinHeight] = useState(null);
  const tabs = useRef([]);
  const panels = useRef([]);
  const list = useRef(null);
  const bar = useRef(null);
  const area = useRef(null);
  const pending = useRef(null);
  const compact = useCompact();
  const ids = blocks.map((b) => b.id).join(' ');

  const select = useCallback((i, { updateHash = true } = {}) => {
    if (compact && area.current && bar.current) {
      const header = document.querySelector('.site-header')?.getBoundingClientRect().height || 0;
      pending.current = { h0: area.current.getBoundingClientRect().height, stuck: bar.current.getBoundingClientRect().top <= header + 0.5 };
    }
    setSelected(i);
    if (updateHash) window.history.replaceState(window.history.state, '', `#${blocks[i].id}`);
  }, [ids, compact]); // eslint-disable-line react-hooks/exhaustive-deps

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
    if (compact) { setMinHeight(null); return; }   // phones/tablets: each panel's own height (animated below)
    let max = 0;
    panels.current.forEach((p) => {
      if (!p) return;
      const wasHidden = p.hidden;
      p.hidden = false;
      max = Math.max(max, Math.ceil(p.getBoundingClientRect().height));   // fractional heights round up: never short
      p.hidden = wasHidden;
    });
    setMinHeight(max || null);
  }, [compact]);
  useIsoLayoutEffect(() => {
    measure();
    window.addEventListener('resize', measure);
    document.fonts?.ready.then(measure);
    return () => window.removeEventListener('resize', measure);
  }, [ids, measure]);

  // Compact: after a switch, keep a stuck bar in place (the new panel shown from its start) and animate the
  // area from the old panel's height to the new one's.
  useIsoLayoutEffect(() => {
    const p = pending.current; const el = area.current;
    pending.current = null;
    if (!p || !el) return;
    if (p.stuck && bar.current) {
      const top = window.scrollY + el.getBoundingClientRect().top - bar.current.getBoundingClientRect().bottom - 24;
      window.scrollTo({ top, behavior: 'instant' });
    }
    const h1 = el.getBoundingClientRect().height;
    if (reducedMotion() || Math.abs(h1 - p.h0) < 2) return;
    el.style.height = `${p.h0}px`;
    el.classList.add('is-resizing');
    el.getBoundingClientRect();   // apply the start height before the transition
    el.style.height = `${h1}px`;
    const done = () => { el.style.height = ''; el.classList.remove('is-resizing'); el.removeEventListener('transitionend', done); };
    el.addEventListener('transitionend', done);
    setTimeout(done, 450);
  }, [selected]);

  // Edge fades on the bar: where tabs are scrolled out of view (only when the bar overflows).
  useEffect(() => {
    const el = list.current; if (!el) return undefined;
    const update = () => {
      const more = el.scrollWidth > el.clientWidth + 1;
      el.classList.toggle('has-more-start', more && el.scrollLeft > 2);
      el.classList.toggle('has-more-end', more && el.scrollLeft < el.scrollWidth - el.clientWidth - 2);
    };
    update();
    el.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => { el.removeEventListener('scroll', update); window.removeEventListener('resize', update); };
  }, [ids]);

  // On a narrow screen the selected tab scrolls fully into view, centred, inside the bar (never the page).
  useEffect(() => {
    const bar = list.current, tab = tabs.current[selected];
    if (!bar || !tab || bar.scrollWidth <= bar.clientWidth) return;
    bar.scrollTo({ left: tab.offsetLeft - (bar.clientWidth - tab.offsetWidth) / 2, behavior: reducedMotion() ? 'auto' : 'smooth' });
  }, [selected, compact]);

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
      <div ref={bar} className="pdp-tabs" data-hash-targets={ids}>
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
      <div ref={area} className="pdp-panels" style={minHeight ? { minHeight } : undefined}>
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
