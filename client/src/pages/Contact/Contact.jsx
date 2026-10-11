import Seo from '../../components/ui/Seo.jsx';
import BrandImage from '../../components/ui/BrandImage.jsx';
import Breadcrumb from '../../components/ui/Breadcrumb.jsx';
import { contact } from '../../data/content/contact.js';
import InquiryForm from './InquiryForm.jsx';
import './Contact.css';

const pad = (n) => String(n).padStart(2, '0');

/**
 * Contact — The Science page's patterns: hero pearl (full-bleed store photo under the shared left pearl
 * scrim) → Contact Information white (editorial rows) → Send an Enquiry pearl (centred column) → footer.
 * Every string is unchanged; the row numbers are the only additions. The map is reached only through
 * "Open in Google Maps" (no embedded map).
 */
export default function Contact() {
  const rows = [
    { label: 'Email', value: <a className="ct-row__link" href={`mailto:${contact.email}`}>{contact.email}</a> },
    {
      label: 'Location',
      value: (
        <>
          <address className="ct-row__address">{contact.addressDisplay}</address>
          <a className="text-link ct-row__maps" href={contact.mapsUrl} target="_blank" rel="noopener noreferrer">Open in Google Maps</a>
        </>
      ),
    },
    contact.phone && { label: 'Phone', value: <a className="ct-row__link" href={`tel:${contact.phone.replace(/\s/g, '')}`}>{contact.phone}</a> },
    contact.openingHours && { label: 'Opening hours', value: <p className="ct-row__address">{contact.openingHours}</p> },
  ].filter(Boolean);

  return (
    <>
      <Seo title="Contact" description={`${contact.addressDisplay}. ${contact.email}`} path="/contact" />

      {/* Hero (pearl): the store, full-bleed, under the shared left-side pearl scrim */}
      <section className="ct-hero" aria-labelledby="ct-title">
        <div className="ct-hero__media hero-scrim--left">
          <BrandImage name="contact" alt="" eager sizes="100vw" className="ct-hero__photo" />
        </div>
        <div className="container ct-hero__inner">
          <div className="ct-hero__text">
            <Breadcrumb to="/contact" className="ct-hero__crumbs" />
            <h1 id="ct-title" className="ct-hero__title">Contact</h1>
          </div>
        </div>
      </section>

      {/* Contact Information (white): editorial rows */}
      <section id="details" className="ct-band ct-info" aria-labelledby="details-title">
        <div className="container">
          <h2 id="details-title" className="home-title ct-h2">Contact Information</h2>
          <dl className="ct-rows">
            {rows.map((r, i) => (
              <div key={r.label} className="ct-row">
                <dt className="ct-row__label">
                  <span className="home-eyebrow ct-row__num" aria-hidden="true">{pad(i + 1)}</span>
                  {r.label}
                </dt>
                <dd className="ct-row__value">{r.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Send an Enquiry (pearl): a centred 760px column */}
      <section id="inquiry" className="ct-band ct-enquiry" aria-labelledby="inquiry-title">
        <div className="container">
          <div className="ct-enquiry__col">
            <span className="ct-enquiry__line" aria-hidden="true" />
            <h2 id="inquiry-title" className="home-title ct-h2">Send an enquiry</h2>
            <InquiryForm />
          </div>
        </div>
      </section>
    </>
  );
}
