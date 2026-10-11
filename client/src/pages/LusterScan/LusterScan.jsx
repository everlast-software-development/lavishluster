import Seo from '../../components/ui/Seo.jsx';
import Section from '../../components/ui/Section.jsx';
import Feature from '../../components/ui/Feature.jsx';
import BrandImage from '../../components/ui/BrandImage.jsx';
import Breadcrumb from '../../components/ui/Breadcrumb.jsx';
import TitleLines from '../../components/sections/home/TitleLines.jsx';
import ConsultationCta from '../../components/sections/ConsultationCta.jsx';
import { lusterscanPage } from '../../data/content/lusterscan.js';
import { integrations } from '../../data/config/integrations.js';
import './LusterScan.css';

/** Title lines only when they join back to the verbatim title. */
const linesOf = (block) => (block.titleLines && block.titleLines.join(' ') === block.title ? block.titleLines : null);
const pad = (n) => String(n).padStart(2, '0');

/**
 * LusterScan AI — content-source/website-content.md, section 7, in a "tech-luxury" layout on the
 * site's type, colours, header and footer:
 * hero noir (the scan screen) → What is white (statement + four progress steps) → What it analyzes
 * noir (the scan image beside a 2 × 4 grid of the eight items, then the note) → Consultation.
 * The CTA stays "Request a Consultation" until the app/API integration is supplied
 * (features.lusterscanIntegration); the welcome video stays off.
 */
export default function LusterScan() {
  const { hero, what, steps, analyzes, features, disclaimer, cta } = lusterscanPage;
  // All eight analysed items in one uniform list: the six analyses, then the two features (data unchanged).
  const items = [...analyzes.items, ...features];
  const item = (text, i) => (
    <li key={text} className="ls-analysis__item">
      <span className="ls-analysis__index" aria-hidden="true">{pad(i + 1)}</span>
      <span className="ls-analysis__name">{text}</span>
    </li>
  );

  return (
    <>
      <Seo title="LusterScan AI" description={what.text} path="/lusterscan-ai" />

      {/* 1 — Hero (noir): eyebrow + H1 left, the scan screen right */}
      <section className="ls-hero on-dark" aria-labelledby="ls-title">
        <div className="container ls-hero__grid">
          <div className="ls-hero__text">
            <p className="home-eyebrow ls-hero__eyebrow">
              {hero.eyebrow}
              <span className="ls-pulse" aria-hidden="true" />
            </p>
            <TitleLines as="h1" id="ls-title" lines={linesOf(hero)} title={hero.title} className="ls-hero__title" />
            <Breadcrumb to="/lusterscan-ai" className="ls-hero__crumbs" />
            <Feature flag="lusterscanIntegration" data={integrations.lusterscan.appUrl}>
              <div className="ls-hero__actions">
                <a className="btn btn--light" href={integrations.lusterscan.appUrl}>Start LusterScan AI</a>
              </div>
            </Feature>
          </div>
          <div className="ls-screen">
            <span className="ls-screen__corner ls-screen__corner--tl" aria-hidden="true" />
            <span className="ls-screen__corner ls-screen__corner--tr" aria-hidden="true" />
            <span className="ls-screen__corner ls-screen__corner--bl" aria-hidden="true" />
            <span className="ls-screen__corner ls-screen__corner--br" aria-hidden="true" />
            <div className="ls-screen__frame">
              <BrandImage
                name="lusterscan"
                alt="A face overlaid with the LusterScan AI analysis mesh"
                eager
                sizes="(max-width: 1023px) 92vw, 48vw"
              />
              <span className="ls-screen__scan" aria-hidden="true" />
            </div>
          </div>
        </div>
      </section>

      {/* 2 — What is LusterScan AI (white): header row, then the four steps as a progress row */}
      <section id="what" className="ls-band ls-what" aria-labelledby="what-title">
        <div className="container">
          <div className="ls-what__head">
            <div className="ls-what__title-col">
              <p className="home-eyebrow">01</p>
              <TitleLines id="what-title" lines={linesOf(what)} title={what.title} className="ls-h2" />
            </div>
            <p className="ls-what__statement">{what.text}</p>
          </div>
          <ol className="ls-steps">
            {steps.map((s, i) => (
              <li key={s.title} className="ls-step" style={{ '--fill': `${(i + 1) * 25}%` }}>
                <span className="ls-step__track" aria-hidden="true" />
                <span className="numeral ls-step__num" aria-hidden="true">{pad(i + 1)}</span>
                <h3 className="ls-step__title">{s.title}</h3>
                <p className="ls-step__text">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 3 — What it analyzes (noir): the scan image + the 2 × 4 item grid, then the note */}
      <section id="analyzes" className="ls-band ls-analyzes on-dark" aria-labelledby="analyzes-title">
        <div className="container">
          <div className="ls-analyzes__head">
            <p className="ls-eyebrow-center">02</p>
            <h2 id="analyzes-title" className="home-title ls-h2">{analyzes.title}</h2>
          </div>
          <div className="ls-analysis">
            {/* The decorative scan image (hidden from assistive tech), then the eight items 2 × 4. */}
            <div className="ls-analysis__media" aria-hidden="true">
              <BrandImage name="luster-scan" alt="" sizes="(max-width: 1023px) 92vw, 25vw" />
              <span className="ls-screen__corner ls-screen__corner--tl" />
              <span className="ls-screen__corner ls-screen__corner--tr" />
              <span className="ls-screen__corner ls-screen__corner--bl" />
              <span className="ls-screen__corner ls-screen__corner--br" />
              <span className="ls-screen__scan" />
            </div>
            <ul className="ls-analysis__list">{items.map((t, i) => item(t, i))}</ul>
          </div>
          <div className="ls-note">
            <p className="ls-note__text">{disclaimer}</p>
          </div>
        </div>
      </section>

      <Feature flag="lusterscanVideo" data={integrations.lusterscan.videoUrl}>
        <Section id="video" title="Welcome video" layout="stack">
          <div className="video-frame">
            <iframe src={integrations.lusterscan.videoUrl} title="LusterScan AI welcome video" loading="lazy" allowFullScreen />
          </div>
        </Section>
      </Feature>

      <ConsultationCta cta={cta} />
    </>
  );
}
