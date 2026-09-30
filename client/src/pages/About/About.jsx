import Seo from '../../components/ui/Seo.jsx';
import Section from '../../components/ui/Section.jsx';
import PageHero from '../../components/ui/PageHero.jsx';
import BrandImage from '../../components/ui/BrandImage.jsx';
import { ButtonLink } from '../../components/ui/Links.jsx';
import { Experts } from '../../components/sections/PendingSections.jsx';
import masterBrand from '../../data/content/master-brand.json';
import { site } from '../../data/content/site.js';

/** About answers one question: who is Lavish Luster? */
export default function About() {
  return (
    <>
      <Seo title="About" description={site.intro.body.text} path="/about" />
      <PageHero kicker="About Lavish Luster" title="Welcome to Lavish Luster" intro={site.story.text} image="about-cutout" variant="grain" />

      <section className="halves halves--media-left section--pearl" aria-labelledby="story-title">
        <div className="halves__media"><BrandImage name="story" /></div>
        <div className="halves__text">
          <h2 id="story-title" className="section-title">Our Story</h2>
          <p className="lead halves__lead">{site.intro.body.text}</p>
        </div>
      </section>

      <section className="halves halves--media-right section--white" aria-labelledby="mission-title">
        <div className="halves__media"><BrandImage name="vision" /></div>
        <div className="halves__text">
          <h2 id="mission-title" className="section-title">Mission &amp; Vision</h2>
          <div className="duo">
            <div>
              <h3 className="minor-title duo__title">Our Mission</h3>
              <p className="prose">{site.mission.text}</p>
            </div>
            <div>
              <h3 className="minor-title duo__title">Our Vision</h3>
              <p className="prose">{site.vision.text}</p>
            </div>
          </div>
        </div>
      </section>

      <Section id="values" title="Our Core Values" layout="stack">
        <dl className="values">
          {site.values.items.map((v) => (
            <div key={v.title} className="values__item">
              <dt>{v.title}</dt>
              <dd>{v.text}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <section className="halves halves--media-left section--white" aria-labelledby="pillars-title">
        <div className="halves__media"><BrandImage name="welcome" /></div>
        <div className="halves__text">
          <p className="eyebrow">{masterBrand.subTagline}</p>
          <h2 id="pillars-title" className="section-title halves__title">{site.intro.title.text}</h2>
          <ul className="hairline-list pillar-list" aria-label="Brand pillars">
            {site.pillars.items.map((p) => <li key={p}>{p}</li>)}
          </ul>
        </div>
      </section>

      <Experts />

      <section className="section section--pearl about-cta" aria-labelledby="about-cta">
        <div className="container about-cta__inner">
          <h2 id="about-cta" className="section-title">Discover Lavish Luster</h2>
          <ButtonLink to="/products">Explore products</ButtonLink>
        </div>
      </section>
    </>
  );
}
