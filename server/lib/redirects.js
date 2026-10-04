/**
 * Optional 301 redirects from the old WordPress URLs (pending approval —
 * enable with REDIRECTS_ENABLED=true). Only the two products that exist in
 * the Master keep a product-level mapping; every other old product or
 * category URL goes to the catalog.
 */
const EXACT = {
  '/shop': '/products',
  '/about-us': '/about',
  '/contacts': '/contact',
  '/product/luster-cell-revive-exosome': '/products/luster-cell-revive-exosome',
  '/product/luster-centurion-led-pro-5-0': '/products/luster-centurion-led-pro-5-0',
};

export function legacyRedirects(req, res, next) {
  if (req.method !== 'GET' && req.method !== 'HEAD') return next();
  const path = req.path.replace(/\/+$/, '') || '/';
  const target = EXACT[path] || (/^\/(product|product-category)\//.test(path + '/') && path !== '/products' ? '/products' : null);
  if (target && target !== path) return res.redirect(301, target);
  return next();
}

/**
 * Always-on 301s for retired site routes (independent of REDIRECTS_ENABLED).
 * /lusterscan → /lusterscan-ai (content-source/website-content.md, section 2);
 * any query string is kept.
 */
const ROUTES = { '/lusterscan': '/lusterscan-ai' };

export function routeRedirects(req, res, next) {
  if (req.method !== 'GET' && req.method !== 'HEAD') return next();
  const path = req.path.replace(/\/+$/, '') || '/';
  const target = ROUTES[path];
  if (!target) return next();
  const query = req.originalUrl.includes('?') ? req.originalUrl.slice(req.originalUrl.indexOf('?')) : '';
  return res.redirect(301, target + query);
}
