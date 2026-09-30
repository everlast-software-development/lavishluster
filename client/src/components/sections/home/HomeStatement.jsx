import masterBrand from '../../../data/content/master-brand.json';
import { site } from '../../../data/content/site.js';
import './HomeStatement.css';

/** 02 — Statement: the Master brand statement and the four pillars, centred. */
export default function HomeStatement() {
  return (
    <section className="section section--pearl home-statement" aria-labelledby="statement-title">
      <div className="container">
        <h2 id="statement-title" className="eyebrow">{masterBrand.subTagline}</h2>
        <p className="statement home-statement__text">{masterBrand.statement}</p>
        <ul className="home-statement__pillars" aria-label="Brand pillars">
          {site.pillars.items.map((p) => <li key={p}>{p}</li>)}
        </ul>
      </div>
    </section>
  );
}
