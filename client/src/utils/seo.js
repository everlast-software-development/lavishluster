import { site } from '../data/config/features.js';

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const absoluteUrl = (path = '/') => (/^(https?:|data:)/.test(path) ? path : site.url + (path === '/' ? '/' : path));

export function buildMeta({ title, description, path = '/', image = null, type = 'website', jsonLd = null, noindex = false }) {
  const fullTitle = title ? `${title} | ${site.name}` : site.name;
  return { title: fullTitle, description, canonical: absoluteUrl(path), image: image ? absoluteUrl(image) : null, type, jsonLd, noindex };
}

/** Serialise head data for prerendered HTML. */
export function renderHead(m) {
  if (!m) return '';
  const tags = [
    `<title>${esc(m.title)}</title>`,
    m.description && `<meta name="description" content="${esc(m.description)}" />`,
    m.noindex && '<meta name="robots" content="noindex" />',
    `<link rel="canonical" href="${esc(m.canonical)}" />`,
    `<meta property="og:site_name" content="${esc(site.name)}" />`,
    `<meta property="og:type" content="${esc(m.type)}" />`,
    `<meta property="og:title" content="${esc(m.title)}" />`,
    m.description && `<meta property="og:description" content="${esc(m.description)}" />`,
    `<meta property="og:url" content="${esc(m.canonical)}" />`,
    m.image && `<meta property="og:image" content="${esc(m.image)}" />`,
    `<meta name="twitter:card" content="${m.image ? 'summary_large_image' : 'summary'}" />`,
    m.jsonLd && `<script type="application/ld+json">${JSON.stringify(m.jsonLd).replace(/</g, '\\u003c')}</script>`,
  ];
  return tags.filter(Boolean).join('\n    ');
}
