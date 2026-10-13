import { useId, useState } from 'react';
import { Link } from 'react-router-dom';
import Seo from '../../components/ui/Seo.jsx';
import BrandImage from '../../components/ui/BrandImage.jsx';
import Breadcrumb from '../../components/ui/Breadcrumb.jsx';
import { TextLink } from '../../components/ui/Links.jsx';
import TitleLines from '../../components/sections/home/TitleLines.jsx';
import ConsultationCta from '../../components/sections/ConsultationCta.jsx';
import { sciencePage, technologies } from '../../data/content/science.js';
import { about } from '../../data/content/about.js';
import { lusterscanPage } from '../../data/content/lusterscan.js';
import { resultsPage } from '../../data/content/results.js';
import { catalogHref, getProduct, ingredientIndex, productsInCategory } from '../../data/catalog.js';
import './Science.css';
import nb, { useCompact } from '../../components/ui/nb.jsx';

const value = (title) => about.values.items.find((v) => v.title === title);
const pad = (n) => String(n).padStart(2, '0');
/** Title lines only when they join back to the verbatim title. */
const linesOf = (block) => (block.titleLines && block.titleLines.join(' ') === block.title ? block.titleLines : null);
/** "Pharmaceutical-Grade Formulations" → "Pharmaceutical-" / "Grade Formulations" (the text content stays verbatim). */
const hyphenLines = (title) => { const i = title.indexOf('-'); return i > 0 ? [title.slice(0, i + 1), title.slice(i + 1)] : [title]; };

/** Concentration scale: 0–5%; dots at the data's own values (rounded to whole percent, clamped to 0–5). */
const SCALE_MAX = 5;
const scaleMarks = [...new Set(ingredientIndex.flatMap((ing) => ing.entries.map((e) => e.concentration)).filter(Boolean)
  .map((c) => Math.min(SCALE_MAX, Math.max(0, Math.round(parseFloat(c))))).filter((n) => Number.isFinite(n)))].sort((a, b) => a - b);
const TICKS = Array.from({ length: 26 }, (_, i) => i * 4);   // every 4% of the width; majors every 20%

const byName = (a, b) => a.name.localeCompare(b.name, 'en', { sensitivity: 'base' });
/**
 * The ingredient index (ingredient → products + percentages, unchanged in the data) regrouped by product
 * at render time: [{ slug, name, ingredients: [{ name, concentration }] }], products and their ingredients
 * alphabetical. Names are passed through exactly as they are in the data.
 */
function groupIngredientsByProduct(index) {
  const products = new Map();
  for (const ing of index) {
    for (const e of ing.entries) {
      if (!products.has(e.slug)) products.set(e.slug, { slug: e.slug, name: e.name, ingredients: [] });
      products.get(e.slug).ingredients.push({ name: ing.name, concentration: e.concentration });
    }
  }
  return [...products.values()].map((p) => ({ ...p, ingredients: [...p.ingredients].sort(byName) })).sort(byName);
}
const ingredientsByProduct = groupIngredientsByProduct(ingredientIndex);
if (import.meta.env.DEV) {
  const pairs = ingredientsByProduct.reduce((n, p) => n + p.ingredients.length, 0);
  const sourcePairs = ingredientIndex.reduce((n, i) => n + i.entries.length, 0);
  const ingredients = new Set(ingredientsByProduct.flatMap((p) => p.ingredients.map((i) => i.name))).size;
  console.info(`[science] ingredients ${ingredients}/${ingredientIndex.length} · products ${ingredientsByProduct.length} · pairs ${pairs}/${sourcePairs}`);
}

/** The two text rows: eyebrow + title left, paragraph right; the title lines are joined back with a space only where the source has one. */
function Row({ id, number, lines, text }) {
  const compact = useCompact();
  const hyphenPair = compact && lines.length === 2 && lines[0].endsWith('-');
  const firstWord = hyphenPair ? lines[1].split(' ')[0] : '';
  return (
    <article id={id} className="sci-row" aria-labelledby={`${id}-title`}>
      <div className="sci-row__head">
        <p className="home-eyebrow">{number}</p>
        <h2 id={`${id}-title`} className="home-title sci-h2 sci-row__title">
          {hyphenPair ? (
            // Below 1024px: "Pharmaceutical-" + "Grade" kept whole on one line (the desktop lines break after the hyphen).
            <span className="home-title__line"><span className="nb">{lines[0]}{firstWord}</span>{lines[1].slice(firstWord.length)}</span>
          ) : lines.map((line, i) => (
            <span key={line} className="home-title__line">{nb(line)}{i < lines.length - 1 && !line.endsWith('-') && ' '}</span>
          ))}
        </h2>
      </div>
      <p className="sci-row__text">{text}</p>
    </article>
  );
}

/**
 * Active Ingredients, one product. Desktop: the product name (a link) above its ingredient list, always open.
 * Below 768px: an accordion row: a button (the name and the number of ingredients) toggles the list (a labelled
 * region). Collapsed lists are hidden by CSS only, so every ingredient stays in the HTML. The first is open.
 */
function IngredientProduct({ p, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen);
  const uid = useId();
  const btnId = `${uid}-btn`, panelId = `${uid}-panel`;
  const href = `/products/${p.slug}`;
  return (
    <li className={`sci-prod${open ? ' is-open' : ''}`}>
      <h3 className="sci-prod__name">
        <Link to={href} className="sci-prod__link">{nb(p.name)}</Link>
        <button type="button" id={btnId} className="sci-prod__toggle" aria-expanded={open} aria-controls={panelId} onClick={() => setOpen((v) => !v)}>
          <span className="sci-prod__toggle-name">{nb(p.name)}</span>
          <span className="sci-prod__count">{p.ingredients.length}</span>
          <span className="sci-prod__chevron" aria-hidden="true" />
        </button>
      </h3>
      <div id={panelId} role="region" aria-labelledby={btnId} className="sci-prod__panel">
        <span className="sci-prod__rule" aria-hidden="true" />
        <ul className="sci-prod__ings">
          {p.ingredients.map((ing) => (
            <li key={ing.name}>
              <span className="sci-prod__ing">{ing.name}</span>
              {ing.concentration && <span className="sci-prod__pct">{ing.concentration}</span>}
            </li>
          ))}
        </ul>
        <TextLink to={href} tone="light" className="sci-prod__more">View product</TextLink>
      </div>
    </li>
  );
}

/**
 * The Science — content-source/website-content.md, section 8. Every string comes from the content
 * files (science.js, about.js values, results.js, lusterscan.js, the catalog); numbers 01–08 and the
 * scale labels are the only additions. Hero pearl → rows white → Active Ingredients noir → Clinical
 * Evidence white → Beauty Technology noir → AI Technology white → Consultation (shared).
 * Images: brand/science-hero.png (hero, full-bleed under the shared scrim), brand/lavish-luster-2-1.webp (AI Technology).
 */
export default function Science() {
  const { hero } = sciencePage;
  const deviceCount = productsInCategory('beauty-devices').length;

  return (
    <>
      <Seo title="The Science" description={hero.text} path="/science" />

      {/* Hero (pearl): the Body Slim X4 scene full-bleed, under the shared left-side pearl scrim */}
      <section className="sci-hero m-hero m-hero--light" aria-labelledby="sci-title">
        <div className="sci-hero__media hero-scrim--left m-hero__media">
          <BrandImage name="science-hero" alt="The Lavish Luster Tech Body Slim X4 on a white plinth" eager sizes="(max-width: 1023px) 160vh, 100vw" className="sci-hero__device" />
        </div>
        <div className="container sci-hero__inner m-hero__body">
          <div className="sci-hero__text">
            <Breadcrumb to="/science" className="sci-hero__crumbs" />
            <TitleLines as="h1" id="sci-title" lines={linesOf(hero)} title={hero.title} className="sci-hero__title" />
            <p className="sci-hero__sub">{hero.text}</p>
          </div>
        </div>
      </section>

      {/* 01 · 02 (white): two full-width rows */}
      <section className="sci-band sci-rows">
        <div className="container">
          <Row id="formulations" number="01" lines={hyphenLines(sciencePage.formulations)} text={value('Precision & Efficacy').text} />
          <Row id="biotechnology" number="02" lines={[sciencePage.biotechnology]} text={value('Biotechnological Innovation').text} />
        </div>
      </section>

      {/* 03 · Active Ingredients (noir): the concentration scale, then every ingredient with every product */}
      <section id="ingredients" className="sci-band sci-ings on-dark" aria-labelledby="ingredients-title">
        <div className="container">
          <p className="home-eyebrow">03</p>
          <h2 id="ingredients-title" className="home-title sci-h2">{sciencePage.ingredients}</h2>

          <div className="sci-scale" aria-hidden="true">
            <div className="sci-scale__marks">
              {scaleMarks.map((m) => <span key={m} className="sci-scale__mark" style={{ '--p': m / SCALE_MAX * 100 }} />)}
            </div>
            <div className="sci-scale__ruler">
              {TICKS.map((t) => <span key={t} className={`sci-scale__tick${t % 20 === 0 ? ' sci-scale__tick--major' : ''}`} style={{ '--p': t }} />)}
            </div>
            <div className="sci-scale__labels">
              {Array.from({ length: SCALE_MAX + 1 }, (_, i) => <span key={i} className="sci-scale__label" style={{ '--p': i * 20 }}>{i}%</span>)}
            </div>
          </div>

          {/* Grouped by product (derived at render time from the ingredient index). */}
          <ul className="sci-ings__grid">
            {ingredientsByProduct.map((p, i) => <IngredientProduct key={p.slug} p={p} defaultOpen={i === 0} />)}
          </ul>
        </div>
      </section>

      {/* 04 · Clinical Evidence (white, centred) */}
      <section id="evidence" className="sci-band sci-evidence" aria-labelledby="evidence-title">
        <div className="container sci-evidence__inner">
          <p className="sci-eyebrow-center">04</p>
          <h2 id="evidence-title" className="home-title sci-h2">{sciencePage.evidence}</h2>
          <p className="sci-evidence__text">{resultsPage.hero.text}</p>
          <div className="sci-evidence__action"><TextLink to="/results">Explore Results</TextLink></div>
        </div>
      </section>

      {/* 05 · Beauty Technology (noir): 4 × 2 grid */}
      <section id="technology" className="sci-band sci-tech on-dark" aria-labelledby="technology-title">
        <div className="container">
          <div className="sci-tech__head">
            <div>
              <p className="home-eyebrow">05</p>
              <h2 id="technology-title" className="home-title sci-h2">{sciencePage.technology}</h2>
            </div>
            <TextLink to={catalogHref('beauty-devices')} className="sci-tech__all">View all {deviceCount} beauty devices</TextLink>
          </div>
          <ul className="sci-tech__grid">
            {technologies.map((t, i) => (
              <li key={t.id} className="sci-tech__cell" style={{ '--tone': `var(--c-tone-${i + 1})` }}>
                <span className="sci-tech__bar" aria-hidden="true" />
                <div className="sci-tech__body">
                  <div className="sci-tech__top">
                    <h3 className="sci-tech__name">{t.label}</h3>
                    <span className="sci-tech__index" aria-hidden="true">{pad(i + 1)}</span>
                  </div>
                  <ul className="sci-tech__devices">
                    {t.devices.map((d) => {
                      const p = getProduct(d.slug);
                      return (
                        <li key={d.slug}>
                          <Link to={`/products/${p.slug}`} className="sci-tech__device">{nb(p.name)}</Link>
                          <span className="sci-tech__desc">{d.phrase}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 06 · AI Technology (white): overlap — a large image, a white text panel over its right edge */}
      <section id="ai" className="sci-band sci-ai" aria-labelledby="ai-title">
        <div className="container">
          <div className="sci-overlap">
            <div className="sci-overlap__media">
              <BrandImage name="lavish-luster-2-1" alt="A model applying cream to her cheek, holding a gold Lavish Luster jar" sizes="(max-width: 1023px) min(92vw, 560px), 560px" />
            </div>
            <div className="sci-overlap__panel">
              <p className="sci-ai__eyebrow">
                <span>06</span>
                <span className="sci-ai__rule" aria-hidden="true" />
                <span>{lusterscanPage.hero.eyebrow}</span>
              </p>
              <h2 id="ai-title" className="home-title sci-h2">{sciencePage.ai}</h2>
              <p className="sci-ai__body">{lusterscanPage.what.text}</p>
              <div className="sci-overlap__action"><TextLink to="/lusterscan-ai">Explore LusterScan AI</TextLink></div>
            </div>
          </div>
        </div>
      </section>

      {/* Certifications: pending (V-04) — rendered from device data once features.certifications is on. */}

      <ConsultationCta />
    </>
  );
}
