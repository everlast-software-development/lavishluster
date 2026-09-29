#!/usr/bin/env node
/**
 * Extracts the 27 products/devices from the Master snapshot
 * (content-source/master.md, produced verbatim from the Master Word document)
 * into the client data layer.
 *
 * Rules (locked specification):
 *  - Field text is copied verbatim.
 *  - The ONLY transformations are the whitespace normalizations declared in
 *    NORMALIZATIONS (V-11) and the withholding rules declared in WITHHOLD
 *    (Tier B). Withheld text is written verbatim to the verification data,
 *    which the website never imports.
 *
 * Usage:
 *   node scripts/extract-master.mjs          write data files
 *   node scripts/extract-master.mjs --check  exit 1 if files differ from a fresh extraction
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { isDeepStrictEqual } from 'node:util';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SOURCE = resolve(ROOT, 'content-source/master.md');
const DATA = resolve(ROOT, 'client/src/data');

export const NORMALIZATIONS = [
  { id: 'V-11', find: ' ;', replace: ';', note: 'Stray space before semicolon' },
  { id: 'V-11', find: 'Bisabolol(', replace: 'Bisabolol (', note: 'Missing space before parenthesis' },
];

// status 'withheld': text moves verbatim to verification/withheld.json (never shipped).
// status 'released': after verification, text moves verbatim to the product's `storeAs` field
//                    (e.g. certifications), or the light-function row stays in place.
export const WITHHOLD = [
  { id: 'V-04', status: 'withheld', slug: 'luster-centurion-led-pro-5-0', field: 'scientificEvidence', text: ' CE and FDA certified.', storeAs: 'certifications' },
  { id: 'V-04', status: 'withheld', slug: 'luster-hair-growth-omega-5-0', field: 'scientificEvidence', text: ' CE and FDA certified.', storeAs: 'certifications' },
  { id: 'V-03', status: 'withheld', slug: 'luster-centurion-led-pro-5-0', field: 'lightFunctions', itemName: 'Near-Infrared Light' },
];

const FIELD_LABELS = {
  'Application Secret': 'applicationSecret',
  'Enhanced Benefits': 'enhancedBenefits',
  'Active Ingredients': 'activeIngredients',
  'Scientific Evidence': 'scientificEvidence',
};

const CATEGORY_HEADINGS = {
  '1. FACIAL TREATMENT': 'facial-treatment',
  '2. FLASH TREATMENT': 'flash-treatment',
  '3. BEAUT DEVICE': 'beauty-devices',
};

export function slugify(name) {
  return name
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function normalize(value, slug, field, log) {
  let out = value;
  for (const rule of NORMALIZATIONS) {
    if (out.includes(rule.find)) {
      log.push({ id: rule.id, slug, field, from: rule.find, to: rule.replace, note: rule.note });
      out = out.split(rule.find).join(rule.replace);
    }
  }
  return out;
}

export function extract() {
  const lines = readFileSync(SOURCE, 'utf8').split('\n').map((l) => l.trim()).filter(Boolean);
  const log = [];
  const products = [];
  const brand = {
    tagline: lines[1],
    subTagline: lines[2],
    statement: lines[3],
  };
  const categoryDescriptions = {};

  // CONTENTS block: "1. Facial Treatment" followed by its description line.
  const contentsMap = { '1. Facial Treatment': 'facial-treatment', '2. Flash Treatment': 'flash-treatment', '3. Beaut Device': 'beauty-devices' };
  lines.forEach((line, i) => {
    if (contentsMap[line]) categoryDescriptions[contentsMap[line]] = { sourceLabel: line.replace(/^\d+\.\s*/, ''), description: lines[i + 1] };
  });

  let category = null;
  let step = null;
  let stepLabels = {};
  let current = null;
  let expecting = null; // 'subtitle' | 'short' | null
  let inLightFunctions = false;

  const push = () => { if (current) products.push(current); current = null; };

  for (const line of lines) {
    if (line === 'PRODUCT COUNT — CHECKLIST') { push(); break; }
    if (CATEGORY_HEADINGS[line]) { push(); category = CATEGORY_HEADINGS[line]; step = null; continue; }
    if (!category) continue;

    const stepMatch = line.match(/^STEP (\d+): (.+)$/);
    if (stepMatch) { push(); step = Number(stepMatch[1]); stepLabels[step] = stepMatch[2]; continue; }

    if (/^LUSTER [^a-z]+$/.test(line)) {
      push();
      const slug = slugify(line);
      current = {
        id: slug, slug, order: products.length + 1, name: line, subtitle: null, shortDescription: null,
        category, step: category === 'facial-treatment' ? step : null,
        applicationSecret: null, enhancedBenefits: null, activeIngredients: null, scientificEvidence: null,
      };
      expecting = 'subtitle';
      inLightFunctions = false;
      continue;
    }
    if (!current) continue;

    if (line === 'LED & NIR Light Functions') {
      inLightFunctions = true;
      current.lightFunctions = { heading: line, intro: null, items: [] };
      continue;
    }
    if (inLightFunctions) {
      const item = line.match(/^- (.+?) — (.+?): (.+)$/);
      if (item) current.lightFunctions.items.push({ name: item[1], wavelength: item[2], description: item[3] });
      else current.lightFunctions.intro = line;
      continue;
    }

    const field = line.match(/^(Application Secret|Enhanced Benefits|Active Ingredients|Scientific Evidence): (.+)$/);
    if (field) {
      const key = FIELD_LABELS[field[1]];
      current[key] = normalize(field[2], current.slug, key, log);
      expecting = null;
      continue;
    }
    if (expecting === 'subtitle') { current.subtitle = line; expecting = 'short'; continue; }
    if (expecting === 'short') { current.shortDescription = normalize(line, current.slug, 'shortDescription', log); expecting = null; continue; }
    throw new Error(`Unrecognised line in Master snapshot: "${line}"`);
  }

  // Tier B withholding — text moves verbatim into verification data.
  const withheld = [];
  for (const rule of WITHHOLD) {
    const p = products.find((x) => x.slug === rule.slug);
    if (!p) throw new Error(`Withhold rule targets unknown slug ${rule.slug}`);
    if (rule.field === 'lightFunctions') {
      if (rule.status === 'released') continue;
      const idx = p.lightFunctions.items.findIndex((it) => it.name === rule.itemName);
      if (idx < 0) throw new Error(`Light function ${rule.itemName} not found`);
      const [item] = p.lightFunctions.items.splice(idx, 1);
      withheld.push({ id: rule.id, slug: p.slug, field: 'lightFunctions', position: idx, value: item });
    } else {
      const value = p[rule.field];
      if (!value.endsWith(rule.text)) throw new Error(`Withhold text not found at end of ${p.slug}.${rule.field}`);
      p[rule.field] = value.slice(0, -rule.text.length);
      if (rule.status === 'released') { p[rule.storeAs] = rule.text.trim(); continue; }
      withheld.push({ id: rule.id, slug: p.slug, field: rule.field, storeAs: rule.storeAs, value: rule.text.trim(), joiner: ' ' });
    }
  }

  // Verification ids per product (Tier A flags and structural notes).
  const flag = (slug, id) => { const p = products.find((x) => x.slug === slug); (p.verification ||= []).includes(id) || p.verification.push(id); };
  for (const p of products) p.verification = [];
  flag('luster-tech-body-slim-x4', 'V-01');
  flag('luster-thermo-sonic-2-0', 'V-02');
  flag('luster-centurion-led-pro-5-0', 'V-03');
  flag('luster-centurion-led-pro-5-0', 'V-04');
  flag('luster-hair-growth-omega-5-0', 'V-04');
  for (const p of products) {
    if (/Emullium|Orange Tree Stem Cells|Vegetable Proteoglycans|Plant-Based Proteoglycans|Hazel Water|camomille/.test(p.activeIngredients || '')) flag(p.slug, 'V-05');
  }
  flag('luster-line-eraser', 'V-06');
  flag('luster-korean-mask', 'V-07');
  for (const p of products) if (!p.shortDescription) flag(p.slug, 'V-09');
  flag('luster-korean-mask', 'V-10');
  for (const entry of log) flag(entry.slug, 'V-11');

  const strip = (arr) => arr.map((p) => {
    const out = { ...p };
    if (out.category !== 'beauty-devices') delete out.lightFunctions;
    if (out.category === 'beauty-devices' && !out.lightFunctions) delete out.lightFunctions;
    return out;
  });

  return {
    facial: strip(products.filter((p) => p.category === 'facial-treatment')),
    flash: strip(products.filter((p) => p.category === 'flash-treatment')),
    devices: strip(products.filter((p) => p.category === 'beauty-devices')),
    masterBrand: { ...brand, categories: categoryDescriptions, steps: stepLabels },
    withheld,
    normalizations: log,
  };
}

const OUTPUTS = {
  facial: 'products/facial.json',
  flash: 'flashTreatments/flash.json',
  devices: 'devices/devices.json',
  masterBrand: 'content/master-brand.json',
  withheld: 'verification/withheld.json',
  normalizations: 'verification/normalizations.json',
};

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = extract();
  const counts = { facial: result.facial.length, flash: result.flash.length, devices: result.devices.length };
  if (counts.facial !== 15 || counts.flash !== 5 || counts.devices !== 7) {
    console.error('Unexpected product counts', counts); process.exit(1);
  }
  if (process.argv.includes('--check')) {
    let ok = true;
    for (const [key, rel] of Object.entries(OUTPUTS)) {
      const onDisk = JSON.parse(readFileSync(resolve(DATA, rel), 'utf8'));
      if (!isDeepStrictEqual(onDisk, result[key])) { console.error(`✗ ${rel} differs from a fresh Master extraction`); ok = false; }
    }
    if (!ok) process.exit(1);
    console.log('✓ Data files match a fresh extraction of the Master snapshot');
  } else {
    for (const [key, rel] of Object.entries(OUTPUTS)) {
      const file = resolve(DATA, rel);
      mkdirSync(dirname(file), { recursive: true });
      writeFileSync(file, JSON.stringify(result[key], null, 2) + '\n');
    }
    console.log('Extracted', counts, `${result.normalizations.length} normalizations, ${result.withheld.length} withheld items`);
  }
}
