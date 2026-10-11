import { getBrandImage, getBrandSrcSet } from '../../utils/assets.js';
import Placeholder from './Placeholder.jsx';

/**
 * Brand photography slot (src/assets/brand/<name>.*), with the silk placeholder as fallback.
 * When responsive variants exist (brand/variants/<name>-<width>.webp) and `sizes` is given,
 * the image gets a srcset so small screens download small files.
 */
export default function BrandImage({ name, alt = '', ratio, eager = false, sizes, className = '' }) {
  const src = getBrandImage(name);
  const srcSet = sizes ? getBrandSrcSet(name) : null;
  return (
    <div className={`media ${className}`.trim()} style={ratio ? { aspectRatio: ratio } : undefined}>
      {src ? (
        <img src={src} srcSet={srcSet || undefined} sizes={srcSet ? sizes : undefined} alt={alt} loading={eager ? 'eager' : 'lazy'} decoding="async" />
      ) : <Placeholder />}
    </div>
  );
}
