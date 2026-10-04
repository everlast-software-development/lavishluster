import { Link } from 'react-router-dom';
import { getBrandImage } from '../../utils/assets.js';

const logo = getBrandImage('logo');

/**
 * The Lavish Luster logo, from one file (src/assets/brand/logo.png, 1200×204,
 * white artwork on transparency). The PNG is used as a CSS mask filled with
 * currentColor, so `tone` tints it: "dark" = ink on light surfaces,
 * "light" = pearl on the Home hero, noir sections, mobile menu and footer.
 * The box keeps the file's 1200:204 ratio (sizes in components.css).
 */
export default function Wordmark({ tone = 'dark', className = '' }) {
  return (
    <Link to="/" className={`wordmark wordmark--${tone} ${className}`} aria-label="Lavish Luster — home">
      <span className="wordmark__mark" style={{ '--logo': `url("${logo}")` }} aria-hidden="true" />
    </Link>
  );
}
