/**
 * Static prerender: renders every route to HTML (with its own title,
 * description, canonical, Open Graph and JSON-LD), then writes 404.html,
 * sitemap.xml and robots.txt. Pages hydrate in the browser.
 */
import { readFileSync, writeFileSync, mkdirSync, rmSync, readdirSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = resolve(root, 'dist');
const baseTemplate = readFileSync(resolve(dist, 'index.html'), 'utf8');
// Preload the two Latin font files used above the fold.
const fonts = readdirSync(resolve(dist, 'assets')).filter((f) => /^(newsreader-latin-opsz-normal|hanken-grotesk-latin-wght-normal)-.*\.woff2$/.test(f));
const preload = fonts.map((f) => `<link rel="preload" href="/assets/${f}" as="font" type="font/woff2" crossorigin />`).join('\n    ');
const template = baseTemplate.replace('<!--app-head-->', `${preload}\n    <!--app-head-->`);
const { render, getPrerenderPaths } = await import(pathToFileURL(resolve(root, 'dist-ssr/entry-server.js')).href);
const SITE = 'https://lavishluster.com';

function write(path, html) {
  const file = path === '/' ? resolve(dist, 'index.html') : resolve(dist, `.${path}`, 'index.html');
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
}
const page = (url) => {
  const { html, head } = render(url);
  return template.replace('<!--app-head-->', head).replace('<!--app-html-->', html);
};

const paths = getPrerenderPaths();
for (const path of paths) write(path, page(path));
writeFileSync(resolve(dist, '404.html'), page('/__not-found__'));

const today = new Date().toISOString().slice(0, 10);
writeFileSync(
  resolve(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${paths
    .map((p) => `  <url><loc>${SITE}${p === '/' ? '/' : p}</loc><lastmod>${today}</lastmod></url>`)
    .join('\n')}\n</urlset>\n`,
);
writeFileSync(resolve(dist, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);

rmSync(resolve(root, 'dist-ssr'), { recursive: true, force: true });

// Asset report: which products still use the generated placeholder plate.
const assetDirs = ['products', 'devices'].map((d) => resolve(root, 'src/assets', d));
const withImages = new Set(assetDirs.flatMap((d) => (existsSync(d) ? readdirSync(d) : [])));
const productPaths = paths.filter((p) => p.startsWith('/products/'));
const missing = productPaths.filter((p) => !withImages.has(p.split('/').pop()));
console.log(`Prerendered ${paths.length} pages (+404). ${productPaths.length} product pages; ${missing.length} still use placeholder plates.`);
