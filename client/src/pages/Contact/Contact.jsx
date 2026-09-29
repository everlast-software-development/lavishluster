import Seo from '../../components/ui/Seo.jsx';
import Section from '../../components/ui/Section.jsx';
import PageHero from '../../components/ui/PageHero.jsx';
import { contact } from '../../data/content/contact.js';
import InquiryForm from './InquiryForm.jsx';

export default function Contact() {
  return (
    <>
      <Seo title="Contact" description={`${contact.address}. ${contact.email}`} path="/contact" />
      <PageHero title="Contact" />

      <Section id="details" title="Contact Information">
        <dl className="contact-details">
          <div>
            <dt>Email</dt>
            <dd><a href={`mailto:${contact.email}`}>{contact.email}</a></dd>
          </div>
          <div>
            <dt>Location</dt>
            <dd>
              <address>{contact.address}</address>
              <a className="text-link" href={contact.mapsUrl} target="_blank" rel="noopener noreferrer">Open in Google Maps</a>
            </dd>
          </div>
          {contact.phone && (
            <div>
              <dt>Phone</dt>
              <dd><a href={`tel:${contact.phone.replace(/\s/g, '')}`}>{contact.phone}</a></dd>
            </div>
          )}
          {contact.openingHours && (
            <div>
              <dt>Opening hours</dt>
              <dd>{contact.openingHours}</dd>
            </div>
          )}
        </dl>
      </Section>

      <section className="map" aria-label="Map">
        <div className="container">
          <div className="map__frame">
            <iframe
              src={contact.mapEmbedUrl}
              title={`Map: ${contact.address}`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      <Section id="inquiry" title="Send an enquiry" tone="tint">
        <InquiryForm />
      </Section>
    </>
  );
}
