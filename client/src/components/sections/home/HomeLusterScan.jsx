import BrandImage from '../../ui/BrandImage.jsx';
import SectionHeader from '../../ui/SectionHeader.jsx';
import { TextLink } from '../../ui/Links.jsx';
import { home } from '../../../data/content/home.js';
import './HomeLusterScan.css';

/** 06 — LusterScan AI (noir): text, note and link left; framed face right; the four steps, each with its description, below. */
export default function HomeLusterScan() {
  const { eyebrow, title, text, steps, note, cta } = home.lusterscan;
  return (
    <section className="home-band home-scan" aria-labelledby="scan-title">
      <div className="container">
        <div className="home-scan__intro">
          <div className="home-scan__text">
            <SectionHeader id="scan-title" eyebrow={eyebrow} title={title} lead={text} tone="light" />
            <p className="home-scan__note">{note}</p>
            <div className="section__actions home-scan__actions">
              <TextLink to={cta.to} tone="light">{cta.label}</TextLink>
            </div>
          </div>
          <div className="home-scan__figure">
            <span className="home-scan__frame" aria-hidden="true" />
            <BrandImage name="lusterscan" className="home-scan__media" />
          </div>
        </div>
        <ol className="home-scan__steps" aria-label="How LusterScan AI works">
          {steps.map((s) => (
            <li key={s.title}>
              <span className="numeral home-scan__num" aria-hidden="true">{s.number}</span>
              <h3 className="home-scan__step">{s.title}</h3>
              <p className="home-scan__step-text">{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
