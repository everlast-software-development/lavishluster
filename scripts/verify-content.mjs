#!/usr/bin/env node
/**
 * Content-integrity check (build step 16).
 *
 *  1. Data files equal a fresh extraction of the Master snapshot.
 *  2. Every published product field is verbatim Master text (after the logged
 *     whitespace normalizations; withheld sentences are re-attached to prove
 *     nothing else changed).
 *  3. Every display fragment (list items, figures, device specs, science
 *     phrases) is an exact substring of its Master field.
 *  4. Every brand text block is verbatim verified old-site content.
 *  5. The prerendered HTML of all 27 product pages contains every fragment.
 *  6. The build contains no commerce, theme-demo, excluded-product or
 *     withheld content.
 *  7. Flagged pages are absent; all 27 product pages and the sitemap exist.
 *
 * Exit code 1 on any failure.
 */
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { isDeepStrictEqual } from 'node:util';
import { extract, NORMALIZATIONS } from './extract-master.mjs';
import { splitBenefits, splitEvidence, splitIngredients } from '../client/src/utils/text.js';
import { deviceSpecs } from '../client/src/data/devices/specs.js';
import { technologies } from '../client/src/data/content/science.js';
import { site, lusterscan } from '../client/src/data/content/site.js';
import { contact } from '../client/src/data/content/contact.js';
import { features } from '../client/src/data/config/features.js';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DATA = resolve(ROOT, 'client/src/data');
const DIST = resolve(ROOT, 'client/dist');
const json = (rel) => JSON.parse(readFileSync(resolve(DATA, rel), 'utf8'));

let failures = 0;
let checks = 0;
const fail = (msg) => { failures += 1; console.error(`  ✗ ${msg}`); };
const check = (cond, msg) => { checks += 1; if (!cond) fail(msg); return cond; };
const section = (title) => console.log(`\n${title}`);

// ---------------------------------------------------------------- 1
section('1. Data layer matches the Master extraction');
const fresh = extract();
const products = [...json('products/facial.json'), ...json('flashTreatments/flash.json'), ...json('devices/devices.json')];
const withheld = json('verification/withheld.json');
check(isDeepStrictEqual(json('products/facial.json'), fresh.facial), 'facial.json differs from extraction');
check(isDeepStrictEqual(json('flashTreatments/flash.json'), fresh.flash), 'flash.json differs from extraction');
check(isDeepStrictEqual(json('devices/devices.json'), fresh.devices), 'devices.json differs from extraction');
check(isDeepStrictEqual(withheld, fresh.withheld), 'withheld.json differs from extraction');
const counts = ['facial-treatment', 'flash-treatment', 'beauty-devices'].map((c) => products.filter((p) => p.category === c).length);
check(counts.join('/') === '15/5/7', `counts are ${counts.join('/')}, expected 15/5/7`);
check(new Set(products.map((p) => p.slug)).size === 27, 'slugs are not unique');

// ---------------------------------------------------------------- 2
section('2. Published product fields are verbatim Master text');
const masterRaw = readFileSync(resolve(ROOT, 'content-source/master.md'), 'utf8');
let masterNorm = masterRaw;
for (const r of NORMALIZATIONS) masterNorm = masterNorm.split(r.find).join(r.replace);
const masterLines = new Set(masterNorm.split('\n').map((l) => l.trim()).filter(Boolean));
const masterHeaders = [...masterLines].filter((l) => /^LUSTER [^a-z]+$/.test(l));
check(masterHeaders.length === 27 && masterHeaders.every((h) => products.some((p) => p.name === h)), 'Master product list and data do not match one-to-one');

const LABELS = { applicationSecret: 'Application Secret', enhancedBenefits: 'Enhanced Benefits', activeIngredients: 'Active Ingredients', scientificEvidence: 'Scientific Evidence' };
for (const p of products) {
  check(masterLines.has(p.name), `${p.slug}: name not verbatim`);
  check(masterLines.has(p.subtitle), `${p.slug}: subtitle not verbatim`);
  if (p.shortDescription !== null) check(masterLines.has(p.shortDescription), `${p.slug}: short description not verbatim`);
  for (const [field, label] of Object.entries(LABELS)) {
    if (p[field] === null) continue;
    const w = withheld.find((x) => x.slug === p.slug && x.field === field);
    const full = w ? `${p[field]}${w.joiner}${w.value}` : p[field];
    check(masterLines.has(`${label}: ${full}`), `${p.slug}: ${field} not verbatim${w ? ' (with withheld text re-attached)' : ''}`);
  }
  if (p.lightFunctions) {
    check(masterLines.has(p.lightFunctions.heading), `${p.slug}: light functions heading`);
    check(masterLines.has(p.lightFunctions.intro), `${p.slug}: light functions intro`);
    const all = [...p.lightFunctions.items, ...withheld.filter((x) => x.slug === p.slug && x.field === 'lightFunctions').map((x) => x.value)];
    for (const it of all) check(masterLines.has(`- ${it.name} — ${it.wavelength}: ${it.description}`), `${p.slug}: light function "${it.name}"`);
  }
}

// ---------------------------------------------------------------- 3
section('3. Display fragments are exact substrings of Master fields');
const fragments = new Map(); // slug -> strings expected on the rendered page
for (const p of products) {
  const expect = [p.name, p.subtitle, p.applicationSecret];
  if (p.shortDescription) expect.push(p.shortDescription);
  const benefits = splitBenefits(p.enhancedBenefits);
  if (benefits) for (const b of benefits) { check(p.enhancedBenefits.includes(b), `${p.slug}: benefit "${b}"`); expect.push(b); }
  else expect.push(p.enhancedBenefits);
  for (const ing of splitIngredients(p.activeIngredients)) {
    check(p.activeIngredients.includes(ing.raw) && ing.raw.startsWith(ing.name), `${p.slug}: ingredient "${ing.raw}"`);
    if (ing.concentration) check(ing.raw.endsWith(`(${ing.concentration})`), `${p.slug}: concentration "${ing.concentration}"`);
    expect.push(ing.name);
  }
  for (const e of splitEvidence(p.scientificEvidence)) {
    check(p.scientificEvidence.includes(e.raw), `${p.slug}: evidence "${e.raw}"`);
    expect.push(e.raw);
  }
  const spec = deviceSpecs[p.slug];
  if (spec) {
    for (const t of spec.technology || []) { check(p[t.from]?.includes(t.text), `${p.slug}: technology "${t.text}" not in ${t.from}`); expect.push(t.text); }
    for (const m of spec.modes || []) {
      check(p[m.from]?.includes(m.label), `${p.slug}: mode "${m.label}" not in ${m.from}`);
      if (m.description) check(p[m.from].includes(m.description), `${p.slug}: mode description "${m.description}"`);
      expect.push(m.label);
    }
  }
  if (p.lightFunctions) for (const it of p.lightFunctions.items) expect.push(it.name, it.wavelength, it.description);
  fragments.set(p.slug, expect);
}
for (const slug of Object.keys(deviceSpecs)) check(products.some((p) => p.slug === slug && p.category === 'beauty-devices'), `specs.js references unknown device ${slug}`);
for (const t of technologies) {
  for (const d of t.devices) {
    const p = products.find((x) => x.slug === d.slug);
    check(p && p[d.from]?.includes(d.phrase), `science.js: "${d.phrase}" not in ${d.slug}.${d.from}`);
    check(d.phrase.includes(t.label), `science.js: ${t.label} phrase "${d.phrase}" does not name the technology`);
  }
}

// ---------------------------------------------------------------- 4
section('4. Brand text is verbatim verified old-site content');
const snapshot = readFileSync(resolve(ROOT, 'content-source/old-site-verified.md'), 'utf8');
const brandStrings = [];
const collect = (node, key = '') => {
  if (typeof node === 'string') {
    if (key !== 'source' && !/^https?:/.test(node)) brandStrings.push(node);
  } else if (Array.isArray(node)) node.forEach((n) => collect(n));
  else if (node && typeof node === 'object') {
    // Labels shown in sentence case must match their verbatim source (case only).
    if (node.verbatim) { check(node.text.toLowerCase() === node.verbatim.toLowerCase(), `label "${node.text}" differs from "${node.verbatim}" beyond case`); brandStrings.push(node.verbatim); return; }
    for (const [k, v] of Object.entries(node)) collect(v, k);
  }
};
collect(site); collect(lusterscan);
brandStrings.push(contact.email, contact.address, contact.mapsUrl, contact.copyright);
for (const s of brandStrings) check(snapshot.includes(s), `not in verified snapshot: "${s.slice(0, 70)}…"`);
check(contact.phone === null && contact.openingHours === null, 'pending contact values must stay null');

// ---------------------------------------------------------------- 5
section('5. Prerendered product pages contain every fragment');
const decode = (html) => html
  .replace(/<script[\s\S]*?<\/script>/g, ' ')
  .replace(/<style[\s\S]*?<\/style>/g, ' ')
  .replace(/<!--[\s\S]*?-->/g, '')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')
  .replace(/\s+/g, ' ');
const collapse = (s) => s.replace(/\s+/g, ' ');
if (!check(existsSync(DIST), 'client/dist missing — run the client build first')) process.exit(1);
for (const p of products) {
  const file = join(DIST, 'products', p.slug, 'index.html');
  if (!check(existsSync(file), `missing page /products/${p.slug}`)) continue;
  const text = decode(readFileSync(file, 'utf8'));
  for (const frag of fragments.get(p.slug)) check(text.includes(collapse(frag)), `/products/${p.slug}: "${frag.slice(0, 60)}" not rendered verbatim`);
}

// ---------------------------------------------------------------- 6
section('6. No commerce, demo, excluded or withheld content in the build');
const walk = (dir) => readdirSync(dir).flatMap((f) => { const p = join(dir, f); return statSync(p).isDirectory() ? walk(p) : [p]; });
const files = walk(DIST).filter((f) => /\.(html|js|css|xml|txt)$/.test(f));
const ownFiles = files.filter((f) => !/[\\/]assets[\\/]vendor-/.test(f));
const readText = (f) => (f.endsWith('.html') ? decode(readFileSync(f, 'utf8')) : readFileSync(f, 'utf8'));

const OLD_PRODUCTS = ['Barrier Restore Cream', 'Cellular Active+', 'Clear Precision Serum', 'Copper-Lift Serum', 'Elixir Glow Oil', 'EMS Facial Sculptor', 'Hydra-Radiance Cream', 'Lift Advanced Protocol', 'Luminous Glow Serum', 'Luxury Vanity Case', 'Niacin Refine Serum', 'Revive-X Mask', 'Sculpt Contour', 'Smile LED Pro', 'Smile Radiance Gel', 'The U-Plan'];
const BANNED = [
  [/add to cart|add-to-cart/i, 'add to cart'], [/\bcart\b/i, 'cart'], [/\bcheckout\b/i, 'checkout'], [/woocommerce/i, 'WooCommerce'],
  [/\bprices?\b/i, 'price'], [/\bAED\b/, 'AED'], [/د\.إ/, 'AED symbol'], [/\$\s?\d/, '$ amount'], [/buy now|shop now|in stock|\bSKU\b|\bwishlist\b/i, 'commerce UI'],
  [/aesthetica|cmsmasters/i, 'theme reference'], [/lorem ipsum/i, 'lorem ipsum'],
  [/Olivia Hartman|Emilia Rousseau|Mark Hoffman/i, 'demo doctor'], [/Stroke Rehabilitation|Spinal Cord/i, 'demo service'],
  [/Los Angeles|rhinoplasty|Botox Clinic|First-Time Botox|new-patient discount/i, 'demo copy'],
  [/XXX XXXX|0 800 123/, 'placeholder phone'], [/doctor-placeholder/i, 'demo image'],
  [/Ava D\.|Debbie S\.|Dr\. Amira K\.|Fatima M\.|Sarah L\./, 'unverified testimonial'],
  [/250 five-star|1000\+ reviews|4\.8 rating/i, 'review claim'],
  [/Dental Beauty|\bAccessories\b|Body Care/, 'excluded category'],
  [/25\+ specialized formulas|Personal Dermatologist/i, 'excluded claim'],
  [/Neuromodulators|Dermal Fillers|PDO Threads/i, 'unconfirmed clinic treatment'],
  [/\bEST\b/, 'demo time zone'], [/f56g1qfzh6c/, 'unconfirmed video'],
  ...OLD_PRODUCTS.map((n) => [new RegExp(n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'), `old product "${n}"`]),
];
const WITHHELD = [/\bFDA\b/, /CE and FDA certified/, /650 nm/, /FDA-certified/, /world’s first complete medical techno-beauty system/];
for (const f of ownFiles) {
  const text = readText(f);
  const rel = f.replace(DIST, 'dist');
  for (const [re, label] of BANNED) check(!re.test(text), `${rel}: contains ${label}`);
  for (const re of WITHHELD) check(!re.test(text), `${rel}: contains withheld text ${re}`);
}
// The framework bundle is third-party code; only withheld/commerce terms are checked there.
for (const f of files.filter((x) => !ownFiles.includes(x))) {
  const text = readText(f);
  for (const re of [...WITHHELD, /woocommerce/i, /add to cart/i]) check(!re.test(text), `${f.replace(DIST, 'dist')}: contains ${re}`);
}

// ---------------------------------------------------------------- 7
section('7. Routes, flags and sitemap');
const pageExists = (p) => existsSync(join(DIST, p, 'index.html'));
const flagged = { clinic: '/clinic', legalPages: '/privacy' };
for (const [flag, path] of Object.entries(flagged)) {
  if (!features[flag]) check(!pageExists(path), `${path} is built although features.${flag} is off`);
}
if (!features.legalPages) check(!pageExists('/terms'), '/terms is built although features.legalPages is off');
for (const path of ['/', '/about', '/products', '/lusterscan-ai', '/science', '/results', '/contact']) check(existsSync(join(DIST, path === '/' ? 'index.html' : `${path}/index.html`)), `missing page ${path}`);
check(existsSync(join(DIST, '404.html')), 'missing 404.html');
const sitemap = readFileSync(join(DIST, 'sitemap.xml'), 'utf8');
check((sitemap.match(/\/products\/luster-/g) || []).length === 27, 'sitemap does not list 27 product pages');
check(!/\/clinic|\/privacy|\/terms/.test(sitemap) || features.clinic || features.legalPages, 'sitemap lists a disabled page');
const on = Object.entries(features).filter(([, v]) => v).map(([k]) => k);
console.log(`  Feature flags on: ${on.length ? on.join(', ') : 'none'}`);

console.log(`\n${failures === 0 ? '✓' : '✗'} ${checks} checks, ${failures} failed`);
process.exit(failures === 0 ? 0 : 1);
