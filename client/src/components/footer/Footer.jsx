import { Link } from 'react-router-dom';
import { contact } from '../../data/content/contact.js';
import masterBrand from '../../data/content/master-brand.json';
import { features } from '../../data/config/features.js';
import { homeItem, navItems } from '../navigation/navItems.js';
import Wordmark from '../navigation/Wordmark.jsx';
import nb from '../ui/nb.jsx';

const SOCIAL = [
  ['instagram', 'Instagram'],
  ['facebook', 'Facebook'],
  ['tiktok', 'TikTok'],
];

/**
 * Noir footer, one centred column: logo · tagline · the nav in one row
 * (legal and social links join it when their flags are on) · address and
 * email between two hairlines, split at the centre · © left, sub-tagline right.
 */
export default function Footer() {
  const social = features.socialLinks ? SOCIAL.filter(([key]) => contact.social[key]) : [];
  const links = [
    ...[homeItem, ...navItems].map((i) => ({ key: i.to, el: <Link to={i.to}>{i.label}</Link> })),
    ...(features.legalPages
      ? [
          { key: '/privacy', el: <Link to="/privacy">Privacy Policy</Link> },
          { key: '/terms', el: <Link to="/terms">Terms &amp; Conditions</Link> },
        ]
      : []),
    ...social.map(([key, label]) => ({ key, el: <a href={contact.social[key]} target="_blank" rel="noopener noreferrer">{label}</a> })),
  ];
  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <Wordmark tone="light" className="wordmark--footer" />
        <p className="site-footer__tagline">{nb(masterBrand.tagline)}</p>

        <nav className="site-footer__nav" aria-label="Footer">
          <ul>
            {links.map((l) => <li key={l.key}>{l.el}</li>)}
          </ul>
        </nav>

        <address className="site-footer__contact">
          <a className="site-footer__address" href={contact.mapsUrl} target="_blank" rel="noopener noreferrer">{contact.address}</a>
          <span className="site-footer__divider" aria-hidden="true" />
          <a className="site-footer__email" href={`mailto:${contact.email}`}>{contact.email}</a>
        </address>

        <div className="site-footer__base">
          <p className="site-footer__copy">© {new Date().getFullYear()} {contact.copyright}</p>
          <p className="site-footer__sub">{masterBrand.subTagline}</p>
        </div>
      </div>
    </footer>
  );
}
