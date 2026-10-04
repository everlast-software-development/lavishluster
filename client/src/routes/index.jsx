import { Navigate } from 'react-router-dom';
import { features } from '../data/config/features.js';
import { products } from '../data/catalog.js';
import Home from '../pages/Home/Home.jsx';
import About from '../pages/About/About.jsx';
import Products from '../pages/Products/Products.jsx';
import Product from '../pages/Product/Product.jsx';
import LusterScan from '../pages/LusterScan/LusterScan.jsx';
import Science from '../pages/Science/Science.jsx';
import Results from '../pages/Results/Results.jsx';
import Clinic from '../pages/Clinic/Clinic.jsx';
import Contact from '../pages/Contact/Contact.jsx';
import Legal from '../pages/Legal/Legal.jsx';

/** Route table. Flagged routes are absent (→ 404) while their flag is off. */
export const routes = [
  { path: '/', element: <Home /> },
  { path: '/about', element: <About /> },
  { path: '/products', element: <Products /> },
  { path: '/products/:slug', element: <Product /> },
  { path: '/lusterscan-ai', element: <LusterScan /> },
  { path: '/science', element: <Science /> },
  { path: '/results', element: <Results /> },
  features.clinic && { path: '/clinic', element: <Clinic /> },
  { path: '/contact', element: <Contact /> },
  features.legalPages && { path: '/privacy', element: <Legal kind="privacy" /> },
  features.legalPages && { path: '/terms', element: <Legal kind="terms" /> },
  // Retired route: the server answers it with a 301; in-app navigation is redirected here. Not prerendered.
  { path: '/lusterscan', element: <Navigate to="/lusterscan-ai" replace />, redirect: true },
].filter(Boolean);

/** Every URL to prerender to static HTML (redirect routes are not pages). */
export function getPrerenderPaths() {
  return routes
    .filter((r) => !r.redirect && !r.path.includes(':'))
    .map((r) => r.path)
    .concat(products.map((p) => `/products/${p.slug}`));
}
