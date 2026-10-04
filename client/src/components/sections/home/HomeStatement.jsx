import { TextLink } from '../../ui/Links.jsx';
import BrandImage from '../../ui/BrandImage.jsx';
import TitleLines from './TitleLines.jsx';
import { home } from '../../../data/content/home.js';
import './HomeStatement.css';

/**
 * 02 — Brand Philosophy (pearl). Left (columns 1–6): eyebrow, two-line title,
 * welcome paragraph, then the label and the About link on one hairline row.
 * Right (columns 8–12): philosophy.webp at 440×550 over a gold frame offset
 * 28px up and right (the hero's motif).
 */
export default function HomeStatement() {
  const { eyebrow, title, titleLines, text, label, cta } = home.philosophy;
  return (
    <section className="home-band home-philosophy" aria-labelledby="philosophy-title">
      <div className="container home-philosophy__grid">
        <div className="home-philosophy__text">
          <p className="home-eyebrow">{eyebrow}</p>
          <TitleLines id="philosophy-title" lines={titleLines} title={title} className="home-philosophy__title" />
          <p className="home-philosophy__body">{text}</p>
          <div className="home-philosophy__row">
            <p className="home-label home-philosophy__label">{label}</p>
            <TextLink to={cta.to}>{cta.label}</TextLink>
          </div>
        </div>
        <div className="home-philosophy__figure">
          <span className="home-philosophy__frame" aria-hidden="true" />
          <BrandImage name="philosophy" alt="" className="home-philosophy__media" />
        </div>
      </div>
    </section>
  );
}
