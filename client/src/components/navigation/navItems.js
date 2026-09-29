import { features } from '../../data/config/features.js';

export const navItems = [
  { to: '/', label: 'Home', end: true },
  { to: '/about', label: 'About' },
  { to: '/products', label: 'Products' },
  { to: '/lusterscan-ai', label: 'LusterScan AI' },
  { to: '/science', label: 'The Science' },
  { to: '/results', label: 'Results' },
  features.clinic && { to: '/clinic', label: 'Clinic' },
  { to: '/contact', label: 'Contact' },
].filter(Boolean);
