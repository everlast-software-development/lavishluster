import BrandImage from '../ui/BrandImage.jsx';
import { ButtonLink, TextLink } from '../ui/Links.jsx';
import { home } from '../../data/content/home.js';

/**
 * Consultation band (pearl): couple.webp on the left (edge to edge, capped
 * height), the question and the actions on the right. Title and CTA default to
 * the Consultation block of content-source/website-content.md (section 5);
 * inner pages may add their own secondary link.
 */
export default function ConsultationCta({
  title = home.consultation.title,
  cta = home.consultation.cta,
  secondary = null,
}) {
  return (
    <section className="consult halves halves--media-left" aria-labelledby="cta-title">
      <div className="halves__media"><BrandImage name="couple" /></div>
      <div className="halves__text">
        <h2 id="cta-title" className="consult__title">{title}</h2>
        <div className="section__actions">
          <ButtonLink to={cta.to}>{cta.label}</ButtonLink>
          {secondary && <TextLink to={secondary.to}>{secondary.label}</TextLink>}
        </div>
      </div>
    </section>
  );
}
