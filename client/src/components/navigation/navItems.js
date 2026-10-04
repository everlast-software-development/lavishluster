import { features } from '../../data/config/features.js';

/**
 * Main navigation — one level only. Product categories and treatment steps
 * are filters inside /products, never navigation items. On desktop the
 * wordmark links home and sits between the first three items and the rest;
 * the mobile menu and the footer also list Home explicitly.
 */
export const navItems = [
  { to: '/about', label: 'About' },
  { to: '/products', label: 'Products' },
  { to: '/lusterscan-ai', label: 'LusterScan AI' },
  { to: '/science', label: 'The Science' },
  { to: '/results', label: 'Results' },
  features.clinic && { to: '/clinic', label: 'Clinic' },
  { to: '/contact', label: 'Contact' },
].filter(Boolean);

export const homeItem = { to: '/', label: 'Home', end: true };

/** Primary CTA (content-source/website-content.md, section 3): after Contact on desktop, at the bottom of the mobile menu. */
export const navCta = { to: '/contact', label: 'Request a Consultation' };

/**
 * Desktop split around the centred wordmark: four items left, the rest plus the
 * CTA right, so both halves clear the logo from 1280px (below that the menu is used).
 */
export const NAV_SPLIT = 4;
