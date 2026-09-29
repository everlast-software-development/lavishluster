/**
 * Catalog assembly: merges the verbatim Master records with taxonomy,
 * device specs, assets and derived display structures.
 */
import facial from './products/facial.json';
import flash from './flashTreatments/flash.json';
import devices from './devices/devices.json';
import { deviceSpecs } from './devices/specs.js';
import { categories, getCategory, getStepByNumber, steps } from './taxonomy.js';
import { featuredSlugs } from './config/featured.js';
import { features } from './config/features.js';
import { getProductImages } from '../utils/assets.js';
import { splitBenefits, splitEvidence, splitIngredients } from '../utils/text.js';

const RELATED_LIMIT = 4;

export const products = [...facial, ...flash, ...devices]
  .sort((a, b) => a.order - b.order)
  .map((p) => {
    const spec = deviceSpecs[p.slug] || {};
    return {
      ...p,
      isDevice: p.category === 'beauty-devices',
      categoryInfo: getCategory(p.category),
      stepInfo: p.step === null ? null : getStepByNumber(p.step),
      technology: spec.technology || [],
      modes: spec.modes || [],
      lightFunctions: p.lightFunctions || null,
      images: getProductImages(p.slug),
      display: {
        benefits: splitBenefits(p.enhancedBenefits),
        ingredients: splitIngredients(p.activeIngredients),
        evidence: splitEvidence(p.scientificEvidence),
      },
    };
  });

const bySlug = new Map(products.map((p) => [p.slug, p]));
export const getProduct = (slug) => bySlug.get(slug) || null;

export const productsInCategory = (slug) => products.filter((p) => p.category === slug);
export const productsInStep = (number) => products.filter((p) => p.step === number);

export const categoriesWithCounts = categories.map((c) => ({ ...c, count: productsInCategory(c.slug).length }));
export const stepsWithCounts = steps.map((s) => ({ ...s, count: productsInStep(s.number).length }));

/** Related: same step first, then same category, in Master order. */
export function getRelated(product, limit = RELATED_LIMIT) {
  const pool = [];
  if (product.step !== null) pool.push(...productsInStep(product.step));
  pool.push(...productsInCategory(product.category));
  const seen = new Set([product.slug]);
  return pool.filter((p) => (seen.has(p.slug) ? false : seen.add(p.slug))).slice(0, limit);
}

export const featuredProducts = features.featuredProducts
  ? featuredSlugs.map(getProduct).filter(Boolean)
  : [];

/** Ingredient index: exact ingredient strings → products that list them. */
export const ingredientIndex = (() => {
  const map = new Map();
  for (const p of products) {
    for (const ing of p.display.ingredients) {
      if (!map.has(ing.name)) map.set(ing.name, []);
      map.get(ing.name).push({ slug: p.slug, name: p.name, concentration: ing.concentration });
    }
  }
  return [...map.entries()]
    .map(([name, entries]) => ({ name, entries }))
    .sort((a, b) => a.name.localeCompare(b.name, 'en', { sensitivity: 'base' }));
})();
