import { ButtonLink, TextLink } from '../../ui/Links.jsx';
import { home } from '../../../data/content/home.js';
import { getBrandImage } from '../../../utils/assets.js';
import './HomeHero.css';

const figureSrc = getBrandImage('hero-noir-figure');

/**
 * 01 — "Noir Couture" hero: flat noir, a framed stage panel on the right with
 * the cut-out figure rising above its top edge, the copy column on the left
 * and the pillars along the bottom.
 */
export default function HomeHero() {
  const { eyebrow, titleLines, text, ctas: [primary, secondary], pillars, verticalLabel, figure } = home.hero;
  return (
    <section className="home-hero" aria-labelledby="hero-title">
      <div className="home-hero__stage">
        <span className="home-hero__label" aria-hidden="true">{verticalLabel}</span>
        {figureSrc && (
          <img
            className="home-hero__figure"
            src={figureSrc}
            alt={figure.alt}
            width={figure.width}
            height={figure.height}
            loading="eager"
            fetchpriority="high"
            decoding="async"
          />
        )}
      </div>
      <div className="home-hero__inner">
        <div className="home-hero__copy">
          <p className="home-hero__eyebrow">{eyebrow}</p>
          <h1 id="hero-title" className="home-hero__title">
            {titleLines.map((line, i) => (
              <span key={line} className="home-hero__line">{line}{i < titleLines.length - 1 && ' '}</span>
            ))}
          </h1>
          <p className="home-hero__lead">{text}</p>
          <div className="home-hero__actions">
            <ButtonLink to={primary.to} variant="light" className="home-hero__btn">{primary.label}</ButtonLink>
            <TextLink to={secondary.to} className="home-hero__link">{secondary.label}</TextLink>
          </div>
        </div>
        <ul className="home-hero__pillars" aria-label="Brand pillars">
          {pillars.map((p) => <li key={p}>{p}</li>)}
        </ul>
      </div>
    </section>
  );
}
