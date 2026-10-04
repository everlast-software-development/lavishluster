import { TextLink } from '../../ui/Links.jsx';
import TitleLines from './TitleLines.jsx';
import { home } from '../../../data/content/home.js';
import './HomeLusterScan.css';

/** Label positions of the analysis motif (in the order of home.lusterscan.motifLabels). */
const LABELS = [
  { x: 352, y: 92, anchor: 'start' }, // wrinkles
  { x: 88, y: 92, anchor: 'end' }, // firmness
  { x: 88, y: 356, anchor: 'end' }, // blemishes
  { x: 352, y: 356, anchor: 'start' }, // imperfections
];

/** Inline analysis motif (440×440): concentric rings, a scan arc, reference dots and four labels. */
function AnalysisMotif({ labels }) {
  return (
    <svg className="home-scan__motif" viewBox="0 0 440 440" width="440" height="440" role="img" aria-label="LusterScan AI analysis motif" fill="none" stroke="currentColor">
      <circle cx="220" cy="220" r="210" strokeOpacity=".25" strokeDasharray="2 6" />
      <circle cx="220" cy="220" r="168" strokeOpacity=".45" />
      <circle cx="220" cy="220" r="112" strokeOpacity=".3" />
      <circle cx="220" cy="220" r="56" strokeOpacity=".3" />
      <path d="M220 0V440M0 220H440" strokeOpacity=".18" />
      <path d="M220 52A168 168 0 0 1 388 220" strokeWidth="1.2" />
      <g fill="currentColor" stroke="none">
        <circle cx="220" cy="220" r="3" />
        <circle cx="339" cy="101" r="3" />
        <circle cx="101" cy="101" r="2.5" fillOpacity=".8" />
        <circle cx="101" cy="339" r="2.5" fillOpacity=".8" />
        <circle cx="339" cy="339" r="2.5" fillOpacity=".8" />
      </g>
      <g className="home-scan__motif-labels" stroke="none">
        {labels.map((word, i) => (
          <text key={word} x={LABELS[i].x} y={LABELS[i].y} textAnchor={LABELS[i].anchor}>{word}</text>
        ))}
      </g>
    </svg>
  );
}

/**
 * 06 — LusterScan AI (noir). Top: text left (columns 1–6), the analysis motif
 * right (columns 8–12). Below: the four steps in four columns, then the note.
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
          <div className="home-scan__figure"><AnalysisMotif labels={motifLabels} /></div>
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
