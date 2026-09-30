import Seo from '../../components/ui/Seo.jsx';
import Section from '../../components/ui/Section.jsx';
import PageHero from '../../components/ui/PageHero.jsx';
import EvidenceLedger from '../../components/sections/EvidenceLedger.jsx';
import ConsultationCta from '../../components/sections/ConsultationCta.jsx';
import { BeforeAfterGallery, Testimonials } from '../../components/sections/PendingSections.jsx';
import { site } from '../../data/content/site.js';
import { productsInCategory } from '../../data/catalog.js';

export default function Results() {
  return (
    <>
      <Seo title="Results" description={site.results.body.text} path="/results" />
      <PageHero kicker={site.results.label.text} title="Real Results. Scientific Evidence." intro={site.results.body.text} image="studio" />

      <BeforeAfterGallery />

      <Section id="facial-results" title="Facial Treatment" kicker="Product results">
        <EvidenceLedger products={productsInCategory('facial-treatment')} />
      </Section>

      <Section id="flash-results" title="Flash Treatment" kicker="Product results" tone="white">
        <EvidenceLedger products={productsInCategory('flash-treatment')} />
      </Section>

      <Section id="device-results" title="Beauty Devices" kicker="Device results">
        <EvidenceLedger products={productsInCategory('beauty-devices')} />
      </Section>

      <Testimonials />

      <ConsultationCta secondary={{ to: '/products', label: 'Explore products' }} />
    </>
  );
}
