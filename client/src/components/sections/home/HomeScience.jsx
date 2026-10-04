import BrandImage from '../../ui/BrandImage.jsx';
import SectionHeader from '../../ui/SectionHeader.jsx';
import { TextLink } from '../../ui/Links.jsx';
import { home } from '../../../data/content/home.js';
import './HomeScience.css';

/** 05 — The Science (pearl): the device photograph left, edge to edge; content right. */
export default function HomeScience() {
  const { eyebrow, title, text, technologies, cta } = home.science;
  return (
    <section className="home-science halves halves--media-left" aria-labelledby="science-title">
      <div className="halves__media"><BrandImage name="science" className="home-science__media" /></div>
      <div className="halves__text">
        <SectionHeader id="science-title" eyebrow={eyebrow} title={title} lead={text} />
        <ul className="home-science__tech" aria-label="Beauty technologies">
          {technologies.map((t) => <li key={t}>{t}</li>)}
        </ul>
        <div className="section__actions home-science__actions">
          <TextLink to={cta.to}>{cta.label}</TextLink>
        </div>
      </div>
    </section>
  );
}
