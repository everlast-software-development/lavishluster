import Feature from '../../ui/Feature.jsx';
import ProductGrid from '../../product/ProductGrid.jsx';
import { TextLink } from '../../ui/Links.jsx';
import { featuredProducts } from '../../../data/catalog.js';
import './HomeFeatured.css';

/** 05 — Featured products. Stays off until features.featuredProducts and config/featured.js are set. */
export default function HomeFeatured() {
  return (
    <Feature flag="featuredProducts" data={featuredProducts}>
      <section className="home-band home-featured" aria-labelledby="featured-title">
        <div className="container">
          <header className="home-featured__head">
            <h2 id="featured-title" className="section-title">Featured products</h2>
            <TextLink to="/products">Explore products</TextLink>
          </header>
          <ProductGrid products={featuredProducts} />
        </div>
      </section>
    </Feature>
  );
}
