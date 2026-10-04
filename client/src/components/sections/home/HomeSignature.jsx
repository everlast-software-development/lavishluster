import { ButtonLink } from '../../ui/Links.jsx';
import Placeholder from '../../ui/Placeholder.jsx';
import { getProduct } from '../../../data/catalog.js';
import './HomeSignature.css';

/** Which product is the signature is a presentation choice; every value shown comes from its data. */
const SIGNATURE_SLUG = 'luster-cell-revive-exosome';

/** 04 — Signature product (noir): the product's own photograph left, edge to edge, with an inset gold frame. */
export default function HomeSignature() {
  const p = getProduct(SIGNATURE_SLUG);
  if (!p) return null;
  const figure = p.display.evidence.find((e) => e.figure);
  const context = p.stepInfo ? `Step ${p.stepInfo.number}, ${p.stepInfo.label}` : p.categoryInfo.label;
  return (
    <section className="home-signature halves halves--media-left" aria-labelledby="signature-title">
      <div className="halves__media home-signature__media">
        <div className="media">
          {p.images.primary
            ? <img src={p.images.primary} alt={`${p.name} — ${p.subtitle}`} loading="lazy" decoding="async" />
            : <Placeholder title={p.name} subtitle={p.subtitle} />}
        </div>
        <span className="home-signature__frame" aria-hidden="true" />
      </div>
      <div className="halves__text">
        <p className="eyebrow">{context}</p>
        <p className="home-signature__line">{p.name}</p>
        <h2 id="signature-title" className="section-title home-signature__title">{p.subtitle}</h2>
        {p.shortDescription && <p className="home-signature__desc">{p.shortDescription}</p>}
        {figure && (
          <p className="home-signature__figure">
            <span className="numeral home-signature__num">{figure.figure}</span>
            <span className="home-signature__caption">{figure.text}</span>
          </p>
        )}
        <div className="section__actions home-signature__actions">
          <ButtonLink to={`/products/${p.slug}`} variant="light">View product</ButtonLink>
        </div>
      </div>
    </section>
  );
}
