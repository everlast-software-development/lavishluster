import Placeholder from './Placeholder.jsx';

/**
 * Product/device image on a white mat (4:5 by default). Renders
 * src/assets/{products,devices}/<slug>/primary.* when present, otherwise the
 * silk placeholder. Layout is identical in both cases.
 */
export default function ProductImage({ product, ratio = 0.8, sizes = '(min-width: 900px) 30vw, 50vw', eager = false, className = '' }) {
  const src = product.images?.primary;
  return (
    <div className={`media media--mat ${className}`.trim()} style={{ aspectRatio: ratio }}>
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
        <Placeholder title={product.name} subtitle={product.subtitle} />
      )}
    </div>
  );
}
