import { Link } from 'react-router-dom';
import { contact } from '../../data/content/contact.js';
import { home } from '../../data/content/home.js';
import { features } from '../../data/config/features.js';
import { homeItem, navItems } from '../navigation/navItems.js';
import Wordmark from '../navigation/Wordmark.jsx';

const SOCIAL = [
  ['instagram', 'Instagram'],
  ['facebook', 'Facebook'],
  ['tiktok', 'TikTok'],
];

/**
 * Noir footer in the shared container: logo + brand line (4 columns) · Explore (2) ·
 * Visit (3) · Contact (3); then a hairline with © left and legal links right
 * (when enabled); the script watermark runs along the bottom edge, below the columns.
 */
export default function Footer() {
  const f = home.footer;
  const social = features.socialLinks ? SOCIAL.filter(([key]) => contact.social[key]) : [];
  return (
    <footer className="site-footer">
      <div className="container site-footer__grid">
        <div className="site-footer__brand">
          <Wordmark tone="light" className="wordmark--footer" />
          <p className="site-footer__brand-line">{f.text}</p>
        </div>
        <nav className="site-footer__col site-footer__col--explore" aria-label="Explore">
          <h2 className="site-footer__heading">{f.exploreTitle}</h2>
          <ul className="site-footer__links">
            {[homeItem, ...navItems].map((i) => <li key={i.to}><Link to={i.to}>{i.label}</Link></li>)}
          </ul>
        </nav>
        <div className="site-footer__col">
          <h2 className="site-footer__heading">{f.visitTitle}</h2>
          <address>
            <a href={contact.mapsUrl} target="_blank" rel="noopener noreferrer">{f.visit}</a>
          </address>
        </div>
        <div className="site-footer__col">
          <h2 className="site-footer__heading">{f.contactTitle}</h2>
          <address>
            <a href={`mailto:${f.contact}`}>{f.contact}</a>
            {contact.phone && <a href={`tel:${contact.phone.replace(/\s/g, '')}`}>{contact.phone}</a>}
          </address>
          {social.length > 0 && (
            <nav aria-label="Social">
              <ul className="site-footer__links site-footer__social">
                {social.map(([key, label]) => (
                  <li key={key}><a href={contact.social[key]} target="_blank" rel="noopener noreferrer">{label}</a></li>
                ))}
              </ul>
            </nav>
          )}
        </div>
      </div>
      <div className="container">
        <div className="site-footer__base">
          <p>{f.bottomLine}</p>
          {features.legalPages && (
            <nav aria-label="Legal">
              <ul className="site-footer__legal">
                <li><Link to="/privacy">Privacy Policy</Link></li>
                <li><Link to="/terms">Terms &amp; Conditions</Link></li>
              </ul>
            </nav>
          )}
        </div>
      </div>
      <span className="site-footer__watermark" aria-hidden="true" />
    </footer>
  );
}
