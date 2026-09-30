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

/** LusterScan AI answers one question: how does the AI skin analysis work? */
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

      <Section id="how" title="How It Works" tone="tint">
        <LusterScanSteps />
        <div className="section__actions">
          <TextLink to="/products">Explore Products</TextLink>
        </div>
      </Section>

      <Section id="what" title="What Is LusterScan AI?">
        <ul className="capabilities">
          {lusterscan.capabilities.map((c) => <li key={c}>{c}</li>)}
        </ul>
      </Section>

      <Section id="analyzes" title="What It Analyzes">
        <ul className="term-list">
          {lusterscan.analyzes.map((t) => <li key={t}>{t}</li>)}
        </ul>
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

      <ConsultationCta secondary={{ to: '/products', label: 'Explore Products' }} />
    </>
  );
}
