import { getBrandImage } from '../../utils/assets.js';
import LusterPlate from './LusterPlate.jsx';

/** Brand photography slot (src/assets/brand/<name>.*), with plate fallback. */
export default function BrandImage({ name, alt = '', ratio = 0.8, seed, animate = false, eager = false, className = '' }) {
  const src = getBrandImage(name);
  return (
    <div className={`media ${className}`} style={{ aspectRatio: ratio }}>
      {src ? (
        <img src={src} alt={alt} loading={eager ? 'eager' : 'lazy'} decoding="async" />
      ) : (
        <LusterPlate seed={seed || name} variant="brand" ratio={ratio} animate={animate} density={animate ? 1.25 : 1} />
      )}
    </div>
  );
}
