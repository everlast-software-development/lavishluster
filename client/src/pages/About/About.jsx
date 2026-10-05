import Seo from '../../components/ui/Seo.jsx';
import BrandImage from '../../components/ui/BrandImage.jsx';
import { ButtonLink } from '../../components/ui/Links.jsx';
import TitleLines from '../../components/sections/home/TitleLines.jsx';
import { Experts } from '../../components/sections/PendingSections.jsx';
import { getBrandImage } from '../../utils/assets.js';
import { about } from '../../data/content/about.js';
import './About.css';

/** Hero title on two lines; the lines always join back to the verbatim title (otherwise one line). */
const HERO_LINES = ['Where Science', 'Meets Luxury'];

/**
 * About — content-source/website-content.md, section 6, on the Home system.
 * Hero noir (cutout over a framed panel) → Welcome pearl → Our Story white
 * (image left) → Mission & Vision noir (image right) → Core Values pearl.
 */
export default function About() {
  const { hero, welcome, story, mission, vision, values, cta } = about;
  const heroLines = HERO_LINES.join(' ') === hero.title ? HERO_LINES : [hero.title];
  const figure = getBrandImage('about-cutout');
  return (
    <>
      <Seo title="About" description={welcome.text} path="/about" />

      {/* 1 — Hero (noir) */}
      <section className="about-hero on-dark" aria-labelledby="about-title">
        <div className="about-hero__stage" aria-hidden="true" />
        {figure && <img className="about-hero__figure" src={figure} alt="" width="734" height="896" loading="eager" fetchpriority="high" decoding="async" />}
        <div className="container about-hero__inner">
          <div className="about-hero__copy">
            <p className="home-eyebrow">{hero.eyebrow}</p>
            <TitleLines as="h1" id="about-title" lines={heroLines} title={hero.title} className="about-hero__title" />
          </div>
        </div>
      </section>

      {/* 2 — Welcome (pearl) */}
      <section className="about-band about-welcome" aria-labelledby="welcome-title">
        <div className="container about-welcome__grid">
          <div className="about-welcome__text">
            <h2 id="welcome-title" className="home-title about-title">{welcome.title}</h2>
            <p className="about-welcome__body">{welcome.text}</p>
          </div>
          <div className="about-welcome__figure">
            <span className="about-welcome__frame" aria-hidden="true" />
            <BrandImage name="welcome" className="about-welcome__media" />
          </div>
        </div>
      </section>

      {/* 3 — Our Story (white), image left */}
      <section className="about-split about-story" aria-labelledby="story-title">
        <div className="about-split__media">
          <BrandImage name="story" />
          <span className="about-split__frame" aria-hidden="true" />
        </div>
        <div className="about-split__text about-story__text">
          <span className="about-story__rule" aria-hidden="true" />
          <h2 id="story-title" className="home-title about-title">{story.title}</h2>
          <p className="about-story__body">{story.text}</p>
        </div>
      </section>

      {/* 4 — Our Mission & Our Vision (noir), image right */}
      <section className="about-split about-duo on-dark" aria-labelledby="mission-title">
        <div className="about-split__text about-duo__text">
          {[mission, vision].map((block, i) => (
            <div key={block.title} className="about-duo__block">
              <span className="about-duo__num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
              <h2 id={i === 0 ? 'mission-title' : undefined} className="about-duo__title">{block.title}</h2>
              <p className="about-duo__body">{block.text}</p>
            </div>
          ))}
        </div>
        <div className="about-split__media about-duo__media">
          <BrandImage name="vision" />
          <span className="about-split__frame" aria-hidden="true" />
        </div>
      </section>

      {/* 5 — Our Core Values (pearl) */}
      <section className="about-band about-values" aria-labelledby="values-title">
        {/* One grid: title and button share the first row on desktop; below 1024px the button follows the values. */}
        <div className="container about-values__layout">
          <h2 id="values-title" className="home-title about-title about-values__heading">{values.title}</h2>
          <div className="about-values__action">
            <ButtonLink to={cta.to}>{cta.label}</ButtonLink>
          </div>
          <ol className="about-values__grid">
            {values.items.map((v, i) => (
              <li key={v.title} className="about-values__item">
                <span className="about-values__num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="about-values__title">{v.title}</h3>
                <p className="about-values__text">{v.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <Experts />
    </>
  );
}
