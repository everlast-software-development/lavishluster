import { lusterscan } from '../../data/content/site.js';

/** The four LusterScan steps — a genuine sequence, numbered 01–04. */
export default function LusterScanSteps({ headingLevel = 3 }) {
  const H = `h${headingLevel}`;
  return (
    <ol className="scan-steps">
      {lusterscan.steps.map((s, i) => (
        <li key={s.title} className="scan-steps__item">
          <span className="scan-steps__num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
          <H className="scan-steps__title">{s.title}</H>
          <p>{s.text}</p>
        </li>
      ))}
    </ol>
  );
}
