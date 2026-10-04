import { Link } from 'react-router-dom';
import Placeholder from '../../ui/Placeholder.jsx';
import { TextLink } from '../../ui/Links.jsx';
import { catalogHref, getProduct, products } from '../../../data/catalog.js';
import { home } from '../../../data/content/home.js';
import './HomeCollections.css';

/**
 * Which product photograph represents each collection is a presentation
 * choice (never luster-instant-glow-shot, never the marble group photo used
 * by the Signature section).
 */
const COVER = {
  'facial-treatment': 'luster-purify-and-glow',
  'flash-treatment': 'luster-collagen-eye-revive',
  'beauty-devices': 'luster-tech-eye-mask',
};

/** 03 — Product Worlds (white): the three categories with counts and descriptions, then the catalog CTA. */
export default function HomeCollections() {
  const { eyebrow, categories, cta } = home.productWorlds;
  return (
    <section className="home-band home-collections" aria-labelledby="collections-title">
      <div className="container">
        <header className="home-collections__head">
          <h2 id="collections-title" className="eyebrow home-collections__eyebrow">{eyebrow}</h2>
          <span className="home-collections__total" aria-label={`${products.length} products and devices`}>{products.length}</span>
          <TextLink to={cta.to} className="home-collections__all">{cta.label}</TextLink>
        </header>
        <ul className="home-collections__cards">
          {categories.map((c) => {
            const src = getProduct(COVER[c.slug])?.images.primary;
            return (
              <li key={c.slug}>
                <Link to={catalogHref(c.slug)} className="collection-card">
                  <div className="media collection-card__media">
                    {src ? <img src={src} alt="" loading="lazy" decoding="async" /> : <Placeholder title={c.label} />}
                  </div>
                  <h3 className="sub-title collection-card__name">{c.label}</h3>
                  <p className="collection-card__count">{c.count}</p>
                  <p className="collection-card__desc">{c.text}</p>
                  <span className="collection-card__cta" aria-hidden="true">Explore</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
