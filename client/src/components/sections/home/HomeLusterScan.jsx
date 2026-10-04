import { TextLink } from '../../ui/Links.jsx';
import BrandImage from '../../ui/BrandImage.jsx';
import TitleLines from './TitleLines.jsx';
import { home } from '../../../data/content/home.js';
import './HomeLusterScan.css';

/**
 * Annotation points on the portrait, in px of the 440×550 design frame
 * (stored as percentages so they scale with the image). Keyed by the words
 * in home.lusterscan.motifLabels.
 */
const POINTS = {
  blemishes: [210, 79],
  wrinkles: [153, 136],
  imperfections: [175, 193],
  firmness: [182, 247],
};
const pct = (v, total) => `${((v / total) * 100).toFixed(3)}%`;

/** Portrait framed as a skin capture: viewfinder corners and four annotated points. */
function ScanPortrait({ labels }) {
  const notes = labels
    .filter((word) => POINTS[word])
    .sort((a, b) => POINTS[a][1] - POINTS[b][1]);
  return (
    <figure className="scan-portrait">
      <BrandImage name="lusterscan-portrait" alt="A model in a black shayla, framed as a LusterScan AI skin capture" className="scan-portrait__media" />
      <span className="scan-portrait__corner scan-portrait__corner--tl" aria-hidden="true" />
      <span className="scan-portrait__corner scan-portrait__corner--tr" aria-hidden="true" />
      <span className="scan-portrait__corner scan-portrait__corner--bl" aria-hidden="true" />
      <span className="scan-portrait__corner scan-portrait__corner--br" aria-hidden="true" />
      {notes.map((word) => (
        <span key={word} className="scan-note" style={{ '--x': pct(POINTS[word][0], 440), '--y': pct(POINTS[word][1], 550) }}>
          <span className="scan-note__line" aria-hidden="true" />
          <span className="scan-note__ring" aria-hidden="true" />
          <span className="scan-note__dot" aria-hidden="true" />
          <span className="scan-note__word">{word}</span>
        </span>
      ))}
    </figure>
  );
}

/**
 * 06 — LusterScan AI (noir). Top: text left, the annotated portrait right
 * (columns 8–12). Below: the four steps in four columns, then the note.
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
          <div className="home-scan__figure"><ScanPortrait labels={motifLabels} /></div>
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
