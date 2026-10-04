import Seo from '../../components/ui/Seo.jsx';
import Section from '../../components/ui/Section.jsx';
import PageHero from '../../components/ui/PageHero.jsx';
import EvidenceLedger from '../../components/sections/EvidenceLedger.jsx';
import ConsultationCta from '../../components/sections/ConsultationCta.jsx';
import { BeforeAfterGallery, Testimonials } from '../../components/sections/PendingSections.jsx';
import { resultsPage } from '../../data/content/results.js';
import { categories } from '../../data/taxonomy.js';
import { productsInCategory } from '../../data/catalog.js';

export default function Results() {
  return (
    <>
      <Seo title="Results" description={resultsPage.hero.text} path="/results" />
      <PageHero title={resultsPage.hero.title} intro={resultsPage.hero.text} image="intro" position="right 12%" />

      <BeforeAfterGallery />

      <Section id="facial-results" title={categories[0].label} kicker={resultsPage.productResults}>
        <EvidenceLedger products={productsInCategory('facial-treatment')} />
      </Section>

      <Section id="flash-results" title={categories[1].label} kicker={resultsPage.productResults} tone="white">
        <EvidenceLedger products={productsInCategory('flash-treatment')} />
      </Section>

      <Section id="device-results" title={categories[2].label} kicker={resultsPage.deviceResults}>
        <EvidenceLedger products={productsInCategory('beauty-devices')} />
      </Section>

      <Testimonials />

      <ConsultationCta secondary={{ to: '/products', label: 'Explore Products' }} />
    </>
  );
}
