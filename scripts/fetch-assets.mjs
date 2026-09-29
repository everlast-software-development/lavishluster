#!/usr/bin/env node
/** Downloads the verified assets listed in content-source/asset-manifest.json. Existing files are kept. */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const { assets } = JSON.parse(readFileSync(resolve(ROOT, 'content-source/asset-manifest.json'), 'utf8'));
for (const a of assets) {
  const target = resolve(ROOT, a.target);
  if (existsSync(target)) { console.log(`skip  ${a.target} (exists)`); continue; }
  try {
    const res = await fetch(a.url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, Buffer.from(await res.arrayBuffer()));
    console.log(`saved ${a.target}`);
  } catch (err) {
    console.error(`fail  ${a.url}: ${err.message}`);
  }
}
console.log('Rebuild (npm run build) to use the new assets.');
