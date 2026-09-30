import { features } from '../../data/config/features.js';

/**
 * Main navigation — one level only. The wordmark links home, so Home is not
 * listed; product categories and treatment steps are filters inside
 * /products, never navigation items.
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

/** The single primary action in the header. */
export const navCta = { to: '/products', label: 'Explore Products' };
