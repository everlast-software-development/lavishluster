import { getBrandImage } from '../../utils/assets.js';

/**
 * Inner-page hero band.
 *  variant="photo": a brand photograph under a pearl scrim, ink text (default).
 *  variant="grain": the cover treatment — grey grain base and a cutout figure, white text.
 *  No image: a plain silk band.
 *  `position` sets the photo focal point (object-position) when the default crop cuts the subject.
 *  `split`: the photograph fills only the right half (for portrait images whose subjects would be
 *  cropped or sit under the text across the full band); the text keeps the left half.
 */
export default function PageHero({ title, kicker, intro, image, variant = 'photo', position, split = false, children }) {
  const src = image ? getBrandImage(image) : null;
  return (
    <header className={`page-hero page-hero--${src ? variant : 'plain'}${src && split ? ' page-hero--split' : ''}`}>
      {src && (
        <div className="page-hero__media">
          <div className="media"><img src={src} alt="" loading="eager" fetchpriority="high" decoding="async" style={position ? { objectPosition: position } : undefined} /></div>
        </div>
      )}
      <div className="container page-hero__inner">
        <div className="page-hero__text">
          {kicker && <p className="eyebrow">{kicker}</p>}
          <h1 className="page-hero__title">{title}</h1>
          {intro && <p className="page-hero__intro">{intro}</p>}
          {children}
        </div>
      </div>
    </header>
  );
}
