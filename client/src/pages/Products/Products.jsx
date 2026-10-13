import { useEffect, useLayoutEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Seo from '../../components/ui/Seo.jsx';
import BrandImage from '../../components/ui/BrandImage.jsx';
import Breadcrumb from '../../components/ui/Breadcrumb.jsx';
import TitleLines from '../../components/sections/home/TitleLines.jsx';
import CatalogGrid from '../../components/product/CatalogGrid.jsx';
import masterBrand from '../../data/content/master-brand.json';
import { productsPage } from '../../data/content/products.js';
import { catalogHref, categoriesWithCounts, products, productsInCategory, productsInStep, stepsWithCounts } from '../../data/catalog.js';
import { getStepBySlug } from '../../data/taxonomy.js';
import './Products.css';

const FACIAL = 'facial-treatment';
const cat = (slug) => categoriesWithCounts.find((c) => c.slug === slug);
/** Title lines only when they join back to the verbatim title. */
const linesOf = (block) => (block.titleLines && block.titleLines.join(' ') === block.title ? block.titleLines : null);

/** The three worlds in page order; the number is the section eyebrow (the only addition). */
const WORLDS = [
  { slug: FACIAL, number: '01', tone: 'pearl' },
  { slug: 'flash-treatment', number: '02', tone: 'white' },
  { slug: 'beauty-devices', number: '03', tone: 'pearl' },
];

const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

// /products is prerendered without a query string, so the first (hydration)
// render must be the unfiltered catalog. The URL filter is applied in a layout
// effect, which commits before first paint: no mismatch and no flash.
function useCatalogFilter() {
  const [params] = useSearchParams();
  const [hydrated, setHydrated] = useState(false);
  useIsoLayoutEffect(() => setHydrated(true), []);
  if (!hydrated) return { category: null, step: null };
  const step = getStepBySlug(params.get('step'));
  let category = cat(params.get('category'))?.slug || null;
  if (step) category = FACIAL;
  return { category, step };
}

/** Sticky filter bar: product-world tabs, plus treatment-step filters inside Facial Treatment. Each row is a full-width band. */
function FilterBar({ category, step }) {
  return (
    <div className="filter-bar">
      <nav className="filter-bar__row" aria-label="Filter by product world">
        <div className="container">
          <ul className="filter-bar__tabs">
            <li>
              <Link to={catalogHref()} aria-current={!category ? 'true' : undefined}>
                All <span className="count">{products.length}</span>
              </Link>
            </li>
            {categoriesWithCounts.map((c) => (
              <li key={c.slug}>
                <Link to={catalogHref(c.slug)} aria-current={category === c.slug ? 'true' : undefined}>
                  {c.label} <span className="count">{c.count}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
      {category === FACIAL && (
        <nav className="filter-bar__row" aria-label="Filter facial treatments">
          <div className="container">
            <ul className="filter-bar__steps">
              <li>
                <Link to={catalogHref(FACIAL)} aria-current={!step ? 'true' : undefined}>All steps</Link>
              </li>
              {stepsWithCounts.map((s) => (
                <li key={s.slug}>
                  <Link to={catalogHref(FACIAL, s.slug)} aria-current={step?.slug === s.slug ? 'true' : undefined}>
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      )}
    </div>
  );
}

/** Section header: eyebrow (number — count) and title on the left, the description on the right. */
function WorldHead({ category, number }) {
  return (
    <header className="pr-head">
      <div className="pr-head__main">
        <p className="home-eyebrow pr-eyebrow">
          <span>{number}</span>
          <span className="pr-eyebrow__rule" aria-hidden="true" />
          <span className="pr-head__count">{category.countLabel}</span>
        </p>
        <h2 id={`world-${category.slug}`} className="home-title pr-h2">{category.label}</h2>
      </div>
      {category.description && <p className="pr-head__desc">{category.description}</p>}
    </header>
  );
}

/**
 * Products — hero pearl (the store, full-bleed under the shared left pearl scrim) → filter bar →
 * Facial pearl → Flash white → Devices pearl. No dark sections. Every string is unchanged: the hero
 * from products.js and master-brand.json, the catalog from the catalog (names, types, steps, counts).
 */
export default function Products() {
  const { category, step } = useCatalogFilter();
  const show = (slug) => !category || category === slug;
  const { hero } = productsPage;

  return (
    <>
      <Seo
        title="Products"
        description={`${cat(FACIAL).description} ${cat('flash-treatment').description}`}
        path="/products"
      />

      {/* Hero (pearl): the store, full-bleed, under the shared left-side pearl scrim */}
      <section className="pr-hero m-hero m-hero--light" aria-labelledby="pr-title">
        <div className="pr-hero__media hero-scrim--left m-hero__media">
          <BrandImage name="catalog" alt="" eager sizes="(max-width: 1023px) 160vh, 100vw" className="pr-hero__photo" />
        </div>
        <div className="container pr-hero__inner m-hero__body">
          <div className="pr-hero__text">
            <Breadcrumb to="/products" className="pr-hero__crumbs" />
            <TitleLines as="h1" id="pr-title" lines={linesOf(hero)} title={hero.title} className="pr-hero__title" />
            <p className="pr-hero__lead">{masterBrand.statement}</p>
            <p className="pr-hero__meta">{masterBrand.subTagline}</p>
          </div>
        </div>
      </section>

      <FilterBar category={category} step={step} />

      <div className="catalog" key={`${category || 'all'}-${step?.slug || 'all'}`}>
        {WORLDS.filter((w) => show(w.slug)).map((w) => (
          <section key={w.slug} className={`pr-band pr-band--${w.tone}`} aria-labelledby={`world-${w.slug}`}>
            <div className="container">
              <WorldHead category={cat(w.slug)} number={w.number} />
              <CatalogGrid
                variant={w.slug === 'beauty-devices' ? 'devices' : 'five'}
                items={w.slug !== FACIAL ? productsInCategory(w.slug) : (step ? [step] : stepsWithCounts).flatMap((s) => productsInStep(s.number))}
                showSteps={w.slug === FACIAL}
              />
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
