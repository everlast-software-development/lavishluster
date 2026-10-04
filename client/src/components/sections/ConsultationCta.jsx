import { ButtonLink, TextLink } from '../ui/Links.jsx';
import { home } from '../../data/content/home.js';

/**
 * Consultation band (pearl), shared by Home and the inner pages: a centred
 * column — a 1px × 56px gold line, the title, then the ink button (and the
 * page's optional secondary link beside it). Title and CTA default to the
 * Consultation block of content-source/website-content.md (section 5).
 */
export default function ConsultationCta({
  title = home.consultation.title,
  titleLines = title === home.consultation.title ? home.consultation.titleLines : null,
  cta = home.consultation.cta,
  secondary = null,
}) {
  const lines = titleLines || [title];
  return (
    <section className="consult" aria-labelledby="cta-title">
      <div className="container consult__inner">
        <span className="consult__rule" aria-hidden="true" />
        <h2 id="cta-title" className="home-title consult__title">
          {lines.map((line, i) => (
            <span key={line} className="home-title__line">{line}{i < lines.length - 1 && ' '}</span>
          ))}
        </h2>
        <div className="consult__actions">
          <ButtonLink to={cta.to}>{cta.label}</ButtonLink>
          {secondary && <TextLink to={secondary.to}>{secondary.label}</TextLink>}
        </div>
      </div>
    </section>
  );
}
