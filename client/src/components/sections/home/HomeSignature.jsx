import ProductImage from '../../ui/ProductImage.jsx';
import { ButtonLink } from '../../ui/Links.jsx';
import { getProduct } from '../../../data/catalog.js';
import './HomeSignature.css';

/** Which product is the signature is a presentation choice; every value shown comes from its data. */
const SIGNATURE_SLUG = 'luster-cell-revive-exosome';

/** 04 — Signature product on silk. */
export default function HomeSignature() {
  const p = getProduct(SIGNATURE_SLUG);
  if (!p) return null;
  const figure = p.display.evidence.find((e) => e.figure);
  const context = p.stepInfo ? `Step ${p.stepInfo.number}, ${p.stepInfo.label}` : p.categoryInfo.label;
  return (
    <section className="section section--silk home-signature" aria-labelledby="signature-title">
      <div className="container home-signature__grid">
        <div className="home-signature__text">
          <p className="eyebrow">{context}</p>
          <p className="home-signature__name">{p.name}</p>
          <h2 id="signature-title" className="home-signature__subtitle">{p.subtitle}</h2>
          {p.shortDescription && <p className="home-signature__desc">{p.shortDescription}</p>}
          {figure && (
            <p className="home-signature__figure">
              <span className="home-signature__num">{figure.figure}</span>
              <span className="home-signature__caption">{figure.text}</span>
            </p>
          )}
          <div className="section__actions">
            <ButtonLink to={`/products/${p.slug}`}>View product</ButtonLink>
          </div>
        </div>
        <ProductImage product={p} ratio={0.8} className="home-signature__media" sizes="(min-width: 900px) 40vw, 100vw" />
      </div>
    </section>
  );
}
