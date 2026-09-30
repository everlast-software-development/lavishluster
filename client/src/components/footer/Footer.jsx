import { Link } from 'react-router-dom';
import masterBrand from '../../data/content/master-brand.json';
import { contact } from '../../data/content/contact.js';
import { features } from '../../data/config/features.js';
import { homeItem, navItems } from '../navigation/navItems.js';
import Wordmark from '../navigation/Wordmark.jsx';

const SOCIAL = [
  ['instagram', 'Instagram'],
  ['facebook', 'Facebook'],
  ['tiktok', 'TikTok'],
];

/** Noir footer: brand statement, Explore, Visit, Contact; faint script watermark along the bottom. */
export default function Footer() {
  const social = features.socialLinks ? SOCIAL.filter(([key]) => contact.social[key]) : [];
  return (
    <footer className="site-footer">
      <div className="container site-footer__grid">
        <div className="site-footer__brand">
          <Wordmark tone="light" className="wordmark--footer" />
          <p>{masterBrand.statement}</p>
        </div>
        <nav className="site-footer__col" aria-label="Explore">
          <h2 className="site-footer__heading">Explore</h2>
          <ul className="site-footer__links">
            {[homeItem, ...navItems].map((i) => <li key={i.to}><Link to={i.to}>{i.label}</Link></li>)}
          </ul>
        </nav>
        <div className="site-footer__col">
          <h2 className="site-footer__heading">Visit</h2>
          <address>
            <a href={contact.mapsUrl} target="_blank" rel="noopener noreferrer">{contact.address}</a>
          </address>
        </div>
        <div className="site-footer__col">
          <h2 className="site-footer__heading">Contact</h2>
          <address>
            <a href={`mailto:${contact.email}`}>{contact.email}</a>
            {contact.phone && <a href={`tel:${contact.phone.replace(/\s/g, '')}`}>{contact.phone}</a>}
          </address>
        </div>
        {features.legalPages && (
          <nav className="site-footer__col" aria-label="Legal">
            <h2 className="site-footer__heading">Legal</h2>
            <ul className="site-footer__links">
              <li><Link to="/privacy">Privacy Policy</Link></li>
              <li><Link to="/terms">Terms &amp; Conditions</Link></li>
            </ul>
          </nav>
        )}
        {social.length > 0 && (
          <nav className="site-footer__col" aria-label="Social">
            <h2 className="site-footer__heading">Social</h2>
            <ul className="site-footer__links">
              {social.map(([key, label]) => (
                <li key={key}><a href={contact.social[key]} target="_blank" rel="noopener noreferrer">{label}</a></li>
              ))}
            </ul>
          </nav>
        )}
      </div>
      <div className="container site-footer__base">
        <p>© {new Date().getFullYear()} {contact.copyright}</p>
      </div>
      <span className="site-footer__watermark" aria-hidden="true" />
    </footer>
  );
}
