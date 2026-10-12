/**
 * Asset registry. Files are discovered at build time by convention:
 *   src/assets/products/<slug>/primary.(webp|avif|jpg|jpeg|png)
 *   src/assets/products/<slug>/gallery-01.webp, gallery-02.webp, ...
 *   src/assets/devices/<slug>/... (same convention)
 *   src/assets/products/<file> mapped to a slug in PRIMARY_FILES (a primary kept as supplied)
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

/*
 * Primary images supplied as a single file directly in src/assets/products/ (outside the <slug>/
 * convention), used where they are: slug → file. The file must exist; it is bundled by the glob below.
 */
const PRIMARY_FILES = {
  'luster-sculpt-and-lift': '/src/assets/products/LUSTER SCULPT & LIFT.webp',
};
const looseProductFiles = import.meta.glob('/src/assets/products/*.{webp,avif,jpg,jpeg,png}', { eager: true, import: 'default' });
for (const [slug, path] of Object.entries(PRIMARY_FILES)) {
  const url = looseProductFiles[path];
  if (!url) continue;
  const entry = (productImages[slug] ||= { primary: null, primaryAspect: null, gallery: [] });
  entry.primary = url;
  const size = imageSizes[path];
  entry.primaryAspect = size ? size[0] / size[1] : null;
}

const brandImages = {};
const brandWidths = {};
for (const [path, url] of Object.entries(brandFiles)) {
  const name = path.split('/').pop().replace(/\.[^.]+$/, '');
  brandImages[name] = url;
  brandWidths[name] = imageSizes[path]?.[0] ?? null;
}

/*
 * Responsive variants: src/assets/brand/variants/<name>-<width>.webp (smaller copies of a brand
 * image, never upscaled). getBrandSrcSet(name) lists them, plus the original when it is wider than
 * the largest variant, as a srcset string; null when the image has no variants.
 */
const variantFiles = import.meta.glob('/src/assets/brand/variants/*.{webp,avif,jpg,jpeg}', { eager: true, import: 'default' });
const brandVariants = {};
for (const [path, url] of Object.entries(variantFiles)) {
  const m = path.split('/').pop().match(/^(.+)-(\d+)\.\w+$/);
  if (m) (brandVariants[m[1]] ||= []).push({ url, w: Number(m[2]) });
}

export const getProductImages = (slug) => productImages[slug] || { primary: null, primaryAspect: null, gallery: [] };
export const getBrandImage = (name) => brandImages[name] || null;
export const getBrandSrcSet = (name) => {
  const list = [...(brandVariants[name] || [])].sort((a, b) => a.w - b.w);
  if (!list.length) return null;
  const original = brandWidths[name];
  if (brandImages[name] && original && original > list[list.length - 1].w) list.push({ url: brandImages[name], w: original });
  return list.map((v) => `${v.url} ${v.w}w`).join(', ');
};
