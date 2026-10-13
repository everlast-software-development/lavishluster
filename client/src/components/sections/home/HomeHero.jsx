import { ButtonLink, TextLink } from '../../ui/Links.jsx';
import { home } from '../../../data/content/home.js';
import { getBrandImage, getBrandSrcSet } from '../../../utils/assets.js';
import './HomeHero.css';
import nb from '../../ui/nb.jsx';

// The cut-out figure (transparent WebP, 1494×1053, with 640/1100 variants). Rendered width: 261.4% of the stage
// panel on desktop (889 → 1464px), about 870–1050px below 1024px. The previous figure, brand/hero-noir-figure.webp,
// stays in the repo, unused.
const HERO_FIGURE = 'model';
const HERO_FIGURE_SIZES = '(max-width: 1023px) 1050px, (max-width: 1115px) 889px, (max-width: 1837px) 80vw, 1464px';
const figureSrc = getBrandImage(HERO_FIGURE);
const figureSrcSet = getBrandSrcSet(HERO_FIGURE);

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
            srcSet={figureSrcSet || undefined}
            sizes={figureSrcSet ? HERO_FIGURE_SIZES : undefined}
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
          <p className="home-hero__eyebrow">{nb(eyebrow)}</p>
          <h1 id="hero-title" className="home-hero__title">
            {titleLines.map((line, i) => (
              <span key={line} className="home-hero__line">{nb(line)}{i < titleLines.length - 1 && ' '}</span>
            ))}
          </h1>
          <p className="home-hero__lead">{text}</p>
          <div className="home-hero__actions">
            <ButtonLink to={primary.to} variant="light" className="home-hero__btn">{primary.label}</ButtonLink>
            <TextLink to={secondary.to} className="home-hero__link">{secondary.label}</TextLink>
          </div>
        </div>
        <ul className="home-hero__pillars" aria-label="Brand pillars">
          {pillars.map((p) => <li key={p}>{nb(p)}</li>)}
        </ul>
      </div>
    </section>
  );
}
