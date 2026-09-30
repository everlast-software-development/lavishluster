import { useEffect, useLayoutEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Seo from '../../components/ui/Seo.jsx';
import PageHero from '../../components/ui/PageHero.jsx';
import ProductImage from '../../components/ui/ProductImage.jsx';
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

/** The three product worlds — the entry point to the catalog. */
function Worlds({ active }) {
  return (
    <section className="worlds" aria-label="Product worlds">
      <div className="container">
        <ul className="worlds__list">
          {categoriesWithCounts.map((c) => (
            <li key={c.slug}>
              <Link
                to={catalogHref(active === c.slug ? null : c.slug)}
                className="world"
                aria-current={active === c.slug ? 'true' : undefined}
              >
                <ProductImage product={productsInCategory(c.slug)[0]} ratio={1.25} className="world__media" eager />
                <span className="world__count">{c.countLabel}</span>
                <span className="world__name">{c.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** Sticky filter bar: world tabs, plus treatment-step filters inside Facial Treatment. */
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
            <ul className="filter-bar__chips">
              <li>
                <Link to={catalogHref(FACIAL)} aria-current={!step ? 'true' : undefined}>All</Link>
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

function WorldGroup({ category, items, heading = 'h2', note, showContext = false }) {
  const H = heading;
  return (
    <section className="world-group" aria-labelledby={`world-${category.slug}`}>
      <div className="container">
        <header className="world-group__head">
          <H id={`world-${category.slug}`} className="world-group__title">{category.label}</H>
          <p className="world-group__count">{note || category.countLabel}</p>
          {category.description && <p className="world-group__desc">{category.description}</p>}
        </header>
        <ProductGrid products={items} columns={4} showContext={showContext} headingLevel={3} />
      </div>
    </section>
  );
}

export default function Products() {
  const { category, step } = useCatalogFilter();
  const visible = category ? [cat(category)] : categoriesWithCounts;

  return (
    <>
      <Seo
        title="Products"
        description={`${cat(FACIAL).description} ${cat('flash-treatment').description}`}
        path="/products"
      />
      <PageHero title="Discover Lavish Luster" intro={masterBrand.statement}>
        <p className="page-hero__meta">{masterBrand.subTagline}</p>
      </PageHero>

      <Worlds active={category} />
      <FilterBar category={category} step={step} />

      <div className="catalog" key={`${category || 'all'}-${step?.slug || 'all'}`}>
        {visible.map((c) => {
          const stepped = c.slug === FACIAL && step;
          const items = stepped ? productsInStep(step.number) : productsInCategory(c.slug);
          return (
            <WorldGroup
              key={c.slug}
              category={c}
              items={items}
              showContext={c.slug === FACIAL && !step}
              note={stepped ? `${step.label} · ${items.length} of ${c.count} products` : null}
            />
          );
        })}
      </div>
    </>
  );
}
