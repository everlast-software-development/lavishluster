import { ButtonLink, TextLink } from '../ui/Links.jsx';

export default function ConsultationCta({
  title = 'Not sure which treatment is right for you?',
  secondary = null,
}) {
  return (
    <section className="cta-band" aria-labelledby="cta-title">
      <div className="container split">
        <h2 id="cta-title" className="cta-band__title">{title}</h2>
        <div className="cta-band__actions">
          <ButtonLink to="/contact?type=consultation#inquiry">Request a consultation</ButtonLink>
          {secondary && <TextLink to={secondary.to}>{secondary.label}</TextLink>}
        </div>
      </div>
    </section>
  );
}
