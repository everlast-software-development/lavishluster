import ProductCard from './ProductCard.jsx';
import './CatalogGrid.css';

/**
 * The catalog grid: the Products page worlds and the product page's Related Products, with one card.
 * `variant`: "five" | "devices" (Products page) | "four" (Related Products). `showSteps` puts each
 * product's treatment step on its card (Facial Treatment).
 */
export default function CatalogGrid({ items, variant, showSteps = false }) {
  return (
    <ul className={`pr-grid pr-grid--${variant}${showSteps ? ' pr-grid--steps' : ''}`}>
      {items.map((p) => (
        <li key={p.slug} className="pr-grid__item">
          <ProductCard product={p} step={showSteps ? p.stepInfo : null} />
        </li>
      ))}
    </ul>
  );
}
