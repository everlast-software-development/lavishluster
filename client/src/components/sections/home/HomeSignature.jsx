import { ButtonLink } from '../../ui/Links.jsx';
import BrandImage from '../../ui/BrandImage.jsx';
import { getProduct } from '../../../data/catalog.js';
import './HomeSignature.css';
import nb from '../../ui/nb.jsx';

/** Which product is the signature is a presentation choice; every value shown comes from its data. */
const SIGNATURE_SLUG = 'luster-cell-revive-exosome';

/**
 * 04 — Signature (white), edge to edge 50/50. Left: brand/signature.webp (a
 * brand photograph, not the product shot), focal point 55% 30% so the face
 * and the jar stay in frame, with a gold-light frame inset 28px. Right: step,
 * name, subtitle, description, the evidence figure and "View Product".
 */
export default function HomeSignature() {
  const p = getProduct(SIGNATURE_SLUG);
  if (!p) return null;
  const figure = p.display.evidence.find((e) => e.figure);
  const context = p.stepInfo ? `Step ${p.stepInfo.number}, ${p.stepInfo.label}` : p.categoryInfo.label;
  return (
    <section className="home-signature" aria-labelledby="signature-title">
      <div className="home-signature__media">
        <BrandImage name="signature" alt="A model holding a Lavish Luster cream jar in window light" />
        <span className="home-signature__frame" aria-hidden="true" />
      </div>
      <div className="home-signature__text">
        <p className="home-eyebrow">{context}</p>
        <p className="home-label home-signature__name">{nb(p.name)}</p>
        <h2 id="signature-title" className="home-title home-signature__title">{nb(p.subtitle)}</h2>
        {p.shortDescription && <p className="home-signature__desc">{p.shortDescription}</p>}
        {figure && (
          <p className="home-signature__figure">
            <span className="home-signature__num">{figure.figure}</span>
            <span className="home-label home-signature__caption">{figure.text}</span>
          </p>
        )}
        <div className="home-signature__actions">
          <ButtonLink to={`/products/${p.slug}`} variant="primary">View Product</ButtonLink>
        </div>
      </div>
    </section>
  );
}
