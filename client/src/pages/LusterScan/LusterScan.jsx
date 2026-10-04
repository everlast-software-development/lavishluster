import Seo from '../../components/ui/Seo.jsx';
import Section from '../../components/ui/Section.jsx';
import PageHero from '../../components/ui/PageHero.jsx';
import Feature from '../../components/ui/Feature.jsx';
import LusterScanSteps from '../../components/sections/LusterScanSteps.jsx';
import ConsultationCta from '../../components/sections/ConsultationCta.jsx';
import { lusterscanPage } from '../../data/content/lusterscan.js';
import { integrations } from '../../data/config/integrations.js';

/**
 * LusterScan AI — content-source/website-content.md, section 7. The CTA is
 * "Request a Consultation" until the app/API integration is supplied
 * (features.lusterscanIntegration); the welcome video stays off.
 */
export default function LusterScan() {
  const { hero, what, analyzes, features, disclaimer, cta } = lusterscanPage;
  return (
    <>
      <Seo title="LusterScan AI" description={what.text} path="/lusterscan-ai" />
      <PageHero kicker={hero.eyebrow} title={hero.title} image="lusterscan">
        <Feature flag="lusterscanIntegration" data={integrations.lusterscan.appUrl}>
          <div className="hero__actions">
            <a className="btn btn--primary" href={integrations.lusterscan.appUrl}>Start LusterScan AI</a>
          </div>
        </Feature>
      </PageHero>

      <Section id="what" title={what.title} layout="stack" tone="white" lead={what.text}>
        <LusterScanSteps />
      </Section>

      <Section id="analyzes" title={analyzes.title}>
        <ul className="term-list">
          {analyzes.items.map((t) => <li key={t}>{t}</li>)}
        </ul>
        <ul className="hairline-list capabilities">
          {features.map((f) => <li key={f}>{f}</li>)}
        </ul>
      </Section>

      <Feature flag="lusterscanVideo" data={integrations.lusterscan.videoUrl}>
        <Section id="video" title="Welcome video" layout="stack">
          <div className="video-frame">
            <iframe src={integrations.lusterscan.videoUrl} title="LusterScan AI welcome video" loading="lazy" allowFullScreen />
          </div>
        </Section>
      </Feature>

      <Section id="note" layout="stack">
        <p className="note">{disclaimer}</p>
      </Section>

      <ConsultationCta cta={cta} />
    </>
  );
}
