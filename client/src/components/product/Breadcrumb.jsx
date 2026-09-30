import { Link } from 'react-router-dom';
import { catalogHref } from '../../data/catalog.js';

export default function Breadcrumb({ product }) {
  const cat = product.categoryInfo;
  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      <ol>
        <li><Link to="/products">Products</Link></li>
        <li><Link to={catalogHref(cat.slug)}>{cat.label}</Link></li>
        {product.stepInfo && (
          <li><Link to={catalogHref(cat.slug, product.stepInfo.slug)}>{product.stepInfo.label}</Link></li>
        )}
      </ol>
    </nav>
  );
}
