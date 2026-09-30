import { useParams } from 'react-router-dom';
import Seo from '../../components/ui/Seo.jsx';
import Section from '../../components/ui/Section.jsx';
import Feature from '../../components/ui/Feature.jsx';
import Icon from '../../components/ui/Icon.jsx';
import ProductImage from '../../components/ui/ProductImage.jsx';
import ProductGrid from '../../components/product/ProductGrid.jsx';
import Breadcrumb from '../../components/product/Breadcrumb.jsx';
import LightFunctions from '../../components/product/LightFunctions.jsx';
import { ApplicationSecret, Benefits, Evidence, Ingredients, Modes, Technology } from '../../components/product/DetailBlocks.jsx';
import ConsultationCta from '../../components/sections/ConsultationCta.jsx';
import { ButtonLink } from '../../components/ui/Links.jsx';
import { getProduct, getRelated } from '../../data/catalog.js';
import { site } from '../../data/config/features.js';
import { absoluteUrl } from '../../utils/seo.js';
import NotFound from '../NotFound/NotFound.jsx';

function productJsonLd(p) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.name,
    description: p.shortDescription || p.subtitle,
    category: p.categoryInfo.label,
    brand: { '@type': 'Brand', name: 'Lavish Luster' },
    url: `${site.url}/products/${p.slug}`,
    ...(p.images.primary ? { image: absoluteUrl(p.images.primary) } : {}),
  };
}

/** In-page index, in reading order; lists only the sections this product has. */
function sectionsFor(p) {
  const techId = p.technology.length > 0 ? 'technology' : p.lightFunctions ? 'light-functions' : p.modes.length > 0 ? 'modes' : null;
  return [
    ['benefits', 'Benefits'],
    ['application', 'Application'],
    techId && [techId, 'Technology'],
    p.display.ingredients.length > 0 && ['ingredients', 'Ingredients'],
    ['evidence', 'Evidence'],
  ].filter(Boolean);
}

/** One centred detail section: thin line icon (or a gold rule), title, content. */
function Detail({ id, title, icon, children }) {
  return (
    <section id={id} className="detail" aria-labelledby={`${id}-title`}>
      <div className="container detail__inner">
        {icon ? <Icon name={icon} className="detail__icon" /> : <span className="detail__rule" aria-hidden="true" />}
        <h2 id={`${id}-title`} className="detail__title">{title}</h2>
        <div className="detail__body">{children}</div>
      </div>
    </section>
  );
}

/**
 * Product template (all 27): 50/50 hero on silk, then one centred column —
 * Benefits → Application → device Technology/Light Functions/Modes →
 * Active Ingredients → Scientific Evidence — then related products and the
 * consultation band. Every Master field is rendered in full.
 */
export default function Product() {
  const { slug } = useParams();
  const p = getProduct(slug);
  if (!p) return <NotFound />;
  const related = getRelated(p);
  const context = p.stepInfo ? `Step ${p.stepInfo.number} · ${p.stepInfo.label}` : p.categoryInfo.label;

  return (
    <>
      <Seo
        title={`${p.name} — ${p.subtitle}`}
        description={[p.subtitle, p.shortDescription].filter(Boolean).join('. ')}
        path={`/products/${p.slug}`}
        image={p.images.primary}
        type="product"
        jsonLd={productJsonLd(p)}
      />

      <article className={`product${p.isDevice ? ' product--device' : ''}`} aria-labelledby="product-name">
        <header className="product-hero section--silk">
          <div className="container product-hero__grid">
            <div className="product-hero__media">
              <ProductImage product={p} ratio={0.8} eager sizes="(min-width: 900px) 45vw, 100vw" />
              {p.images.gallery.length > 0 && (
                <ul className="product-hero__gallery">
                  {p.images.gallery.map((src, i) => (
                    <li key={src}><img src={src} alt={`${p.name} — image ${i + 2}`} loading="lazy" decoding="async" /></li>
                  ))}
                </ul>
              )}
            </div>
            <div className="product-hero__text">
              <Breadcrumb product={p} />
              <p className="eyebrow">{context}</p>
              <h1 id="product-name" className="product-hero__name">{p.name}</h1>
              <p className="product-hero__subtitle">{p.subtitle}</p>
              {p.shortDescription && <p className="product-hero__desc">{p.shortDescription}</p>}
              <div className="product-hero__actions">
                <ButtonLink to="/contact?type=consultation#inquiry">Request a consultation</ButtonLink>
              </div>
              <nav className="product-index" aria-label="On this page">
                <ul>
                  {sectionsFor(p).map(([id, label]) => <li key={id}><a href={`#${id}`}>{label}</a></li>)}
                </ul>
              </nav>
            </div>
          </div>
        </header>

        <div className="product-body">
          <Detail id="benefits" title="Enhanced Benefits" icon="hand-heart">
            <Benefits product={p} />
          </Detail>

          <Detail id="application" title="Application Secret" icon="magnifier">
            <ApplicationSecret product={p} />
          </Detail>

          {p.technology.length > 0 && (
            <Detail id="technology" title="Technology">
              <Technology product={p} />
            </Detail>
          )}

          {p.lightFunctions && (
            <Detail id="light-functions" title={p.lightFunctions.heading}>
              <LightFunctions data={p.lightFunctions} />
            </Detail>
          )}

          {p.modes.length > 0 && (
            <Detail id="modes" title="Modes">
              <Modes product={p} />
            </Detail>
          )}

          {p.display.ingredients.length > 0 && (
            <Detail id="ingredients" title="Active Ingredients" icon="leaf">
              <Ingredients product={p} />
            </Detail>
          )}

          <Detail id="evidence" title="Scientific Evidence" icon="flask">
            <Evidence product={p} />
          </Detail>

          <Feature flag="certifications" data={p.certifications || null}>
            <Detail id="certifications" title="Certifications">
              <p className="prose">{p.certifications}</p>
            </Detail>
          </Feature>
        </div>
      </article>

      {related.length > 0 && (
        <Section id="related" title={p.isDevice ? 'More beauty devices' : 'Related products'} layout="stack" tone="white">
          <ProductGrid products={related} />
        </Section>
      )}

      <ConsultationCta secondary={{ to: '/products', label: 'Explore more products' }} />
    </>
  );
}
