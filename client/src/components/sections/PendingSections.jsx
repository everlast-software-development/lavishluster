/**
 * Sections awaiting approved content. Each is complete and wired to its data
 * file; it renders only when its feature flag is on AND the data is non-empty.
 */
import Feature from '../ui/Feature.jsx';
import Section from '../ui/Section.jsx';
import ProductGrid from '../product/ProductGrid.jsx';
import { featuredProducts } from '../../data/catalog.js';
import { testimonials } from '../../data/testimonials/index.js';
import { beforeAfter } from '../../data/results/beforeAfter.js';
import { experts } from '../../data/experts/index.js';
import { clinic } from '../../data/clinic/index.js';
import { TextLink } from '../ui/Links.jsx';

export function FeaturedProducts() {
  return (
    <Feature flag="featuredProducts" data={featuredProducts}>
      <Section id="featured" title="Featured products" layout="stack">
        <ProductGrid products={featuredProducts} columns={3} />
      </Section>
    </Feature>
  );
}

export function BeforeAfterGallery({ title = 'Before & After' }) {
  return (
    <Feature flag="beforeAfter" data={beforeAfter}>
      <Section id="before-after" title={title} layout="stack">
        <ul className="ba-grid">
          {beforeAfter.map((item) => (
            <li key={item.id} className="ba-grid__item">
              <figure>
                <div className="ba-grid__pair">
                  <img src={item.before} alt={`${item.alt} — before`} loading="lazy" decoding="async" />
                  <img src={item.after} alt={`${item.alt} — after`} loading="lazy" decoding="async" />
                </div>
                {item.caption && <figcaption>{item.caption}</figcaption>}
              </figure>
            </li>
          ))}
        </ul>
      </Section>
    </Feature>
  );
}

export function Testimonials({ title = 'Testimonials' }) {
  return (
    <Feature flag="testimonials" data={testimonials}>
      <Section id="testimonials" title={title}>
        <ul className="quote-list">
          {testimonials.map((t) => (
            <li key={t.id}>
              <blockquote>
                <p>{t.quote}</p>
                <footer>{t.name}{t.role && <span>, {t.role}</span>}</footer>
              </blockquote>
            </li>
          ))}
        </ul>
      </Section>
    </Feature>
  );
}

export function Experts({ title = 'Our Experts' }) {
  return (
    <Feature flag="experts" data={experts}>
      <Section id="experts" title={title}>
        <ul className="expert-list">
          {experts.map((e) => (
            <li key={e.id}>
              {e.image && <img src={e.image} alt={e.name} loading="lazy" decoding="async" />}
              <h3>{e.name}</h3>
              {e.title && <p className="expert-list__title">{e.title}</p>}
              {e.bio && <p>{e.bio}</p>}
            </li>
          ))}
        </ul>
      </Section>
    </Feature>
  );
}

export function ClinicTeaser() {
  return (
    <Feature flag="clinic" data={clinic.intro}>
      <Section id="clinic" title="Clinic" lead={clinic.intro}>
        <TextLink to="/clinic">Explore clinic</TextLink>
      </Section>
    </Feature>
  );
}
