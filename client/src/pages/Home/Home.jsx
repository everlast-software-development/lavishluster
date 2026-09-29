import Seo from '../../components/ui/Seo.jsx';
import Section from '../../components/ui/Section.jsx';
import BrandImage from '../../components/ui/BrandImage.jsx';
import { ButtonLink, TextLink } from '../../components/ui/Links.jsx';
import CategoryIndex from '../../components/sections/CategoryIndex.jsx';
import LusterScanSteps from '../../components/sections/LusterScanSteps.jsx';
import ConsultationCta from '../../components/sections/ConsultationCta.jsx';
import { FeaturedProducts, BeforeAfterGallery, Testimonials, ClinicTeaser } from '../../components/sections/PendingSections.jsx';
import masterBrand from '../../data/content/master-brand.json';
import { site, lusterscan } from '../../data/content/site.js';
import { contact } from '../../data/content/contact.js';
import { site as siteConfig } from '../../data/config/features.js';

const orgJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Lavish Luster',
  url: siteConfig.url,
  email: contact.email,
  description: masterBrand.statement,
  address: { '@type': 'PostalAddress', streetAddress: 'The Galleria, Al Maryah Island', addressLocality: 'Abu Dhabi', addressCountry: 'AE' },
};

export default function Home() {
  return (
    <>
      <Seo title="Where Science Meets Luxury" description={masterBrand.statement} path="/" jsonLd={orgJsonLd} />

      <section className="hero" aria-labelledby="hero-title">
        <div className="container hero__grid">
          <div className="hero__text">
            <p className="hero__tagline">{masterBrand.tagline}</p>
            <h1 id="hero-title" className="hero__title">{site.heroTitle.text}</h1>
            <p className="hero__intro">{masterBrand.statement}</p>
            <div className="hero__actions">
              <ButtonLink to="/products">Explore products</ButtonLink>
              <TextLink to="/lusterscan-ai">Discover LusterScan AI</TextLink>
            </div>
          </div>
          <BrandImage name="hero" seed="hero-luster" ratio={0.82} animate eager className="hero__media" />
        </div>
        <div className="container">
          <ul className="pillars" aria-label="Brand principles">
            {site.pillars.items.map((p) => <li key={p}>{p}</li>)}
          </ul>
        </div>
      </section>

      <Section id="intro" title={site.intro.title.text}>
        <p className="prose-lg">{site.intro.body.text}</p>
        <p className="subtagline">{masterBrand.subTagline}</p>
      </Section>

      <Section id="collections" title="Products" tone="tint" layout="stack">
        <CategoryIndex />
        <div className="section__actions">
          <ButtonLink to="/products">Explore products</ButtonLink>
        </div>
      </Section>

      <Section id="science" kicker={site.science.label.text} title={site.science.title.text}>
        <p className="prose-lg">{site.science.body.text}</p>
        <div className="section__actions">
          <TextLink to="/science">Discover the science</TextLink>
        </div>
      </Section>

      <Section id="lusterscan" kicker={lusterscan.label.text} title={lusterscan.homeTitle} tone="tint">
        <p className="prose-lg">{lusterscan.description}</p>
        <LusterScanSteps />
        <p className="note">{lusterscan.disclaimer}</p>
        <div className="section__actions">
          <TextLink to="/lusterscan-ai">Explore LusterScan AI</TextLink>
        </div>
      </Section>

      <FeaturedProducts />

      <Section id="results" kicker={site.results.label.text} title={site.results.title.text}>
        <p className="prose-lg">{site.results.body.text}</p>
        <div className="section__actions">
          <TextLink to="/results">Explore results</TextLink>
        </div>
      </Section>

      <BeforeAfterGallery />
      <Testimonials />
      <ClinicTeaser />

      <ConsultationCta />
    </>
  );
}
