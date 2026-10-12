import { useParams } from 'react-router-dom';
import Seo from '../../components/ui/Seo.jsx';
import ProductImage from '../../components/ui/ProductImage.jsx';
import CatalogGrid from '../../components/product/CatalogGrid.jsx';
import Breadcrumb from '../../components/product/Breadcrumb.jsx';
import ProductTabs from '../../components/product/ProductTabs.jsx';
import LightFunctions from '../../components/product/LightFunctions.jsx';
import { ApplicationSecret, Benefits, Evidence, EvidenceStrip, Ingredients, Modes, Technology } from '../../components/product/DetailBlocks.jsx';
import ConsultationCta from '../../components/sections/ConsultationCta.jsx';
import { ButtonLink } from '../../components/ui/Links.jsx';
import { getProduct, getRelated } from '../../data/catalog.js';
import { features, site } from '../../data/config/features.js';
import { absoluteUrl } from '../../utils/seo.js';
import NotFound from '../NotFound/NotFound.jsx';
import './Product.css';

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

/**
 * The detail blocks this product has, in order: Benefits, Application, Ingredients, Evidence, then the
 * device blocks (Technology; Modes / Functions only where named; Certifications only once verified).
 * Each is one tab + one panel; `tab` is the existing tab label (an extra block's tab is its title).
 * Blocks a product has no data for are absent, and the numbers (01, 02 …) run over the blocks shown.
 */
function blocksFor(p) {
  return [
    { id: 'benefits', title: 'Enhanced Benefits', tab: 'Benefits', body: <Benefits product={p} /> },
    { id: 'application', title: 'Application Secret', tab: 'Application', body: <ApplicationSecret product={p} /> },
    p.display.ingredients.length > 0 && { id: 'ingredients', title: 'Active Ingredients', tab: 'Ingredients', body: <Ingredients product={p} /> },
    p.display.evidence.length > 0 && { id: 'evidence', title: 'Scientific Evidence', tab: 'Evidence', body: <Evidence product={p} /> },
    p.technology.length > 0 && { id: 'technology', title: 'Technology', body: <Technology product={p} /> },
    p.lightFunctions && { id: 'light-functions', title: p.lightFunctions.heading, body: <LightFunctions data={p.lightFunctions} /> },
    p.modes.length > 0 && { id: 'modes', title: 'Modes', body: <Modes product={p} /> },
    features.certifications && p.certifications && { id: 'certifications', title: 'Certifications', body: <p className="pdp-text">{p.certifications}</p> },
    // Recommended Products: only where verified — none is yet (V-01), so no product has this block.
  ].filter(Boolean).map((b) => ({ ...b, tab: b.tab || b.title }));
}

/**
 * Product template (all 27, every category): hero on pearl (image on a plain mat; breadcrumb, step, name,
 * the type as the H1, short description, key-result strip, consultation button), then on white the
 * tabs that switch the detail panels (one at a time), related products on pearl (the Products page card),
 * the consultation band on white. Inner-page system: the shared .container, --section-y, tokens only.
 * Every string is Master text from the catalog, or one of the template's existing labels.
 */
export default function Product() {
  const { slug } = useParams();
  const p = getProduct(slug);
  if (!p) return <NotFound />;
  const related = getRelated(p);
  const blocks = blocksFor(p);

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

      <article className={`pdp${p.isDevice ? ' pdp--device' : ''}`} aria-labelledby="product-title">
        <header className="pdp-hero">
          <div className="container pdp-hero__grid">
            <div className="pdp-hero__media">
              <ProductImage product={p} ratio={0.8} eager sizes="(min-width: 900px) 45vw, 100vw" className="pdp-mat" />
              {p.images.gallery.length > 0 && (
                <ul className="pdp-hero__gallery">
                  {p.images.gallery.map((src, i) => (
                    <li key={src}><img src={src} alt={`${p.name} — image ${i + 2}`} loading="lazy" decoding="async" /></li>
                  ))}
                </ul>
              )}
            </div>
            <div className="pdp-hero__text">
              <Breadcrumb product={p} />
              {p.stepInfo && <p className="pdp-hero__step">{`${p.stepInfo.display} · ${p.stepInfo.label}`}</p>}
              <p className="pdp-hero__name">{p.name}</p>
              <h1 id="product-title" className="pdp-hero__title">{p.subtitle}</h1>
              {p.shortDescription && <p className="pdp-hero__desc">{p.shortDescription}</p>}
              <EvidenceStrip product={p} />
              <div className="pdp-hero__actions">
                <ButtonLink to="/contact?type=consultation#inquiry">Request a consultation</ButtonLink>
              </div>
            </div>
          </div>
        </header>

        <div className="pdp-details">
          <div className="container">
            <ProductTabs key={p.slug} blocks={blocks} labelledBy="product-title" />
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section className="pdp-related" aria-labelledby="related-title">
          <div className="container">
            <h2 id="related-title" className="home-title pdp-related__title">{p.isDevice ? 'More beauty devices' : 'Related products'}</h2>
            <CatalogGrid items={related} variant="four" />
          </div>
        </section>
      )}

      <ConsultationCta secondary={{ to: '/products', label: 'Explore more products' }} tone="white" />
    </>
  );
}
