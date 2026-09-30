import { getBrandImage } from '../../utils/assets.js';
import Placeholder from './Placeholder.jsx';

/** Brand photography slot (src/assets/brand/<name>.*), with the silk placeholder as fallback. */
export default function BrandImage({ name, alt = '', ratio, eager = false, className = '' }) {
  const src = getBrandImage(name);
  return (
    <div className={`media ${className}`.trim()} style={ratio ? { aspectRatio: ratio } : undefined}>
      {src ? <img src={src} alt={alt} loading={eager ? 'eager' : 'lazy'} decoding="async" /> : <Placeholder />}
    </div>
  );
}
