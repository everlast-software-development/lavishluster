/**
 * Asset registry. Files are discovered at build time by convention:
 *   src/assets/products/<slug>/primary.(webp|avif|jpg|jpeg|png)
 *   src/assets/products/<slug>/gallery-01.webp, gallery-02.webp, ...
 *   src/assets/devices/<slug>/... (same convention)
 *   src/assets/brand/<name>.(svg|webp|png|jpg)   e.g. logo, philosophy, signature, results-couple
 * Adding a real file and rebuilding is all that is needed — no data or layout
 * change. Missing files fall back to the generated placeholder plate.
 */
import imageSizes from 'virtual:image-sizes';

const productFiles = import.meta.glob('/src/assets/{products,devices}/*/*.{webp,avif,jpg,jpeg,png}', { eager: true, import: 'default' });
const brandFiles = import.meta.glob('/src/assets/brand/*.{svg,webp,avif,jpg,jpeg,png}', { eager: true, import: 'default' });

const productImages = {};
for (const [path, url] of Object.entries(productFiles)) {
  const [, , , , slug, file] = path.split('/');
  const entry = (productImages[slug] ||= { primary: null, primaryAspect: null, gallery: [] });
  if (/^primary\./.test(file)) {
    entry.primary = url;
    // width / height of the primary image, read from the file at build time (virtual:image-sizes)
    const size = imageSizes[path];
    entry.primaryAspect = size ? size[0] / size[1] : null;
  }
  else if (/^gallery-/.test(file)) entry.gallery.push({ file, url });
}
for (const entry of Object.values(productImages)) {
  entry.gallery = entry.gallery.sort((a, b) => a.file.localeCompare(b.file)).map((g) => g.url);
}

const brandImages = {};
for (const [path, url] of Object.entries(brandFiles)) {
  const name = path.split('/').pop().replace(/\.[^.]+$/, '');
  brandImages[name] = url;
}

export const getProductImages = (slug) => productImages[slug] || { primary: null, primaryAspect: null, gallery: [] };
export const getBrandImage = (name) => brandImages[name] || null;
