import { Link } from 'react-router-dom';
import { getBrandImage } from '../../utils/assets.js';

/** Uses src/assets/brand/logo.* when supplied; otherwise a typeset wordmark. */
export default function Wordmark({ className = '' }) {
  const logo = getBrandImage('logo');
  return (
    <Link to="/" className={`wordmark ${className}`} aria-label="Lavish Luster — home">
      {logo ? <img src={logo} alt="Lavish Luster" /> : <span>Lavish Luster</span>}
    </Link>
  );
}
