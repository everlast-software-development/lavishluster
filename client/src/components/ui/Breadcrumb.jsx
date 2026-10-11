import { Link } from 'react-router-dom';
import { homeItem, navItems } from '../navigation/navItems.js';
import './Breadcrumb.css';

/**
 * Page breadcrumb on noir heroes: "Home — <page>". Both labels come from the navigation
 * (homeItem and the navItems entry for `to`), so no new strings. Placement (margin, alignment)
 * belongs to the page via `className`.
 */
export default function Breadcrumb({ to, className = '' }) {
  const current = navItems.find((i) => i.to === to)?.label;
  return (
    <nav className={`page-crumbs ${className}`.trim()} aria-label="Breadcrumb">
      <Link to={homeItem.to}>{homeItem.label}</Link>
      <span aria-hidden="true">—</span>
      <span aria-current="page">{current}</span>
    </nav>
  );
}
