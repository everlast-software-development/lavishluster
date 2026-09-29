import { Link } from 'react-router-dom';

export default function Breadcrumb({ product }) {
  const cat = product.categoryInfo;
  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      <ol>
        <li><Link to="/products">Products</Link></li>
        <li><Link to={`/products?category=${cat.slug}`}>{cat.label}</Link></li>
        {product.stepInfo && (
          <li>
            <Link to={`/products?category=${cat.slug}&step=${product.stepInfo.slug}`}>
              Step {product.stepInfo.number}, {product.stepInfo.label}
            </Link>
          </li>
        )}
      </ol>
    </nav>
  );
}
