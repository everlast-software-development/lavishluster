import { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { homeItem, navItems, NAV_SPLIT } from './navItems.js';
import Wordmark from './Wordmark.jsx';
import { useCompact } from '../ui/nb.jsx';

/**
 * Desktop (1024px and up): three nav items, centred wordmark, the other three.
 * On Home, About, LusterScan AI and Results the bar is transparent (white logo and nav) over the noir hero until
 * the page scrolls; everywhere else it is solid pearl with a hairline.
 * Mobile: centred wordmark, "Menu" on the right, full-screen noir menu. On Home below 1024px the bar stays
 * transparent for as long as the noir hero is under it (an IntersectionObserver on the hero), and turns pearl
 * only once the page has scrolled past it, in both directions.
 */
export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [heroUnder, setHeroUnder] = useState(true);   // Home, compact: the noir hero is under the bar
  const compact = useCompact();
  const { pathname } = useLocation();
  const panelRef = useRef(null);
  const buttonRef = useRef(null);
  // Pages that open on a noir hero: the bar sits over it, transparent, until the page scrolls.
  const overHero = pathname === '/' || pathname === '/about' || pathname === '/lusterscan-ai' || pathname === '/results';
  const homeCompact = compact && pathname === '/';
  const overlay = overHero && (homeCompact ? heroUnder : !scrolled);
  const light = overlay || open;

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Home, compact: watch the hero through a 1px line at the bar's bottom edge: transparent while the hero is
  // under the bar, pearl from the moment its end passes the bar (and back again when scrolling up).
  useEffect(() => {
    if (!homeCompact) return undefined;
    const hero = document.querySelector('.home-hero');
    const bar = document.querySelector('.site-header');
    if (!hero || !bar || typeof IntersectionObserver === 'undefined') return undefined;
    let io;
    const observe = () => {
      io?.disconnect();
      const h = Math.round(bar.getBoundingClientRect().height);
      io = new IntersectionObserver(([entry]) => setHeroUnder(entry.isIntersecting), { rootMargin: `-${Math.max(0, h - 1)}px 0px -${Math.max(0, window.innerHeight - h)}px 0px`, threshold: 0 });
      io.observe(hero);
    };
    observe();
    window.addEventListener('resize', observe);
    return () => { io?.disconnect(); window.removeEventListener('resize', observe); };
  }, [homeCompact]);

  useEffect(() => {
    document.documentElement.classList.toggle('menu-open', open);
    if (!open) return undefined;
    panelRef.current?.querySelector('a')?.focus();
    const onKey = (e) => {
      if (e.key === 'Escape') { setOpen(false); buttonRef.current?.focus(); return; }
      if (e.key !== 'Tab') return;
      // Focus trap: Tab cycles through the menu links, then the Close button, then back to the first link
      // (explicitly: in the DOM the button comes before the panel, so the browser's own order would leave).
      const items = [...(panelRef.current?.querySelectorAll('a') ?? []), buttonRef.current].filter(Boolean);
      const i = items.indexOf(document.activeElement);
      e.preventDefault();
      const next = i === -1 ? (e.shiftKey ? items.length - 1 : 0) : (i + (e.shiftKey ? -1 : 1) + items.length) % items.length;
      items[next]?.focus();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const cls = ['site-header', overHero && 'site-header--home', overlay && 'is-overlay', open && 'is-open'].filter(Boolean).join(' ');
  const link = (item) => (
    <li key={item.to}><NavLink to={item.to} end={item.end}>{item.label}</NavLink></li>
  );

  return (
    <header className={cls}>
      <div className="container site-header__bar">
        <Wordmark tone={light ? 'light' : 'dark'} className="site-header__logo" />
        <nav className="site-nav" aria-label="Main">
          <ul className="site-nav__list">{navItems.slice(0, NAV_SPLIT).map(link)}</ul>
          <ul className="site-nav__list">{navItems.slice(NAV_SPLIT).map(link)}</ul>
        </nav>
        <button
          ref={buttonRef}
          type="button"
          className="menu-toggle"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="menu-toggle__label">{open ? 'Close' : 'Menu'}</span>
          <span className="menu-toggle__icon" aria-hidden="true"><i /><i /></span>
        </button>
      </div>
      <div id="mobile-menu" ref={panelRef} className="mobile-menu" hidden={!open}>
        <nav aria-label="Main (mobile)">
          <ul>{[homeItem, ...navItems].map(link)}</ul>
        </nav>
      </div>
    </header>
  );
}
