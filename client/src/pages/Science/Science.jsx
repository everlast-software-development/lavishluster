import { Link } from 'react-router-dom';
import Seo from '../../components/ui/Seo.jsx';
import Section from '../../components/ui/Section.jsx';
import PageHero from '../../components/ui/PageHero.jsx';
import BrandImage from '../../components/ui/BrandImage.jsx';
import { TextLink } from '../../components/ui/Links.jsx';
import EvidenceLedger from '../../components/sections/EvidenceLedger.jsx';
import ConsultationCta from '../../components/sections/ConsultationCta.jsx';
import masterBrand from '../../data/content/master-brand.json';
import { site, lusterscan } from '../../data/content/site.js';
import { technologies } from '../../data/content/science.js';
import { getProduct, ingredientIndex, products, productsInCategory } from '../../data/catalog.js';

const value = (title) => site.values.items.find((v) => v.title === title);

export default function Science() {
  const formulations = products.filter((p) => !p.isDevice);
  return (
    <>
      <Seo title="The Science" description={site.science.body.text} path="/science" />
      <PageHero
        title="The Science Behind Beautiful Skin"
        intro={masterBrand.statement}
        aside={<BrandImage name="science" seed="science-thin-film" ratio={1} eager />}
      />

      <Section id="formulations" title="Pharmaceutical-Grade Formulations">
        <p className="prose-lg">{site.science.body.text}</p>
        <p className="prose">{value('Precision & Efficacy').text}</p>
      </Section>

      <Section id="biotechnology" title="Biotechnology" tone="tint">
        <p className="prose-lg">{value('Biotechnological Innovation').text}</p>
      </Section>

      <Section id="ingredients" title="Active Ingredients">
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

      <Section id="evidence" title="Clinical Evidence" tone="tint">
        <EvidenceLedger products={formulations} compact />
        <div className="section__actions">
          <TextLink to="/results">Explore results</TextLink>
        </div>
      </Section>

      <Section id="technology" title="Beauty Technology">
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
          <TextLink to={`/products?category=beauty-devices`}>View all {productsInCategory('beauty-devices').length} beauty devices</TextLink>
        </div>
      </Section>

      <Section id="ai" kicker={lusterscan.label.text} title="AI Technology" tone="tint">
        <p className="prose-lg">{lusterscan.description}</p>
        <div className="section__actions">
          <TextLink to="/lusterscan-ai">Explore LusterScan AI</TextLink>
        </div>
      </Section>

      {/* Certifications: pending (V-04) — rendered from device data once features.certifications is on. */}

      <ConsultationCta />
    </>
  );
}
