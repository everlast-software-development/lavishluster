import { TextLink } from '../../ui/Links.jsx';
import { home } from '../../../data/content/home.js';
import './HomeStatement.css';

/**
 * 02 — Brand Philosophy (pearl), two columns. Left: "Welcome to Lavish
 * Luster", the title and the welcome paragraph. Right: the "Smart Clinical
 * Unisex Beauty" label and the About link. The hero's statement and pillars
 * are not repeated here.
 */
export default function HomeStatement() {
  const { eyebrow, title, text, label, cta } = home.philosophy;
  return (
    <section className="home-band home-intro" aria-labelledby="intro-title">
      <div className="container home-intro__grid">
        <div className="home-intro__main">
          <p className="eyebrow">{eyebrow}</p>
          <h2 id="intro-title" className="section-title home-intro__title">{title}</h2>
          <p className="lead home-intro__statement">{text}</p>
        </div>
        <aside className="home-intro__aside" aria-label={label}>
          <span className="home-intro__rule" aria-hidden="true" />
          <p className="home-intro__label">{label}</p>
          <TextLink to={cta.to} className="home-intro__cta">{cta.label}</TextLink>
        </aside>
      </div>
    </section>
  );
}
