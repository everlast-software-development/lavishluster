import Seo from '../../components/ui/Seo.jsx';
import PageHero from '../../components/ui/PageHero.jsx';
import { ButtonLink, TextLink } from '../../components/ui/Links.jsx';

export default function NotFound() {
  return (
    <>
      <Seo title="Page not found" path="/404" noindex />
      <PageHero title="Page not found" intro="This address doesn’t match a page on the site. Browse the products or return to the home page.">
        <div className="hero__actions">
          <ButtonLink to="/products">Explore products</ButtonLink>
          <TextLink to="/">Go to home page</TextLink>
        </div>
      </PageHero>
    </>
  );
}
