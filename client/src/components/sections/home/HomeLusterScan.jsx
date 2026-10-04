import { Fragment } from 'react';
import { TextLink } from '../../ui/Links.jsx';
import BrandImage from '../../ui/BrandImage.jsx';
import TitleLines from './TitleLines.jsx';
import { home } from '../../../data/content/home.js';
import './HomeLusterScan.css';

/**
 * Portrait 480×600 (4:5) on an offset gold-light frame, crossed by a scan
 * line at 25.3% of its height. The scan label is the title of step 02; the
 * caption bar carries the four words of the text above.
 */
function ScanPortrait({ label, words }) {
  return (
    <figure className="scan-portrait">
      <span className="scan-portrait__frame" aria-hidden="true" />
      <BrandImage name="lusterscan-portrait" alt="A model in a black shayla, lit in warm studio light" className="scan-portrait__media" />
      <span className="scan-portrait__scan" aria-hidden="true">
        <span className="scan-portrait__label">{label}</span>
      </span>
      <figcaption className="scan-portrait__caption">
        {words.map((word, i) => (
          <Fragment key={word}>
            {i > 0 && <span className="scan-portrait__sep" aria-hidden="true">·</span>}
            <span className="scan-portrait__word">{word}</span>
          </Fragment>
        ))}
      </figcaption>
    </figure>
  );
}

/**
 * 06 — LusterScan AI (noir). Top: text left, the portrait right (columns
 * 8–12). Below: the four steps in four columns, then the note.
 */
export default function HomeLusterScan() {
  const { eyebrow, title, titleLines, text, steps, motifLabels, note, cta } = home.lusterscan;
  return (
    <section className="home-band home-scan on-dark" aria-labelledby="scan-title">
      <div className="container">
        <div className="home-scan__top">
          <div className="home-scan__text">
            <p className="home-eyebrow">{eyebrow}</p>
            <TitleLines id="scan-title" lines={titleLines} title={title} className="home-scan__title" />
            <p className="home-scan__lead">{text}</p>
            <div className="home-scan__actions">
              <TextLink to={cta.to} tone="light">{cta.label}</TextLink>
            </div>
          </div>
          <div className="home-scan__figure"><ScanPortrait label={steps[1].title} words={motifLabels} /></div>
        </div>
        <ol className="home-scan__steps" aria-label="How LusterScan AI works">
          {steps.map((s) => (
            <li key={s.title}>
              <span className="home-scan__num" aria-hidden="true">{s.number}</span>
              <h3 className="home-label home-scan__step">{s.title}</h3>
              <p className="home-scan__step-text">{s.text}</p>
            </li>
          ))}
        </ol>
        <p className="home-scan__note">{note}</p>
      </div>
    </section>
  );
}
