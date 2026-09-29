import { lusterscan } from '../../data/content/site.js';

/** The four LusterScan steps — a genuine sequence, so they are numbered. */
export default function LusterScanSteps({ headingLevel = 3 }) {
  const H = `h${headingLevel}`;
  return (
    <ol className="scan-steps">
      {lusterscan.steps.map((s, i) => (
        <li key={s.title} className="scan-steps__item">
          <span className="scan-steps__num" aria-hidden="true">{i + 1}</span>
          <H className="scan-steps__title">{s.title}</H>
          <p>{s.text}</p>
        </li>
      ))}
    </ol>
  );
}
