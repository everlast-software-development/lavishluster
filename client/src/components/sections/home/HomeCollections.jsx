import { Link } from 'react-router-dom';
import BrandImage from '../../ui/BrandImage.jsx';
import { TextLink } from '../../ui/Links.jsx';
import { catalogHref, products } from '../../../data/catalog.js';
import { home } from '../../../data/content/home.js';
import './HomeCollections.css';

/**
 * 03 — Product Worlds (white). Header row (eyebrow + total, Explore link) over
 * a hairline; then couple.webp at 520×650 beside three equal rows, each one
 * link to its filtered catalog.
 */
export default function HomeCollections() {
  const { eyebrow, categories, cta } = home.productWorlds;
  return (
    <section className="home-band home-worlds" aria-labelledby="worlds-title">
      <div className="container">
        <header className="home-worlds__head">
          <div className="home-worlds__heading">
            <h2 id="worlds-title" className="home-eyebrow">{eyebrow}</h2>
            <span className="home-worlds__total" aria-label={`${products.length} products and devices`}>{products.length}</span>
          </div>
          <TextLink to={cta.to}>{cta.label}</TextLink>
        </header>
        <div className="home-worlds__body">
          <BrandImage name="couple" alt="" className="home-worlds__media" />
          <ul className="home-worlds__rows">
            {categories.map((c, i) => (
              <li key={c.slug}>
                <Link to={catalogHref(c.slug)} className="world-row">
                  <span className="world-row__num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                  <span className="world-row__main">
                    <span className="world-row__name">{c.label}</span>
                    <span className="world-row__desc">{c.text}</span>
                  </span>
                  <span className="world-row__meta">
                    <span className="home-label world-row__count">{c.count}</span>
                    <span className="world-row__arrow" aria-hidden="true">→</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
