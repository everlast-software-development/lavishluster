import { Link } from 'react-router-dom';
import { categoriesWithCounts, productsInCategory } from '../../data/catalog.js';
import ProductImage from '../ui/ProductImage.jsx';

/** Home: the three collections as an editorial index, each with a representative plate. */
export default function CategoryIndex() {
  return (
    <ul className="category-index">
      {categoriesWithCounts.map((c) => {
        const lead = productsInCategory(c.slug)[0];
        return (
          <li key={c.slug}>
            <Link to={`/products?category=${c.slug}`} className="category-index__link">
              <ProductImage product={lead} ratio={1} className="category-index__media" />
              <div className="category-index__text">
                <h3 className="category-index__name">{c.label}</h3>
                <p className="category-index__count">{c.count} {c.slug === 'beauty-devices' ? 'devices' : 'products'}</p>
                {c.description && <p className="category-index__desc">{c.description}</p>}
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
