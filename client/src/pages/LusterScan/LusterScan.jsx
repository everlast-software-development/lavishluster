import Seo from '../../components/ui/Seo.jsx';
import Section from '../../components/ui/Section.jsx';
import PageHero from '../../components/ui/PageHero.jsx';
import Feature from '../../components/ui/Feature.jsx';
import BrandImage from '../../components/ui/BrandImage.jsx';
import { TextLink } from '../../components/ui/Links.jsx';
import LusterScanSteps from '../../components/sections/LusterScanSteps.jsx';
import ConsultationCta from '../../components/sections/ConsultationCta.jsx';
import { lusterscan } from '../../data/content/site.js';
import { integrations } from '../../data/config/integrations.js';

const step = (title) => lusterscan.steps.find((s) => s.title === title);

export default function LusterScan() {
  return (
    <>
      <Seo title="LusterScan AI" description={lusterscan.description} path="/lusterscan-ai" />
      <PageHero
        kicker="LusterScan AI"
        title="Your Personal Skin Advisor"
        intro={lusterscan.description}
        aside={<BrandImage name="lusterscan" seed="lusterscan-rings" ratio={1} eager />}
      >
        <Feature flag="lusterscanIntegration" data={integrations.lusterscan.appUrl}>
          <div className="hero__actions">
            <a className="btn btn--primary" href={integrations.lusterscan.appUrl}>Start LusterScan AI</a>
          </div>
        </Feature>
      </PageHero>

      <Section id="what" title="What Is LusterScan AI?">
        <ul className="capabilities">
          {lusterscan.capabilities.map((c) => <li key={c}>{c}</li>)}
        </ul>
      </Section>

      <Section id="how" title="How It Works" tone="tint">
        <LusterScanSteps />
      </Section>

      <Section id="analyzes" title="What It Analyzes">
        <ul className="term-list">
          {lusterscan.analyzes.map((t) => <li key={t}>{t}</li>)}
        </ul>
        <p className="prose">{lusterscan.capabilities[1]}</p>
      </Section>

      <Section id="recommendations" title="Personalized Recommendations" tone="tint">
        <h3 className="minor-title">{step('Personalized Luxury Care').title}</h3>
        <p className="prose-lg">{step('Personalized Luxury Care').text}</p>
        <div className="section__actions">
          <TextLink to="/products">Explore products</TextLink>
        </div>
      </Section>

      <Section id="tracking" title="Progress Tracking">
        <p className="prose-lg">{step('Progress Tracking').text}</p>
        <p className="prose">{lusterscan.capabilities[3]}</p>
      </Section>

      <Feature flag="lusterscanVideo" data={integrations.lusterscan.videoUrl}>
        <Section id="video" title="Welcome video" layout="stack">
          <div className="video-frame">
            <iframe src={integrations.lusterscan.videoUrl} title="LusterScan AI welcome video" loading="lazy" allowFullScreen />
          </div>
        </Section>
      </Feature>

      <Section id="note">
        <p className="note">{lusterscan.disclaimer}</p>
      </Section>

      <ConsultationCta secondary={{ to: '/products', label: 'Explore products' }} />
    </>
  );
}
