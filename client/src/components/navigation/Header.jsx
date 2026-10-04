import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { homeItem, navCta, navItems, NAV_SPLIT } from './navItems.js';
import Wordmark from './Wordmark.jsx';

/**
 * Desktop (1280px and up): four nav items, centred wordmark, the rest plus the
 * primary CTA. Below 1280px the menu holds the links and the CTA.
 * On Home the bar is transparent (white logo and nav) over the cover hero until
 * the page scrolls; everywhere else it is solid pearl with a hairline.
 * Mobile: centred wordmark, "Menu" on the right, full-screen noir menu.
 */
export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const panelRef = useRef(null);
  const buttonRef = useRef(null);
  const isHome = pathname === '/';
  const overlay = isHome && !scrolled;
  const light = overlay || open;

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('menu-open', open);
    if (!open) return undefined;
    panelRef.current?.querySelector('a')?.focus();
    const onKey = (e) => {
      if (e.key === 'Escape') { setOpen(false); buttonRef.current?.focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const cls = ['site-header', isHome && 'site-header--home', overlay && 'is-overlay', open && 'is-open'].filter(Boolean).join(' ');
  const link = (item) => (
    <li key={item.to}><NavLink to={item.to} end={item.end}>{item.label}</NavLink></li>
  );

  return (
    <header className={cls}>
      <div className="container site-header__bar">
        <Wordmark tone={light ? 'light' : 'dark'} className="site-header__logo" />
        <nav className="site-nav" aria-label="Main">
          <ul className="site-nav__list">{navItems.slice(0, NAV_SPLIT).map(link)}</ul>
          <ul className="site-nav__list">
            {navItems.slice(NAV_SPLIT).map(link)}
            <li className="site-nav__cta"><NavLink to={navCta.to} end>{navCta.label}</NavLink></li>
          </ul>
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
        <nav aria-label="Main (mobile)" className="mobile-menu__nav">
          <ul>{[homeItem, ...navItems].map(link)}</ul>
          <Link to={navCta.to} className="btn btn--light mobile-menu__cta">{navCta.label}</Link>
        </nav>
      </div>
    </header>
  );
}
