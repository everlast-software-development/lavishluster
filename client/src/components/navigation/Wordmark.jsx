import { Link } from 'react-router-dom';
import { getBrandImage } from '../../utils/assets.js';

const logo = getBrandImage('logo');

/**
 * The Lavish Luster logo, from one file (src/assets/brand/logo.png, white
 * artwork on transparency). The PNG is used as a CSS mask filled with
 * currentColor, so `tone` tints it: "dark" = ink on light surfaces,
 * "light" = white on photography and noir sections.
 */
export default function Wordmark({ tone = 'dark', className = '' }) {
  return (
    <Link to="/" className={`wordmark wordmark--${tone} ${className}`} aria-label="Lavish Luster — home">
      <span className="wordmark__mark" style={{ '--logo': `url("${logo}")` }} aria-hidden="true" />
    </Link>
  );
}
