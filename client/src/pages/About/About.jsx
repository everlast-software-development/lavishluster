import Seo from '../../components/ui/Seo.jsx';
import BrandImage from '../../components/ui/BrandImage.jsx';
import Icon from '../../components/ui/Icon.jsx';
import { ButtonLink } from '../../components/ui/Links.jsx';
import TitleLines from '../../components/sections/home/TitleLines.jsx';
import AboutHero from '../../components/sections/about/AboutHero.jsx';
import AboutIndex from '../../components/sections/about/AboutIndex.jsx';
import { Experts } from '../../components/sections/PendingSections.jsx';
import { about } from '../../data/content/about.js';
import './About.css';

/** Title lines only when they join back to the verbatim title. */
const linesOf = (block) => (block.titleLines && block.titleLines.join(' ') === block.title ? block.titleLines : null);
/**
 * One Mission/Vision column: a decorative letter (aria-hidden, not copy) and a hairline, the title,
 * a gold rule, and the paragraph pinned to the bottom of the column.
 */
const renderMvColumn = (block, letter, id, modifier) => (
  <div className={`about-mv__col ${modifier}`}>
    <div className="about-mv__top">
      <span className="about-mv__letter" aria-hidden="true">{letter}</span>
      <span className="about-mv__line" aria-hidden="true" />
    </div>
    <h2 id={id} className="about-h2 about-mv__title">{block.title}</h2>
    <span className="about-mv__rule" aria-hidden="true" />
    <p className="about-body about-mv__body">{block.text}</p>
  </div>
);

/**
 * About — content-source/website-content.md, section 6. Every string comes from about.js
 * (numbers, roman numerals and the Home/About nav labels are the only additions).
 * Hero noir → Welcome pearl → Our Story noir → Mission & Vision white → Core Values pearl.
 * Images: hero brand/gallery-2, Welcome lavish-luster-1-1 + lavish-luster-3, Our Story story,
 * Mission & Vision lavishluster-6, Core Values the Cell-Revive Exosome portrait (Whisk_598b…).
 */
export default function About() {
  const { hero, welcome, story, mission, vision, values, cta } = about;
  const chapters = [
    { id: 'welcome', number: '01', labels: [welcome.title] },
    { id: 'our-story', number: '02', labels: [story.title] },
    { id: 'mission-vision', number: '03', labels: [mission.title, vision.title] },
    { id: 'core-values', number: '04', labels: [values.title] },
  ];

  return (
    <>
      <Seo title="About" description={welcome.text} path="/about" />
      <AboutHero eyebrow={hero.eyebrow} title={hero.title} titleLines={hero.titleLines} />

      {/* The chapter index and the four sections: the index's sticky container ends with Core Values. */}
      <div className="about-chapters">
      <AboutIndex chapters={chapters} />

      {/* 2 — Welcome (pearl): text cols 1–5, collage cols 7–12 */}
      <section id="welcome" className="about-band about-welcome" aria-labelledby="welcome-title">
        <div className="container about-welcome__grid">
          <div className="about-welcome__text">
            <p className="home-eyebrow">01</p>
            <TitleLines id="welcome-title" lines={linesOf(welcome)} title={welcome.title} className="about-h2" />
            <p className="about-body">{welcome.text}</p>
          </div>
          <div className="about-collage">
            <div className="about-collage__main">
              <span className="about-collage__frame" aria-hidden="true" />
              <BrandImage
                name="lavish-luster-1-1"
                alt="A model holding a Lavish Luster cream jar beside her face"
                sizes="(max-width: 1023px) 76vw, 30vw"
                className="about-zoom"
              />
            </div>
            <div className="about-collage__inset">
              <BrandImage name="lavish-luster-3" alt="Hands holding a pink Lavish Luster case" sizes="(max-width: 1023px) 40vw, 16vw" className="about-zoom" />
            </div>
          </div>
        </div>
      </section>

      {/* 3 — Our Story (noir), edge-to-edge halves, image left */}
      <section id="our-story" className="halves halves--media-left section--noir on-dark about-story" aria-labelledby="story-title">
        <div className="halves__media">
          <BrandImage name="story" alt="Lavish Luster products on a marble vanity beside white orchids" sizes="(max-width: 1023px) 100vw, 50vw" className="about-zoom" />
        </div>
        <div className="halves__text about-story__text">
          <p className="home-eyebrow">02</p>
          <h2 id="story-title" className="home-title about-h2">{story.title}</h2>
          <p className="about-body">{story.text}</p>
          <nav className="about-story__links" aria-label={story.title}>
            <a className="text-link" href="#mission-vision">{vision.title}</a>
            <span aria-hidden="true">·</span>
            <a className="text-link" href="#mission-vision">{mission.title}</a>
            <span aria-hidden="true">·</span>
            <a className="text-link" href="#core-values">{values.title}</a>
          </nav>
        </div>
      </section>

      {/* 4 — Mission & Vision (white): centred "03", then the triptych Mission | portrait | Vision */}
      <section id="mission-vision" className="about-band about-mv" aria-labelledby="mission-title">
        <div className="container">
          <p className="about-eyebrow-center">03</p>
          <div className="about-mv__tri">
            {renderMvColumn(mission, 'M', 'mission-title', 'about-mv__col--mission')}
            <figure className="about-mv__portrait">
              <BrandImage
                name="gallery-6"
                alt="A model in a black blazer holding a pink Lavish Luster box"
                sizes="(max-width: 639px) 92vw, (max-width: 1023px) 400px, 380px"
              />
            </figure>
            {renderMvColumn(vision, 'V', undefined, 'about-mv__col--vision')}
          </div>
        </div>
      </section>

      {/* 5 — Our Core Values (pearl): header, image, button in cols 1–4; values in cols 6–12 */}
      <section id="core-values" className="about-band about-values" aria-labelledby="values-title">
        <div className="container about-values__grid">
          <div className="about-values__head">
            <p className="home-eyebrow">04</p>
            <TitleLines id="values-title" lines={linesOf(values)} title={values.title} className="about-h2" />
          </div>
          <div className="about-values__portrait">
            <span className="about-values__frame" aria-hidden="true" />
            <BrandImage
              name="Whisk_598b965e208cc0b9d56476c9de3bcf96dr copy"
              alt="A model holding a bottle of Luster Cell-Revive Exosome beside her face"
              sizes="(max-width: 1023px) min(92vw, 480px), 28vw"
              className="about-zoom"
            />
          </div>
          <ol className="about-values__list">
            {values.items.map((v, i) => (
              <li key={v.title} className="about-values__item">
                <span className="numeral about-values__num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="about-values__title">{v.title}</h3>
                <p className="about-values__text">{v.text}</p>
              </li>
            ))}
          </ol>
          <div className="about-values__action">
            <ButtonLink to={cta.to} className="about-values__btn">
              {cta.label}
              <Icon name="arrow" className="about-values__arrow" />
            </ButtonLink>
          </div>
        </div>
      </section>
      </div>

      <Experts />
    </>
  );
}
