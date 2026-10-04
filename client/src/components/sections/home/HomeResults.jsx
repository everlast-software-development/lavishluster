import BrandImage from '../../ui/BrandImage.jsx';
import { TextLink } from '../../ui/Links.jsx';
import TitleLines from './TitleLines.jsx';
import { home } from '../../../data/content/home.js';
import './HomeResults.css';

/**
 * 07 — Results (white), edge to edge 50/50. Left: brand/results-couple.webp
 * (the same photograph heads the Results page), full height, both faces in
 * frame, with a pearl frame inset 28px. Right: eyebrow, two-line title,
 * paragraph, link. Under 1024px: image, then text.
 */
export default function HomeResults() {
  const { eyebrow, title, titleLines, text, cta } = home.results;
  return (
    <section className="home-results" aria-labelledby="results-title">
      <div className="home-results__media">
        <BrandImage name="results-couple" alt="" />
        <span className="home-results__frame" aria-hidden="true" />
      </div>
      <div className="home-results__text">
        <p className="home-eyebrow">{eyebrow}</p>
        <TitleLines id="results-title" lines={titleLines} title={title} className="home-results__title" />
        <p className="home-results__body">{text}</p>
        <div className="home-results__actions">
          <TextLink to={cta.to}>{cta.label}</TextLink>
        </div>
      </div>
    </section>
  );
}
