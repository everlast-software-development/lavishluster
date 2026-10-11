import { useEffect, useRef, useState } from 'react';
import './AboutIndex.css';

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * About chapter index ("On this page"). It renders right after the hero, looking like the hero's last
 * row, and is position: sticky inside .about-chapters (the wrapper around the four sections), so it
 * sticks under the header and lets go at the end of Core Values. No scroll listeners:
 * - a 1px sentinel above it, watched by an IntersectionObserver whose root top is the header's bottom,
 *   tells when it is stuck (compact pearl state; the header's own bottom line is hidden meanwhile);
 * - a second observer watches the four sections through a 1px line just under the stuck bar: the
 *   section crossing that line is active (aria-current="true"). Above Welcome or below Core Values,
 *   nothing is active.
 * Both observers are rebuilt when the header's height changes (ResizeObserver) or the window resizes.
 *
 * Props: chapters [{ id, number, labels[] }].
 */
export default function AboutIndex({ chapters }) {
  const sentinelRef = useRef(null);
  const navRef = useRef(null);
  const listRef = useRef(null);
  const [stuck, setStuck] = useState(false);
  const [active, setActive] = useState(null);
  const ids = chapters.map((c) => c.id).join(' ');

  useEffect(() => {
    const header = document.querySelector('.site-header');
    const nav = navRef.current;
    let stuckObserver;
    let spyObserver;
    const build = () => {
      stuckObserver?.disconnect();
      spyObserver?.disconnect();
      const headerH = header ? Math.round(header.getBoundingClientRect().height) : 0;
      // The stuck bar's height (row + rule), from the CSS (--about-index-compact, unitless px).
      const stripH = parseFloat(getComputedStyle(nav).getPropertyValue('--about-index-compact')) || 45;

      stuckObserver = new IntersectionObserver(([e]) => {
        setStuck(!e.isIntersecting && e.boundingClientRect.top < e.rootBounds.top);
      }, { rootMargin: `-${headerH}px 0px 0px 0px`, threshold: 0 });
      stuckObserver.observe(sentinelRef.current);

      const line = headerH + stripH + 8;   // just under the bar
      const seen = new Map();
      spyObserver = new IntersectionObserver((entries) => {
        entries.forEach((e) => seen.set(e.target.id, e.isIntersecting));
        setActive(ids.split(' ').find((id) => seen.get(id)) ?? null);
      }, { rootMargin: `-${line}px 0px -${Math.max(0, window.innerHeight - line - 1)}px 0px`, threshold: 0 });
      ids.split(' ').forEach((id) => { const el = document.getElementById(id); if (el) spyObserver.observe(el); });
    };
    build();
    const ro = new ResizeObserver(build);
    if (header) ro.observe(header);
    window.addEventListener('resize', build);
    return () => { stuckObserver?.disconnect(); spyObserver?.disconnect(); ro.disconnect(); window.removeEventListener('resize', build); };
  }, [ids]);

  // While stuck, the header and the strip read as one bar: the header's bottom line is hidden (About only).
  useEffect(() => {
    document.documentElement.classList.toggle('about-index-stuck', stuck);
    return () => document.documentElement.classList.remove('about-index-stuck');
  }, [stuck]);

  // Narrow screens: keep the active item visible inside the sideways-scrolling strip, without moving the page
  // (the strip's own scrollLeft only).
  useEffect(() => {
    const list = listRef.current;
    if (!active || !list || list.scrollWidth <= list.clientWidth) return;
    const item = list.querySelector(`[data-id="${active}"]`)?.parentElement;
    if (!item) return;
    const left = item.offsetLeft - (list.clientWidth - item.offsetWidth) / 2;
    list.scrollTo({ left: Math.max(0, left), behavior: reducedMotion() ? 'auto' : 'smooth' });
  }, [active]);

  const go = (e, id) => {
    const el = document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    el.scrollIntoView({ block: 'start', behavior: reducedMotion() ? 'auto' : 'smooth' });   // lands below the bar (scroll-margin-top)
    window.history.replaceState(window.history.state, '', `#${id}`);
  };

  return (
    <>
      <span ref={sentinelRef} className="about-index__sentinel" aria-hidden="true" />
      <nav ref={navRef} className={`about-index${stuck ? ' is-stuck' : ''}`} aria-label="On this page">
        <div className="container about-index__inner">
          <ol ref={listRef} className="about-index__list">
            {chapters.map((c) => (
              <li key={c.id}>
                <a href={`#${c.id}`} data-id={c.id} aria-current={active === c.id ? 'true' : undefined} onClick={(e) => go(e, c.id)}>
                  <span className="about-index__num">{c.number}</span>
                  <span className="about-index__label">
                    {c.labels.map((label, i) => (
                      <span key={label}>{i > 0 && <span className="about-index__sep" aria-hidden="true"> · </span>}{label}</span>
                    ))}
                  </span>
                </a>
              </li>
            ))}
          </ol>
        </div>
      </nav>
    </>
  );
}
