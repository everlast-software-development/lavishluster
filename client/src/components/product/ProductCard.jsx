import { Link } from 'react-router-dom';
import ProductImage from '../ui/ProductImage.jsx';

export function productContext(p) {
  if (p.stepInfo) return p.stepInfo.label;
  return p.categoryInfo.label;
}

/**
 * Product card — the one card used everywhere. Informational only: image on a
 * white mat, name, subtitle, short description (clamped) and "View product".
 * No border, box or shadow.
 */
export default function ProductCard({ product, showContext = false, headingLevel = 3, step = null }) {
  const H = `h${headingLevel}`;
  return (
    <article className="product-card">
      <Link to={`/products/${product.slug}`} className="product-card__link">
        <ProductImage product={product} className="product-card__media" />
        <div className="product-card__text">
          {showContext && <p className="product-card__context">{productContext(product)}</p>}
          {/* The treatment step (catalog only): "Step 01 · Nourish & Repair · Serums" — the existing step strings. */}
          {step && (
            <p className="product-card__step">
              <span className="product-card__step-num">Step {String(step.number).padStart(2, '0')}</span>
              <span aria-hidden="true"> ·{' '}</span>
              <span className="product-card__step-name">{step.label}</span>
              {step.group && (
                <>
                  <span aria-hidden="true"> ·{' '}</span>
                  <span className="product-card__step-sub">{step.group}</span>
                </>
              )}
            </p>
          )}
          <H className="product-card__name">{product.name}</H>
          <p className="product-card__subtitle">{product.subtitle}</p>
          {product.shortDescription && <p className="product-card__desc">{product.shortDescription}</p>}
          <span className="product-card__cta">View product</span>
        </div>
      </Link>
    </article>
  );
}
