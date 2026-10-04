import { Link } from 'react-router-dom';
import Seo from '../../components/ui/Seo.jsx';
import Section from '../../components/ui/Section.jsx';
import PageHero from '../../components/ui/PageHero.jsx';
import { TextLink } from '../../components/ui/Links.jsx';
import ConsultationCta from '../../components/sections/ConsultationCta.jsx';
import { sciencePage, technologies } from '../../data/content/science.js';
import { about } from '../../data/content/about.js';
import { lusterscanPage } from '../../data/content/lusterscan.js';
import { resultsPage } from '../../data/content/results.js';
import { catalogHref, getProduct, ingredientIndex, productsInCategory } from '../../data/catalog.js';

const value = (title) => about.values.items.find((v) => v.title === title);

export default function Science() {
  return (
    <>
      <Seo title="The Science" description={sciencePage.hero.text} path="/science" />
      <PageHero title={sciencePage.hero.title} intro={sciencePage.hero.text} image="science" />

      <Section id="formulations" title={sciencePage.formulations}>
        <p className="prose-lg">{value('Precision & Efficacy').text}</p>
      </Section>

      <Section id="biotechnology" title={sciencePage.biotechnology} tone="white">
        <p className="prose-lg">{value('Biotechnological Innovation').text}</p>
      </Section>

      <Section id="ingredients" title={sciencePage.ingredients}>
        <dl className="ingredient-index">
          {ingredientIndex.map((ing) => (
            <div key={ing.name} className="ingredient-index__row">
              <dt>{ing.name}</dt>
              <dd>
                <ul>
                  {ing.entries.map((e) => (
                    <li key={e.slug}>
                      <Link to={`/products/${e.slug}`}>{e.name}</Link>
                      {e.concentration && <span className="ingredient-index__pct">{e.concentration}</span>}
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section id="evidence" title={sciencePage.evidence} tone="white">
        <p className="prose-lg">{resultsPage.hero.text}</p>
        <div className="section__actions">
          <TextLink to="/results">Explore Results</TextLink>
        </div>
      </Section>

      <Section id="technology" title={sciencePage.technology}>
        <ul className="tech-list">
          {technologies.map((t) => (
            <li key={t.id} className="tech-list__item">
              <h3 className="tech-list__label">{t.label}</h3>
              <ul className="tech-list__devices">
                {t.devices.map((d) => {
                  const p = getProduct(d.slug);
                  return (
                    <li key={d.slug}>
                      <Link to={`/products/${p.slug}`}>{p.name}</Link>
                      <span>{d.phrase}</span>
                    </li>
                  );
                })}
              </ul>
            </li>
          ))}
        </ul>
        <div className="section__actions">
          <TextLink to={catalogHref('beauty-devices')}>View all {productsInCategory('beauty-devices').length} beauty devices</TextLink>
        </div>
      </Section>

      <Section id="ai" kicker={lusterscanPage.hero.eyebrow} title={sciencePage.ai} tone="white">
        <p className="prose-lg">{lusterscanPage.what.text}</p>
        <div className="section__actions">
          <TextLink to="/lusterscan-ai">Explore LusterScan AI</TextLink>
        </div>
      </Section>

      {/* Certifications: pending (V-04) — rendered from device data once features.certifications is on. */}

      <ConsultationCta />
    </>
  );
}
