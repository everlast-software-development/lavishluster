import { getBrandImage, getBrandSrcSet } from '../../../utils/assets.js';
import Breadcrumb from '../../ui/Breadcrumb.jsx';
import './AboutHero.css';

/**
 * About hero (noir, centred editorial composition). One <h1> reading
 * "Where Science Meets Luxury": its two lines sit either side of the portrait
 * (the h1 is `display: contents` inside the three-column row, so the portrait
 * can sit between its spans without breaking the heading). Each line's first
 * word is set small, the second at full size. Then a breadcrumb. The chapter
 * index that reads as the hero's last row is AboutIndex (rendered right after,
 * so it can stay sticky through the sections).
 *
 * Props: eyebrow, title, titleLines (must join back to title).
 */
/** The hero portrait: brand/gallery-2.webp (1024×1024), cropped to 360:470 around the face. */
const PORTRAIT = 'gallery-2';

export default function AboutHero({ eyebrow, title, titleLines }) {
  const lines = titleLines && titleLines.join(' ') === title ? titleLines : null;
  const portrait = getBrandImage(PORTRAIT);
  const portraitSet = getBrandSrcSet(PORTRAIT);
  // "Where Science" → small "Where", large "Science".
  const split = (line) => { const i = line.indexOf(' '); return [line.slice(0, i), line.slice(i + 1)]; };

  return (
    <section className="about-hero on-dark" aria-labelledby="about-title">
      <div className="container about-hero__inner">
        <p className="about-hero__eyebrow">{eyebrow}</p>

        <div className="about-hero__row">
          {lines ? (
            <h1 id="about-title" className="about-hero__title">
              {lines.map((line, i) => {
                const [small, large] = split(line);
                return (
                  <span key={line} className={`about-hero__side about-hero__side--${i === 0 ? 'left' : 'right'}`}>
                    {i === 1 && <span className="about-hero__rule" aria-hidden="true" />}
                    <span className="about-hero__small">{small}</span>{' '}
                    <span className={`about-hero__large${i === 1 ? ' about-hero__large--gold' : ''}`}>{large}</span>
                    {i === 0 && <span className="about-hero__rule" aria-hidden="true" />}
                    {i === 0 && ' '}
                  </span>
                );
              })}
            </h1>
          ) : (
            <h1 id="about-title" className="about-hero__title about-hero__title--single">{title}</h1>
          )}
          <figure className="about-hero__portrait">
            <span className="about-hero__frame" aria-hidden="true" />
            {portrait && (
              <img
                src={portrait}
                srcSet={portraitSet || undefined}
                sizes="(max-width: 639px) min(78vw, 300px), (max-width: 1023px) 340px, 360px"
                alt="A model with her eyes closed, one hand at her neck, in warm side light"
                width="1024" height="1024" loading="eager" fetchpriority="high" decoding="async"
              />
            )}
          </figure>
        </div>

        <Breadcrumb to="/about" className="about-hero__crumbs" />
      </div>
    </section>
  );
}
