import { TextLink } from '../../ui/Links.jsx';
import { site } from '../../../data/content/site.js';
import { getBrandImage } from '../../../utils/assets.js';
import './HomeResults.css';

const studio = getBrandImage('studio');

/** 08 — Results: full-bleed studio photograph with a dark scrim, text on the left. */
export default function HomeResults() {
  return (
    <section className="home-results" aria-labelledby="results-title">
      {studio && <img className="home-results__img" src={studio} alt="" loading="lazy" decoding="async" />}
      <div className="container home-results__inner">
        <div className="home-results__text">
          <p className="eyebrow">{site.results.label.text}</p>
          <h2 id="results-title" className="section-title home-results__title">{site.results.title.text}</h2>
          <p className="home-results__body">{site.results.body.text}</p>
          <div className="section__actions">
            <TextLink to="/results" tone="light">Explore results</TextLink>
          </div>
        </div>
      </div>
    </section>
  );
}
