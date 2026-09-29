import { useEffect, useLayoutEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Seo from '../../components/ui/Seo.jsx';
import PageHero from '../../components/ui/PageHero.jsx';
import ProductGrid from '../../components/product/ProductGrid.jsx';
import masterBrand from '../../data/content/master-brand.json';
import { categoriesWithCounts, products, productsInCategory, productsInStep, stepsWithCounts } from '../../data/catalog.js';
import { getStepBySlug } from '../../data/taxonomy.js';

const FACIAL = 'facial-treatment';

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
  let category = categoriesWithCounts.find((c) => c.slug === params.get('category'))?.slug || null;
  if (step) category = FACIAL;
  return { category, step };
}

const href = (category, step) => {
  const q = new URLSearchParams();
  if (category) q.set('category', category);
  if (step) q.set('step', step);
  const s = q.toString();
  return s ? `/products?${s}` : '/products';
};

function CategoryTabs({ active }) {
  return (
    <nav className="catalog-tabs" aria-label="Product categories">
      <div className="container">
        <ul>
          <li>
            <Link to={href()} aria-current={!active ? 'true' : undefined}>
              All products <span className="count">{products.length}</span>
            </Link>
          </li>
          {categoriesWithCounts.map((c) => (
            <li key={c.slug}>
              <Link to={href(c.slug)} aria-current={active === c.slug ? 'true' : undefined}>
                {c.label} <span className="count">{c.count}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

function StepNav({ active }) {
  return (
    <nav className="step-nav" aria-label="Facial treatment steps">
      <ol>
        <li>
          <Link to={href(FACIAL)} aria-current={!active ? 'true' : undefined} className="step-nav__all">All steps</Link>
        </li>
        {stepsWithCounts.map((s) => (
          <li key={s.slug}>
            <Link to={href(FACIAL, s.slug)} aria-current={active?.slug === s.slug ? 'true' : undefined}>
              <span className="step-nav__num">Step {s.number}</span>
              <span className="step-nav__label">{s.label}</span>
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}

function CategoryBlock({ category, children, aside }) {
  return (
    <section className="catalog-block" aria-labelledby={`cat-${category.slug}`}>
      <div className="container split">
        <header className="catalog-block__head">
          <h2 id={`cat-${category.slug}`} className="catalog-block__title">{category.label}</h2>
          <p className="catalog-block__count">{category.count} {category.slug === 'beauty-devices' ? 'devices' : 'products'}</p>
          {category.description && <p className="catalog-block__desc">{category.description}</p>}
          {aside}
        </header>
        <div className="catalog-block__body">{children}</div>
      </div>
    </section>
  );
}

function StepGroup({ step }) {
  const items = productsInStep(step.number);
  return (
    <section className="step-group" aria-labelledby={`step-${step.slug}`}>
      <header className="step-group__head">
        <p className="step-group__num">Step {step.number}</p>
        <h3 id={`step-${step.slug}`} className="step-group__title">
          {step.label}
          {step.group && <span className="step-group__sub">{step.group}</span>}
        </h3>
      </header>
      <ProductGrid products={items} showContext={false} headingLevel={4} />
    </section>
  );
}

export default function Products() {
  const { category, step } = useCatalogFilter();
  const show = (slug) => !category || category === slug;
  const cat = (slug) => categoriesWithCounts.find((c) => c.slug === slug);

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

      <CategoryTabs active={category} />

      <div className="catalog" key={`${category || 'all'}-${step?.slug || 'all'}`}>
        {show(FACIAL) && (
          <CategoryBlock category={cat(FACIAL)} aside={<StepNav active={step} />}>
            {(step ? [step] : stepsWithCounts).map((s) => <StepGroup key={s.slug} step={s} />)}
          </CategoryBlock>
        )}
        {show('flash-treatment') && (
          <CategoryBlock category={cat('flash-treatment')}>
            <ProductGrid products={productsInCategory('flash-treatment')} showContext={false} />
          </CategoryBlock>
        )}
        {show('beauty-devices') && (
          <CategoryBlock category={cat('beauty-devices')}>
            <ProductGrid products={productsInCategory('beauty-devices')} showContext={false} />
          </CategoryBlock>
        )}
      </div>
    </>
  );
}
