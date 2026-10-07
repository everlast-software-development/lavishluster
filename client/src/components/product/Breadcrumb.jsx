import { Link } from 'react-router-dom';
import { catalogHref } from '../../data/catalog.js';

/** Products — category — step (when the product has one), joined by 16px hairlines; the last item is the current page's place. */
export default function Breadcrumb({ product }) {
  const cat = product.categoryInfo;
  const step = product.stepInfo;
  return (
    <nav className="pdp-crumbs" aria-label="Breadcrumb">
      <ol>
        <li><Link to="/products">Products</Link></li>
        <li><Link to={catalogHref(cat.slug)}>{cat.label}</Link></li>
        {step && <li><Link to={catalogHref(cat.slug, step.slug)}>{step.label}</Link></li>}
      </ol>
    </nav>
  );
}
