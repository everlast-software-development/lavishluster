import Seo from '../../components/ui/Seo.jsx';
import PageHero from '../../components/ui/PageHero.jsx';
import BrandImage from '../../components/ui/BrandImage.jsx';
import SectionHeader from '../../components/ui/SectionHeader.jsx';
import { ButtonLink } from '../../components/ui/Links.jsx';
import { Experts } from '../../components/sections/PendingSections.jsx';
import { about } from '../../data/content/about.js';

/** About — content-source/website-content.md, section 6. */
export default function About() {
  const { hero, welcome, story, mission, vision, values, cta } = about;
  return (
    <>
      <Seo title="About" description={welcome.text} path="/about" />
      <PageHero kicker={hero.eyebrow} title={hero.title} image="about-cutout" variant="grain" />

      <section className="halves halves--media-left section--pearl" aria-labelledby="welcome-title">
        <div className="halves__media"><BrandImage name="welcome" /></div>
        <div className="halves__text">
          <h2 id="welcome-title" className="section-title">{welcome.title}</h2>
          <p className="lead halves__lead">{welcome.text}</p>
        </div>
      </section>

      <section className="halves halves--media-right section--white" aria-labelledby="story-title">
        <div className="halves__media"><BrandImage name="story" /></div>
        <div className="halves__text">
          <h2 id="story-title" className="section-title">{story.title}</h2>
          <p className="lead halves__lead">{story.text}</p>
        </div>
      </section>

      <section className="halves halves--media-left section--pearl" aria-labelledby="mission-title">
        <div className="halves__media"><BrandImage name="vision" /></div>
        <div className="halves__text">
          <div className="duo">
            <div>
              <h2 id="mission-title" className="section-title about-duo__title">{mission.title}</h2>
              <p className="prose">{mission.text}</p>
            </div>
            <div>
              <h2 className="section-title about-duo__title">{vision.title}</h2>
              <p className="prose">{vision.text}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--white about-values" aria-labelledby="values-title">
        <div className="container">
          <SectionHeader id="values-title" title={values.title} />
          <ol className="values">
            {values.items.map((v, i) => (
              <li key={v.title} className="values__item">
                <span className="values__num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="values__title">{v.title}</h3>
                <p className="values__text">{v.text}</p>
              </li>
            ))}
          </ol>
          <div className="section__actions about-values__actions">
            <ButtonLink to={cta.to}>{cta.label}</ButtonLink>
          </div>
        </div>
      </section>

      <Experts />
    </>
  );
}
