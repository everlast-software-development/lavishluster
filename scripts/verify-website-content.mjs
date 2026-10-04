/**
 * Website-content check (runs after the build, next to verify-content.mjs).
 *
 * content-source/website-content.md is the single source for page copy.
 *   1. Every copy string in the page data files (client/src/data/content/
 *      home.js, about.js, lusterscan.js, results.js, and sciencePage in
 *      science.js) appears verbatim in the document (bold markers removed).
 *   2. Nothing from the document's section 16 (Pending / Do Not Publish) and no
 *      "[PENDING" marker appears in any prerendered page.
 *   3. Home: every block of section 5 is rendered, and no paragraph appears twice.
 *
 * Exit code 1 on any failure.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(ROOT, 'client/dist');
const CONTENT = join(ROOT, 'client/src/data/content');
let checks = 0, failures = 0;
const check = (ok, msg) => { checks++; if (!ok) { failures++; console.log(`  ✗ ${msg}`); } };
const section = (t) => console.log(`\n${t}`);

const squash = (s) => s.replace(/\s+/g, ' ').trim();
const doc = squash(readFileSync(join(ROOT, 'content-source/website-content.md'), 'utf8').replace(/\*\*/g, ''));
const load = async (f) => import(pathToFileURL(join(CONTENT, f)).href);
const { home } = await load('home.js');
const { about } = await load('about.js');
const { lusterscanPage } = await load('lusterscan.js');
const { resultsPage } = await load('results.js');
const { sciencePage } = await load('science.js');

// Keys that hold routes, ids or presentation data rather than published copy.
const NOT_COPY = new Set(['to', 'href', 'slug', 'number', 'width', 'height', 'alt', 'titleLines']);
const strings = (node, key = '', out = []) => {
  if (typeof node === 'string') { if (!NOT_COPY.has(key)) out.push(node); }
  else if (Array.isArray(node)) { if (!NOT_COPY.has(key)) node.forEach((n) => strings(n, key, out)); }
  else if (node && typeof node === 'object') for (const [k, v] of Object.entries(node)) strings(v, k, out);
  return out;
};

// ---------------------------------------------------------------- 1
section('1. Page copy is verbatim website-content.md');
const files = { 'home.js': home, 'about.js': about, 'lusterscan.js': lusterscanPage, 'results.js': resultsPage, 'science.js (sciencePage)': sciencePage };
for (const [name, data] of Object.entries(files)) {
  for (const s of strings(data)) check(doc.includes(squash(s)), `${name}: "${s.slice(0, 70)}" not in website-content.md`);
}
// Title line breaks are presentation only: the lines must join back to the verbatim title.
for (const [name, block] of Object.entries(home)) {
  if (block.titleLines) check(block.titleLines.join(' ') === block.title, `home.js: ${name} title lines do not join to the title`);
}

// ---------------------------------------------------------------- 2
section('2. Nothing pending (section 16) is published');
const walk = (d) => readdirSync(d).flatMap((f) => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : [p]; });
const decode = (s) => s.replace(/&amp;/g, '&').replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ');
const pages = walk(DIST).filter((f) => f.endsWith('.html'));
const PENDING = [
  [/\[⚠?\s*PENDING|DO NOT PUBLISH/i, 'pending marker'],
  [/\bFDA\b/, 'FDA'],
  [/Personal Dermatologist/i, '"Your Personal Dermatologist" headline'],
  [/Dermatological precision analysis/i, '"Dermatological precision analysis" bullet'],
  [/25\+ specialized formulas/i, '"25+ specialized formulas" line'],
  [/650\s?nm/i, 'Centurion NIR 650 nm row'],
  [/XXX XXXX/, 'placeholder phone'],
  [/Dr\. Amira K\.|Fatima M\.|Sarah L\./, 'demo testimonial'],
  [/five-star|reviews?\b.*\d|\d\.\d rating/i, 'review count or rating'],
];
for (const f of pages) {
  const text = decode(readFileSync(f, 'utf8'));
  const rel = f.replace(DIST, 'dist');
  for (const [re, label] of PENDING) check(!re.test(text), `${rel}: contains ${label}`);
}

// ---------------------------------------------------------------- 3
section('3. Home: every section-5 block once, no repeated paragraph');
const html = readFileSync(join(DIST, 'index.html'), 'utf8');
const body = squash(decode(html.slice(html.indexOf('<body'), html.lastIndexOf('</body>')).replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<[^>]+>/g, ' ')));
const count = (needle) => body.split(squash(needle)).length - 1;
const blocks = strings(home);
for (const s of blocks) check(count(s) >= 1, `Home: block missing — "${s.slice(0, 70)}"`);
// Paragraph-length blocks (sentences, not labels) must appear exactly once.
for (const s of new Set(blocks.filter((b) => b.length >= 40))) check(count(s) === 1, `Home: "${s.slice(0, 70)}" appears ${count(s)} times`);

console.log(`\n${failures === 0 ? '✓' : '✗'} ${checks} website-content checks, ${failures} failed`);
process.exit(failures === 0 ? 0 : 1);
