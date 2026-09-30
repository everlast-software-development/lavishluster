import BrandImage from '../../ui/BrandImage.jsx';
import { TextLink } from '../../ui/Links.jsx';
import { site } from '../../../data/content/site.js';
import { technologies } from '../../../data/content/science.js';
import './HomeScience.css';

/** 06 — Science, edge-to-edge 50/50. */
export default function HomeScience() {
  return (
    <section className="home-science halves halves--media-left" aria-labelledby="science-title">
      <div className="halves__media"><BrandImage name="science" /></div>
      <div className="halves__text">
        <p className="eyebrow">{site.science.label.text}</p>
        <h2 id="science-title" className="section-title home-science__title">{site.science.title.text}</h2>
        <p className="lead home-science__body">{site.science.body.text}</p>
        <ul className="home-science__tech" aria-label="Beauty technologies">
          {technologies.map((t) => <li key={t.id}>{t.label}</li>)}
        </ul>
        <div className="section__actions">
          <TextLink to="/science">Discover the science</TextLink>
        </div>
      </div>
    </section>
  );
}
