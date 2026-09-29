import LusterPlate from './LusterPlate.jsx';

/**
 * Product/device image slot. Renders the real primary image when present in
 * src/assets/{products,devices}/<slug>/, otherwise the generated plate.
 * Layout (aspect ratio) is identical in both cases.
 */
export default function ProductImage({ product, ratio = 0.8, sizes = '(min-width: 900px) 30vw, 90vw', eager = false, className = '' }) {
  const src = product.images?.primary;
  return (
    <div className={`media ${className}`} style={{ aspectRatio: ratio }}>
      {src ? (
        <img
          src={src}
          alt={`${product.name} — ${product.subtitle}`}
          sizes={sizes}
          loading={eager ? 'eager' : 'lazy'}
          fetchpriority={eager ? 'high' : undefined}
          decoding="async"
        />
      ) : (
        <LusterPlate seed={product.slug} variant={product.category} ratio={ratio} />
      )}
    </div>
  );
}
