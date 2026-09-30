import BrandImage from '../../ui/BrandImage.jsx';
import { TextLink } from '../../ui/Links.jsx';
import { lusterscan } from '../../../data/content/site.js';
import './HomeLusterScan.css';

/** 07 — LusterScan AI (noir). Step names only; the full explanation lives on /lusterscan-ai. */
export default function HomeLusterScan() {
  return (
    <section className="section section--noir home-scan" aria-labelledby="scan-title">
      <div className="container">
        <div className="home-scan__intro">
          <div>
            <p className="eyebrow">{lusterscan.label.text}</p>
            <h2 id="scan-title" className="section-title home-scan__title">{lusterscan.homeTitle}</h2>
            <p className="lead home-scan__desc">{lusterscan.description}</p>
          </div>
          <BrandImage name="lusterscan" ratio={1} className="home-scan__media" />
        </div>
        <ol className="home-scan__steps" aria-label="How LusterScan AI works">
          {lusterscan.steps.map((s, i) => (
            <li key={s.title}>
              <span className="home-scan__num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
              <span className="home-scan__step">{s.title}</span>
            </li>
          ))}
        </ol>
        <p className="note home-scan__note">{lusterscan.disclaimer}</p>
        <div className="section__actions home-scan__actions">
          <TextLink to="/lusterscan-ai">Explore LusterScan AI</TextLink>
        </div>
      </div>
    </section>
  );
}
