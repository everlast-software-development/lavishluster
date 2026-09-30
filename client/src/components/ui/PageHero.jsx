import { getBrandImage } from '../../utils/assets.js';

/**
 * Inner-page hero band.
 *  variant="photo": a brand photograph under a pearl scrim, ink text (default).
 *  variant="grain": the cover treatment — grey grain base and a cutout figure, white text.
 *  No image: a plain silk band.
 */
export default function PageHero({ title, kicker, intro, image, variant = 'photo', children }) {
  const src = image ? getBrandImage(image) : null;
  return (
    <header className={`page-hero page-hero--${src ? variant : 'plain'}`}>
      {src && (
        <div className="page-hero__media">
          <div className="media"><img src={src} alt="" loading="eager" fetchpriority="high" decoding="async" /></div>
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
