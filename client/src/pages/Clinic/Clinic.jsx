/**
 * Clinic page — behind features.clinic (OFF at launch; route not registered).
 * Only the location is confirmed. Hero, description and treatments render
 * automatically once data/clinic/index.js is populated with confirmed content.
 */
import Seo from '../../components/ui/Seo.jsx';
import Section from '../../components/ui/Section.jsx';
import PageHero from '../../components/ui/PageHero.jsx';
import ConsultationCta from '../../components/sections/ConsultationCta.jsx';
import { Experts } from '../../components/sections/PendingSections.jsx';
import { clinic } from '../../data/clinic/index.js';
import { contact } from '../../data/content/contact.js';

export default function Clinic() {
  return (
    <>
      <Seo title="Clinic" description={clinic.intro || contact.address} path="/clinic" />
      <PageHero title="Clinic" intro={clinic.intro} />

      {clinic.treatments.length > 0 && (
        <Section id="treatments" title="Aesthetic Treatments">
          <ul className="term-list term-list--small">
            {clinic.treatments.map((t) => <li key={t.name}>{t.name}</li>)}
          </ul>
        </Section>
      )}

      <Experts />

      <Section id="location" title="Location" tone="white">
        <address className="contact-lines">
          <a href={contact.mapsUrl} target="_blank" rel="noopener noreferrer">{contact.address}</a>
        </address>
      </Section>

      <ConsultationCta />
    </>
  );
}
