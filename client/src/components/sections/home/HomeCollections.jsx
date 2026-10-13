import { Link } from 'react-router-dom';
import Placeholder from '../../ui/Placeholder.jsx';
import { TextLink } from '../../ui/Links.jsx';
import { catalogHref, getProduct, products } from '../../../data/catalog.js';
import { home } from '../../../data/content/home.js';
import './HomeCollections.css';
import nb from '../../ui/nb.jsx';

/**
 * Which product photograph represents each collection is a presentation
 * choice (never luster-instant-glow-shot, never the Signature photograph).
 * Each panel's focal point is set in the stylesheet by its slug modifier.
 */
const COVER = {
  'facial-treatment': 'luster-purify-and-glow',
  'flash-treatment': 'luster-collagen-eye-revive',
  'beauty-devices': 'luster-tech-eye-mask',
};

/**
 * 03 — Product Worlds (noir): header (eyebrow, the total, Explore link), then
 * three expanding full-image panels, one link each. The first is open by
 * default; hovering or focusing a panel opens it. Under 1024px: three open cards.
 */
export default function HomeCollections() {
  const { eyebrow, totalLabel, categories, cta } = home.productWorlds;
  return (
    <section className="home-band home-worlds on-dark" aria-labelledby="worlds-title">
      <div className="container">
        <header className="home-worlds__head">
          <div className="home-worlds__heading">
            <h2 id="worlds-title" className="home-eyebrow">{nb(eyebrow)}</h2>
            <p className="home-worlds__total">
              <span className="home-worlds__count">{products.length}</span>
              <span className="home-label home-worlds__count-label">{totalLabel}</span>
            </p>
          </div>
          <TextLink to={cta.to} tone="light">{cta.label}</TextLink>
        </header>
        <ul className="world-panels">
          {categories.map((c, i) => {
            const images = getProduct(COVER[c.slug])?.images;
            const src = images?.primary;
            // The open panel's width follows the image's aspect (read at build time), kept to 50–60% of the row.
            const style = images?.primaryAspect ? { '--ar': images.primaryAspect.toFixed(6) } : undefined;
            const num = String(i + 1).padStart(2, '0');
            return (
              <li key={c.slug} className={`world-panel world-panel--${c.slug}`} style={style}>
                <Link to={catalogHref(c.slug)} className="world-panel__link">
                  <span className="media world-panel__media">
                    {src ? <img className="world-panel__img" src={src} alt="" loading="lazy" decoding="async" /> : <Placeholder title={c.label} />}
                  </span>
                  {/* Layers over the image: closed-panel shade, base scrim (always), top shade (always). */}
                  <span className="world-panel__shade" aria-hidden="true" />
                  <span className="world-panel__scrim" aria-hidden="true" />
                  <span className="world-panel__top" aria-hidden="true" />

                  {/* Closed state: number top-left, vertical name bottom-left, count bottom-right. */}
                  <span className="world-panel__closed" aria-hidden="true">
                    <span className="world-panel__num world-panel__num--top">{num}</span>
                    <span className="world-panel__vname">{c.label}</span>
                    <span className="home-label world-panel__count world-panel__count--corner">{c.count}</span>
                  </span>

                  {/* Open state: number and count, name, description, Explore. */}
                  <span className="world-panel__open">
                    <span className="world-panel__meta">
                      <span className="world-panel__num">{num}</span>
                      <span className="home-label world-panel__count">{c.count}</span>
                    </span>
                    <span className="world-panel__name">{c.label}</span>
                    <span className="world-panel__desc">{c.text}</span>
                    <span className="home-label world-panel__cta" aria-hidden="true">Explore <span className="world-panel__arrow">→</span></span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
