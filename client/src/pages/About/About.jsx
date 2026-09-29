import Seo from '../../components/ui/Seo.jsx';
import Section from '../../components/ui/Section.jsx';
import PageHero from '../../components/ui/PageHero.jsx';
import BrandImage from '../../components/ui/BrandImage.jsx';
import { ButtonLink } from '../../components/ui/Links.jsx';
import { Experts } from '../../components/sections/PendingSections.jsx';
import { site } from '../../data/content/site.js';

export default function About() {
  return (
    <>
      <Seo title="About" description={site.intro.body.text} path="/about" />
      <PageHero
        kicker="About Lavish Luster"
        title={site.heroTitle.text}
        aside={<BrandImage name="about" seed="about-luster" ratio={1.25} eager />}
      />

      <Section id="welcome" title="Welcome to Lavish Luster">
        <p className="prose-lg">{site.intro.body.text}</p>
      </Section>

      <Section id="story" title="Our Story" tone="tint">
        <p className="prose-lg">{site.story.text}</p>
      </Section>

      <Section id="mission" title="Our Mission">
        <p className="prose">{site.mission.text}</p>
      </Section>

      <Section id="vision" title="Our Vision">
        <p className="prose">{site.vision.text}</p>
      </Section>

      <Section id="values" title="Our Core Values" tone="tint">
        <dl className="values">
          {site.values.items.map((v) => (
            <div key={v.title} className="values__item">
              <dt>{v.title}</dt>
              <dd>{v.text}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Experts />

      <section className="cta-band" aria-labelledby="about-cta">
        <div className="container split">
          <h2 id="about-cta" className="cta-band__title">Discover Lavish Luster</h2>
          <div className="cta-band__actions">
            <ButtonLink to="/products">Explore products</ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
