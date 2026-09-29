import { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { navItems } from './navItems.js';
import Wordmark from './Wordmark.jsx';

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const panelRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
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

  return (
    <header className={`site-header${scrolled ? ' is-scrolled' : ''}${open ? ' is-open' : ''}`}>
      <div className="container site-header__bar">
        <Wordmark />
        <nav className="site-nav" aria-label="Main">
          <ul>
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink to={item.to} end={item.end}>{item.label}</NavLink>
              </li>
            ))}
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
        <nav aria-label="Main (mobile)" className="container">
          <ul>
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink to={item.to} end={item.end}>{item.label}</NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
