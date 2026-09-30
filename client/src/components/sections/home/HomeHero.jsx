import { TextLink } from '../../ui/Links.jsx';
import masterBrand from '../../../data/content/master-brand.json';
import { site } from '../../../data/content/site.js';
import { getBrandImage } from '../../../utils/assets.js';
import './HomeHero.css';

const figure = getBrandImage('closing-cutout');

/** 01 — Cover hero: grey grain, cutout figure, giant script logo, inset frame. */
export default function HomeHero() {
  return (
    <section className="home-hero" aria-labelledby="hero-title">
      {figure && (
        <div className="home-hero__figure">
          <img src={figure} alt="" loading="eager" fetchpriority="high" decoding="async" />
        </div>
      )}
      <span className="home-hero__script" aria-hidden="true" />
      <span className="home-hero__frame" aria-hidden="true" />
      <div className="container home-hero__content">
        <div className="home-hero__text">
          <p className="home-hero__eyebrow">{masterBrand.tagline}</p>
          <h1 id="hero-title" className="home-hero__title">{site.heroTitle.text}</h1>
        </div>
        <div className="home-hero__actions">
          <TextLink to="/products" tone="light">Explore products</TextLink>
          <TextLink to="/lusterscan-ai" tone="light">Discover LusterScan AI</TextLink>
        </div>
      </div>
    </section>
  );
}
