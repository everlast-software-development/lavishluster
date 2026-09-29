import ProductCard from './ProductCard.jsx';

export default function ProductGrid({ products, columns = 3, showContext = true, headingLevel = 3 }) {
  return (
    <ul className={`product-grid product-grid--${columns}`}>
      {products.map((p) => (
        <li key={p.slug}>
          <ProductCard product={p} showContext={showContext} headingLevel={headingLevel} />
        </li>
      ))}
    </ul>
  );
}
