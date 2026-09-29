import { Link } from 'react-router-dom';
import { Evidence } from '../product/DetailBlocks.jsx';

/** Scientific Evidence for a set of products, verbatim, one row per product. */
export default function EvidenceLedger({ products, compact = false }) {
  return (
    <ul className={`ledger${compact ? ' ledger--compact' : ''}`}>
      {products.map((p) => (
        <li key={p.slug} className="ledger__row">
          <div className="ledger__product">
            <Link to={`/products/${p.slug}`} className="ledger__name">{p.name}</Link>
            <p className="ledger__subtitle">{p.subtitle}</p>
          </div>
          <Evidence product={p} compact={compact} />
        </li>
      ))}
    </ul>
  );
}
