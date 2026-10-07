import { useParams } from 'react-router-dom';
import Seo from '../../components/ui/Seo.jsx';
import ProductImage from '../../components/ui/ProductImage.jsx';
import ProductGrid from '../../components/product/ProductGrid.jsx';
import Breadcrumb from '../../components/product/Breadcrumb.jsx';
import SectionTabs from '../../components/product/SectionTabs.jsx';
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
 * The detail rows this product has, in order: Benefits, Application, Ingredients, Evidence, then the
 * device rows (Technology; Modes / Functions only where named; Certifications only once verified).
 * `tab` marks the rows linked from the section tabs. Rows a product has no data for are absent. The four
 * standard rows keep fixed numbers (03 is always Ingredients, 04 always Evidence); device rows number on from 05.
 */
function rowsFor(p) {
  return [
    { id: 'benefits', num: 1, title: 'Enhanced Benefits', tab: 'Benefits', body: <Benefits product={p} /> },
    { id: 'application', num: 2, title: 'Application Secret', tab: 'Application', body: <ApplicationSecret product={p} /> },
    p.display.ingredients.length > 0 && { id: 'ingredients', num: 3, title: 'Active Ingredients', tab: 'Ingredients', body: <Ingredients product={p} /> },
    p.display.evidence.length > 0 && { id: 'evidence', num: 4, title: 'Scientific Evidence', tab: 'Evidence', body: <Evidence product={p} /> },
    p.technology.length > 0 && { id: 'technology', title: 'Technology', body: <Technology product={p} /> },
    p.lightFunctions && { id: 'light-functions', title: p.lightFunctions.heading, body: <LightFunctions data={p.lightFunctions} /> },
    p.modes.length > 0 && { id: 'modes', title: 'Modes', body: <Modes product={p} /> },
    features.certifications && p.certifications && { id: 'certifications', title: 'Certifications', body: <p className="pdp-text">{p.certifications}</p> },
    // Recommended Products: only where verified — none is yet (V-01), so no product has this row.
  ].filter(Boolean).map((r, i, rows) => ({ ...r, num: r.num ?? 5 + rows.slice(0, i).filter((x) => !x.num).length }));
}

/** One spec-sheet row: the number and title (left, 4fr), the content (right, 8fr). */
function DetailRow({ id, number, title, children }) {
  return (
    <section id={id} className="pdp-row" aria-labelledby={`${id}-title`}>
      <div className="pdp-row__head">
        <p className="pdp-row__num"><span className="pdp-row__rule" aria-hidden="true" />{number}</p>
        <h2 id={`${id}-title`} className="pdp-row__title">{title}</h2>
      </div>
      <div className="pdp-row__body">{children}</div>
    </section>
  );
}

/**
 * Product template (all 27) — design-reference/product-single-a: hero on pearl (image on the mat; breadcrumb,
 * step, name, subtitle as the H1, short description, evidence strip, consultation button), the section tabs,
 * the spec-sheet rows on white, related products on pearl, the consultation band on white.
 * Every string is Master text from the catalog, or one of the template's existing labels.
 */
export default function Product() {
  const { slug } = useParams();
  const p = getProduct(slug);
  if (!p) return <NotFound />;
  const related = getRelated(p);
  const rows = rowsFor(p);
  const tabs = rows.filter((r) => r.tab).map((r) => ({ id: r.id, label: r.tab }));

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
          <div className="pdp-wrap pdp-hero__grid">
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
              {p.stepInfo && <p className="pdp-hero__step">{`Step ${p.stepInfo.number} · ${p.stepInfo.label}`}</p>}
              <p className="pdp-hero__name">{p.name}</p>
              <h1 id="product-title" className="pdp-hero__title">{p.subtitle}</h1>
              {p.shortDescription && <p className="pdp-hero__desc">{p.shortDescription}</p>}
              <EvidenceStrip product={p} />
              <div className="pdp-hero__actions">
                <ButtonLink to="/contact?type=consultation#inquiry" className="pdp-btn">Request a consultation</ButtonLink>
              </div>
            </div>
          </div>
          <SectionTabs items={tabs} />
        </header>

        <div className="pdp-details">
          <div className="pdp-wrap">
            {rows.map((r) => (
              <DetailRow key={r.id} id={r.id} number={String(r.num).padStart(2, '0')} title={r.title}>{r.body}</DetailRow>
            ))}
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section className="pdp-related" aria-labelledby="related-title">
          <div className="pdp-wrap">
            <h2 id="related-title" className="pdp-related__title">{p.isDevice ? 'More beauty devices' : 'Related products'}</h2>
            <ProductGrid products={related} />
          </div>
        </section>
      )}

      <ConsultationCta secondary={{ to: '/products', label: 'Explore more products' }} tone="white" />
    </>
  );
}
