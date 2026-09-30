import { useEffect, useLayoutEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Seo from '../../components/ui/Seo.jsx';
import PageHero from '../../components/ui/PageHero.jsx';
import ProductGrid from '../../components/product/ProductGrid.jsx';
import masterBrand from '../../data/content/master-brand.json';
import { catalogHref, categoriesWithCounts, products, productsInCategory, productsInStep, stepsWithCounts } from '../../data/catalog.js';
import { getStepBySlug } from '../../data/taxonomy.js';

const FACIAL = 'facial-treatment';
const cat = (slug) => categoriesWithCounts.find((c) => c.slug === slug);

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

/** Sticky filter bar: product-world tabs, plus treatment-step filters inside Facial Treatment. */
function FilterBar({ category, step }) {
  return (
    <div className="filter-bar">
      <div className="container">
        <nav aria-label="Filter by product world">
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
        </nav>
        {category === FACIAL && (
          <nav aria-label="Filter facial treatments">
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
          </nav>
        )}
      </div>
    </div>
  );
}

function WorldHead({ category }) {
  return (
    <header className="world-group__head">
      <h2 id={`world-${category.slug}`} className="section-title">{category.label}</h2>
      <p className="world-group__count">{category.countLabel}</p>
      {category.description && <p className="world-group__desc">{category.description}</p>}
    </header>
  );
}

function StepGroup({ step }) {
  return (
    <section className="step-group" aria-labelledby={`step-${step.slug}`}>
      <header className="step-group__head">
        <p className="eyebrow">Step {step.number}</p>
        <h3 id={`step-${step.slug}`} className="step-group__title">{step.label}</h3>
        {step.group && <p className="step-group__sub">{step.group}</p>}
      </header>
      <ProductGrid products={productsInStep(step.number)} headingLevel={4} />
    </section>
  );
}

export default function Products() {
  const { category, step } = useCatalogFilter();
  const show = (slug) => !category || category === slug;

  return (
    <>
      <Seo
        title="Products"
        description={`${cat(FACIAL).description} ${cat('flash-treatment').description}`}
        path="/products"
      />
      <PageHero title="Discover Lavish Luster" intro={masterBrand.statement} image="catalog">
        <p className="page-hero__meta">{masterBrand.subTagline}</p>
      </PageHero>

      <FilterBar category={category} step={step} />

      <div className="catalog" key={`${category || 'all'}-${step?.slug || 'all'}`}>
        {show(FACIAL) && (
          <section className="world-group" aria-labelledby={`world-${FACIAL}`}>
            <div className="container">
              <WorldHead category={cat(FACIAL)} />
              {(step ? [step] : stepsWithCounts).map((s) => <StepGroup key={s.slug} step={s} />)}
            </div>
          </section>
        )}
        {['flash-treatment', 'beauty-devices'].filter(show).map((slug) => (
          <section key={slug} className="world-group" aria-labelledby={`world-${slug}`}>
            <div className="container">
              <WorldHead category={cat(slug)} />
              <ProductGrid products={productsInCategory(slug)} />
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
