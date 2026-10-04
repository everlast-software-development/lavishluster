import { TextLink } from '../../ui/Links.jsx';
import TitleLines from './TitleLines.jsx';
import { getBrandImage } from '../../../utils/assets.js';
import { home } from '../../../data/content/home.js';
import './HomeLusterScan.css';

/**
 * 06 — LusterScan AI (noir), cinematic. brand/lusterscan-cinematic.webp sits
 * behind everything on the right (its background is already noir), under a
 * left scrim and a bottom scrim. Above them: the text block (eyebrow, title,
 * text, link, note) on the left, and the four steps in a borderless row at
 * the bottom. Under 768px: image, text, steps, stacked.
 */
export default function HomeLusterScan() {
  const { eyebrow, title, titleLines, text, steps, note, cta } = home.lusterscan;
  const src = getBrandImage('lusterscan-cinematic');
  return (
    <section className="home-scan on-dark" aria-labelledby="scan-title">
      {src && (
        <div className="home-scan__media">
          <img
            className="home-scan__image"
            src={src}
            alt="A model holding a Lavish Luster cream jar against her cheek"
            width="1323"
            height="1073"
            loading="lazy"
            decoding="async"
          />
          {/* Mobile only: the image fades into noir above the text. */}
          <span className="home-scan__fade" aria-hidden="true" />
        </div>
      )}
      <span className="home-scan__scrim home-scan__scrim--left" aria-hidden="true" />
      <span className="home-scan__scrim home-scan__scrim--bottom" aria-hidden="true" />

      <div className="container home-scan__inner">
        <div className="home-scan__text">
          <p className="home-eyebrow">{eyebrow}</p>
          <TitleLines id="scan-title" lines={titleLines} title={title} className="home-scan__title" />
          <p className="home-scan__lead">{text}</p>
          <div className="home-scan__actions">
            <TextLink to={cta.to} tone="light">{cta.label}</TextLink>
          </div>
          <p className="home-scan__note">{note}</p>
        </div>
        <ol className="home-scan__steps" aria-label="How LusterScan AI works">
          {steps.map((s) => (
            <li key={s.title}>
              <span className="home-scan__num" aria-hidden="true">{s.number}</span>
              <h3 className="home-scan__step">{s.title}</h3>
              <p className="home-scan__step-text">{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
