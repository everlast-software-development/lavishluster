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
      <PageHero
        kicker="About Lavish Luster"
        title="Welcome to Lavish Luster"
        intro={site.story.text}
        aside={<BrandImage name="about" seed="about-luster" ratio={1.25} eager />}
      />

      <Section id="story" title="Our Story">
        <p className="prose-lg">{site.intro.body.text}</p>
      </Section>

      <Section id="mission-vision" title="Mission & Vision" tone="tint">
        <div className="duo">
          <div>
            <h3 className="duo__title">Our Mission</h3>
            <p className="prose">{site.mission.text}</p>
          </div>
          <div>
            <h3 className="duo__title">Our Vision</h3>
            <p className="prose">{site.vision.text}</p>
          </div>
        </div>
      </Section>

      <Section id="values" title="Our Core Values">
        <dl className="values">
          {site.values.items.map((v) => (
            <div key={v.title} className="values__item">
              <dt>{v.title}</dt>
              <dd>{v.text}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section id="pillars" kicker={masterBrand.subTagline} title={site.intro.title.text} tone="tint">
        <ul className="pillars pillars--flush" aria-label="Brand pillars">
          {site.pillars.items.map((p) => <li key={p}>{p}</li>)}
        </ul>
      </Section>

      <Experts />

      <section className="cta-band" aria-labelledby="about-cta">
        <div className="container split">
          <h2 id="about-cta" className="cta-band__title">Discover Lavish Luster</h2>
          <div className="cta-band__actions">
            <ButtonLink to="/products">Explore Products</ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
