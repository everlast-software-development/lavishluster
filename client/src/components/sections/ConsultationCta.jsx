import BrandImage from '../ui/BrandImage.jsx';
import { ButtonLink, TextLink } from '../ui/Links.jsx';

/** Consultation band: couple.webp on the left, the question and the button on the right. */
export default function ConsultationCta({
  title = 'Not sure which treatment is right for you?',
  secondary = null,
}) {
  return (
    <section className="consult halves halves--media-left" aria-labelledby="cta-title">
      <div className="halves__media"><BrandImage name="couple" /></div>
      <div className="halves__text">
        <h2 id="cta-title" className="consult__title">{title}</h2>
        <div className="section__actions">
          <ButtonLink to="/contact?type=consultation#inquiry">Request a consultation</ButtonLink>
          {secondary && <TextLink to={secondary.to}>{secondary.label}</TextLink>}
        </div>
      </div>
    </section>
  );
}
