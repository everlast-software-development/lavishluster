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

/** Desktop split around the centred wordmark: three items on each side. */
export const NAV_SPLIT = 3;
