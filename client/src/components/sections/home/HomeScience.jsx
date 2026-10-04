import { TextLink } from '../../ui/Links.jsx';
import TitleLines from './TitleLines.jsx';
import { home } from '../../../data/content/home.js';
import './HomeScience.css';

/**
 * 05 — The Science (pearl), no photograph. Left (columns 1–5): eyebrow,
 * two-line title, teaser, link. Right (columns 7–12): the eight technologies,
 * numbered 01–08, in a two-column hairline grid.
 */
export default function HomeScience() {
  const { eyebrow, title, titleLines, text, technologies, cta } = home.science;
  return (
    <section className="home-band home-science" aria-labelledby="science-title">
      <div className="container home-science__grid">
        <div className="home-science__text">
          <p className="home-eyebrow">{eyebrow}</p>
          <TitleLines id="science-title" lines={titleLines} title={title} className="home-science__title" />
          <p className="home-science__body">{text}</p>
          <div className="home-science__actions">
            <TextLink to={cta.to}>{cta.label}</TextLink>
          </div>
        </div>
        <ul className="home-science__tech" aria-label="Beauty technologies">
          {technologies.map((t, i) => (
            <li key={t}>
              <span className="home-science__num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
              <span className="home-science__name">{t}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
