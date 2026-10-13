import { Link } from 'react-router-dom';
import Seo from '../../components/ui/Seo.jsx';
import BrandImage from '../../components/ui/BrandImage.jsx';
import Breadcrumb from '../../components/ui/Breadcrumb.jsx';
import TitleLines from '../../components/sections/home/TitleLines.jsx';
import ConsultationCta from '../../components/sections/ConsultationCta.jsx';
import { BeforeAfterGallery, Testimonials } from '../../components/sections/PendingSections.jsx';
import { resultsPage } from '../../data/content/results.js';
import { categories } from '../../data/taxonomy.js';
import { getProduct, productsInCategory } from '../../data/catalog.js';
import './Results.css';
import nb from '../../components/ui/nb.jsx';

/** Title lines only when they join back to the verbatim title. */
const linesOf = (block) => (block.titleLines && block.titleLines.join(' ') === block.title ? block.titleLines : null);

/** A product's evidence split into stats (with a figure) and claims (statements), verbatim. */
const evidenceOf = (p) => {
  const items = p.display.evidence;
  return { stats: items.filter((i) => i.figure), claims: items.filter((i) => !i.figure) };
};

/** The strip's three highlights: [product slug, index of the stat in that product's stats], read from the data. */
const HIGHLIGHTS = [
  ['luster-night-illumination', 0],
  ['luster-brighten-3-0', 3],
  ['luster-tech-eye-mask', 0],
];
const highlights = HIGHLIGHTS.map(([slug, i]) => {
  const p = getProduct(slug);
  return { product: p, stat: p ? evidenceOf(p).stats[i] : null };
}).filter((h) => h.stat);

const SECTIONS = [
  { id: 'facial-results', number: '01', label: resultsPage.productResults, category: categories[0], tone: 'pearl' },
  { id: 'flash-results', number: '02', label: resultsPage.productResults, category: categories[1], tone: 'white', rows: true },
  { id: 'device-results', number: '03', label: resultsPage.deviceResults, category: categories[2], tone: 'noir', cells: true },
];

/**
 * One result card, the same order for every product: name · type · gold rule · headline result (the first
 * stat, or the first claim when there are none) · every remaining stat, then every remaining claim.
 */
function ResultCard({ product }) {
  const { stats, claims } = evidenceOf(product);
  const [headStat, ...restStats] = stats;
  const headClaim = headStat ? null : claims[0];
  const restClaims = headStat ? claims : claims.slice(1);
  return (
    <li className="res-card">
      <h3 className="res-card__name"><Link to={`/products/${product.slug}`}>{nb(product.name)}</Link></h3>
      <p className="res-card__type">{nb(product.subtitle)}</p>
      <span className="res-card__rule" aria-hidden="true" />
      <div className="res-card__head">
        {headStat && (
          <p className="res-card__stat">
            <span className="res-card__value">{headStat.figure}</span>{' '}
            <span className="res-card__label">{headStat.text}</span>
          </p>
        )}
        {headClaim && <p className="res-card__claim">{headClaim.text}</p>}
      </div>
      {(restStats.length > 0 || restClaims.length > 0) && (
        <ul className="res-card__list">
          {restStats.map((s) => (
            <li key={s.raw} className="res-line res-line--stat">
              <span className="res-line__mark">{s.figure}</span>{' '}
              <span className="res-line__text">{s.text}</span>
            </li>
          ))}
          {restClaims.map((c) => (
            <li key={c.raw} className="res-line res-line--claim">
              <span className="res-line__mark" aria-hidden="true" />
              <span className="res-line__text">{c.text}</span>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

/**
 * One compact result row (Flash Treatment): index · name and type · the headline result (the first stat as
 * one inline line, or the first claim when there are none), then every remaining stat, then every remaining claim.
 */
function ResultRow({ product, index }) {
  const { stats, claims } = evidenceOf(product);
  const [headStat, ...restStats] = stats;
  const headClaim = headStat ? null : claims[0];
  const restClaims = headStat ? claims : claims.slice(1);
  return (
    <li className="res-row">
      <span className="res-row__index" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
      <div className="res-row__product">
        <h3 className="res-row__name"><Link to={`/products/${product.slug}`}>{nb(product.name)}</Link></h3>
        <p className="res-row__type">{nb(product.subtitle)}</p>
      </div>
      <div className="res-row__result">
        {headStat && (
          <p className="res-row__stat">
            <span className="res-row__value">{headStat.figure}</span>{' '}
            <span className="res-row__label">{headStat.text}</span>
          </p>
        )}
        {headClaim && <p className="res-row__claim">{headClaim.text}</p>}
        {(restStats.length > 0 || restClaims.length > 0) && (
          <ul className="res-row__more">
            {restStats.map((s) => (
              <li key={s.raw} className="res-row__stat res-row__stat--more">
                <span className="res-row__value">{s.figure}</span>{' '}
                <span className="res-row__label">{s.text}</span>
              </li>
            ))}
            {restClaims.map((c) => <li key={c.raw} className="res-row__note">{c.text}</li>)}
          </ul>
        )}
      </div>
    </li>
  );
}

/**
 * One device cell (Beauty Devices, the Science "Beauty Technology" grid language): gold bar · name, type and
 * index · the headline result (the first stat, or the first claim when there are none) · every remaining stat,
 * then every remaining claim.
 */
function ResultCell({ product, index }) {
  const { stats, claims } = evidenceOf(product);
  const [headStat, ...restStats] = stats;
  const headClaim = headStat ? null : claims[0];
  const restClaims = headStat ? claims : claims.slice(1);
  return (
    <li className="res-dev">
      <span className="res-dev__bar" aria-hidden="true" />
      <div className="res-dev__top">
        <div className="res-dev__id">
          <h3 className="res-dev__name"><Link to={`/products/${product.slug}`}>{nb(product.name)}</Link></h3>
          <p className="res-dev__type">{nb(product.subtitle)}</p>
        </div>
        <span className="res-dev__index" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
      </div>
      <div className="res-dev__head">
        {headStat && (
          <p className="res-dev__stat">
            <span className="res-dev__value">{headStat.figure}</span>{' '}
            <span className="res-dev__label">{headStat.text}</span>
          </p>
        )}
        {headClaim && <p className="res-dev__claim">{headClaim.text}</p>}
      </div>
      {(restStats.length > 0 || restClaims.length > 0) && (
        <ul className="res-dev__list">
          {restStats.map((s) => (
            <li key={s.raw} className="res-dev__line res-dev__line--stat">
              <span className="res-dev__mark">{s.figure}</span>{' '}
              <span className="res-dev__text">{s.text}</span>
            </li>
          ))}
          {restClaims.map((c) => <li key={c.raw} className="res-dev__line res-dev__line--claim">{c.text}</li>)}
        </ul>
      )}
    </li>
  );
}

/**
 * Results — content-source/website-content.md, section 9. Every string comes from results.js, the taxonomy
 * and the catalog (product names, types and Scientific Evidence, verbatim); numbers 01–03 are the only
 * additions. Hero noir → stats strip noir → Facial pearl → Flash white → Devices noir → Consultation.
 * Image: brand/results-hero.jpg (hero, full-bleed under a noir scrim).
 */
export default function Results() {
  const { hero } = resultsPage;
  return (
    <>
      <Seo title="Results" description={hero.text} path="/results" />

      {/* The stage: one image behind the hero AND the stats strip (as the Home LusterScan photo runs behind its steps) */}
      <div className="res-stage m-hero m-hero--dark">
      <div className="res-hero__media m-hero__media">
        <BrandImage name="results-hero" alt="" eager sizes="(max-width: 1023px) 160vh, 100vw" />
      </div>

      {/* Hero (noir): the text in the lower part, below the faces */}
      <section className="res-hero on-dark m-hero__body" aria-labelledby="res-title">
        <div className="container res-hero__inner">
          <div className="res-hero__text">
            <Breadcrumb to="/results" className="res-hero__crumbs" />
            <TitleLines as="h1" id="res-title" lines={linesOf(hero)} title={hero.title} className="res-hero__title" />
            <p className="res-hero__lead">{hero.text}</p>
          </div>
        </div>
      </section>

      {/* Stats strip (noir): three highlight results, read from the data */}
      <section className="res-strip on-dark" aria-label={resultsPage.productResults}>
        <div className="container">
          <ul className="res-strip__list">
            {highlights.map(({ product, stat }) => (
              <li key={product.slug} className="res-strip__item">
                <span className="res-strip__value">{stat.figure}</span>
                <span className="res-strip__label">{stat.text}</span>
                <span className="res-strip__product">{nb(product.name)}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
      </div>

      <BeforeAfterGallery />

      {SECTIONS.map((s) => (
        <section key={s.id} id={s.id} className={`res-band res-band--${s.tone}${s.tone === 'noir' ? ' on-dark' : ''}`} aria-labelledby={`${s.id}-title`}>
          <div className="container">
            <p className="res-eyebrow">
              <span>{s.number}</span>
              <span className="res-eyebrow__rule" aria-hidden="true" />
              <span>{s.label}</span>
            </p>
            <h2 id={`${s.id}-title`} className="home-title res-h2">{s.category.label}</h2>
            {s.rows ? (
              <ol className="res-rows">
                {productsInCategory(s.category.slug).map((p, i) => <ResultRow key={p.slug} product={p} index={i} />)}
              </ol>
            ) : s.cells ? (
              <ol className="res-devs">
                {productsInCategory(s.category.slug).map((p, i) => <ResultCell key={p.slug} product={p} index={i} />)}
              </ol>
            ) : (
              <ul className="res-grid">
                {productsInCategory(s.category.slug).map((p) => <ResultCard key={p.slug} product={p} />)}
              </ul>
            )}
          </div>
        </section>
      ))}

      <Testimonials />

      <ConsultationCta secondary={{ to: '/products', label: 'Explore Products' }} />
    </>
  );
}
