import BrandImage from '../../ui/BrandImage.jsx';
import SectionHeader from '../../ui/SectionHeader.jsx';
import { TextLink } from '../../ui/Links.jsx';
import { home } from '../../../data/content/home.js';
import './HomeResults.css';

/**
 * 07 — Results (white): content left, photograph right, edge to edge.
 * brand/studio.webp shows studio lights and stands at every crop, so this
 * uses brand/intro.webp (verified brand photograph, not used elsewhere on Home).
 */
export default function HomeResults() {
  const { eyebrow, title, text, cta } = home.results;
  return (
    <section className="home-results halves halves--media-right" aria-labelledby="results-title">
      <div className="halves__media"><BrandImage name="intro" className="home-results__media" /></div>
      <div className="halves__text">
        <SectionHeader id="results-title" eyebrow={eyebrow} title={title} />
        <p className="home-results__body">{text}</p>
        <div className="section__actions home-results__actions">
          <TextLink to={cta.to}>{cta.label}</TextLink>
        </div>
      </div>
    </section>
  );
}
