import { Link } from 'react-router-dom';
import BrandImage from '../../ui/BrandImage.jsx';
import { TextLink } from '../../ui/Links.jsx';
import { catalogHref, categoriesWithCounts, products } from '../../../data/catalog.js';
import './HomeCollections.css';

/** 03 — Collections index: the three product worlds as large rows beside one image. */
export default function HomeCollections() {
  return (
    <section className="section section--white home-collections" aria-labelledby="collections-title">
      <div className="container home-collections__grid">
        <BrandImage name="category-facial" ratio={0.8} className="home-collections__media" />
        <div className="home-collections__body">
          <header className="home-collections__head">
            <h2 id="collections-title" className="section-title">Products</h2>
            <span className="home-collections__total">{products.length}</span>
          </header>
          <ul className="home-collections__rows">
            {categoriesWithCounts.map((c) => (
              <li key={c.slug}>
                <Link to={catalogHref(c.slug)} className="collection-row">
                  <span className="collection-row__line">
                    <span className="collection-row__name">{c.label}</span>
                    <span className="collection-row__count">{c.countLabel}</span>
                  </span>
                  {c.description && <span className="collection-row__desc">{c.description}</span>}
                </Link>
              </li>
            ))}
          </ul>
          <div className="section__actions home-collections__actions">
            <TextLink to="/products">Explore products</TextLink>
          </div>
        </div>
      </div>
    </section>
  );
}
