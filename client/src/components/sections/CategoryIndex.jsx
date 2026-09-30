import { Link } from 'react-router-dom';
import { catalogHref, categoriesWithCounts, productsInCategory } from '../../data/catalog.js';
import ProductImage from '../ui/ProductImage.jsx';

/** The three product worlds as large editorial panels, each opening the filtered catalog. */
export default function CategoryIndex() {
  return (
    <ul className="category-index">
      {categoriesWithCounts.map((c) => (
        <li key={c.slug}>
          <Link to={catalogHref(c.slug)} className="category-index__link">
            <ProductImage product={productsInCategory(c.slug)[0]} ratio={0.8} className="category-index__media" />
            <div className="category-index__text">
              <p className="category-index__count">{c.countLabel}</p>
              <h3 className="category-index__name">{c.label}</h3>
              <span className="category-index__cta">View {c.label}</span>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
