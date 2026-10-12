import Seo from '../../components/ui/Seo.jsx';
import HomeHero from '../../components/sections/home/HomeHero.jsx';
import HomeStatement from '../../components/sections/home/HomeStatement.jsx';
import HomeCollections from '../../components/sections/home/HomeCollections.jsx';
import HomeSignature from '../../components/sections/home/HomeSignature.jsx';
import HomeFeatured from '../../components/sections/home/HomeFeatured.jsx';
import HomeScience from '../../components/sections/home/HomeScience.jsx';
import HomeLusterScan from '../../components/sections/home/HomeLusterScan.jsx';
import HomeResults from '../../components/sections/home/HomeResults.jsx';
import HomeConsultation from '../../components/sections/home/HomeConsultation.jsx';
import { BeforeAfterGallery, Testimonials, ClinicTeaser } from '../../components/sections/PendingSections.jsx';
import masterBrand from '../../data/content/master-brand.json';
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

/** Home — one component per section (components/sections/home/). */
export default function Home() {
  return (
    <>
      <Seo title="Where Science Meets Luxury" brandFirst description={masterBrand.statement} path="/" jsonLd={orgJsonLd} />
      <HomeHero />
      <HomeStatement />
      <HomeCollections />
      <HomeSignature />
      <HomeFeatured />
      <HomeScience />
      <HomeLusterScan />
      <HomeResults />
      <BeforeAfterGallery />
      <Testimonials />
      <ClinicTeaser />
      <HomeConsultation />
    </>
  );
}
