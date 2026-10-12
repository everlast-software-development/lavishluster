/**
 * Catalog taxonomy. Labels are taken from the Master document
 * (step headings are title-cased for display; the source label is kept).
 * Counts are always derived from the catalog, never stored.
 */
import masterBrand from './content/master-brand.json';

const titleCase = (s) =>
  s.toLowerCase().replace(/(^|[\s—-])([a-z])/g, (m, pre, ch) => pre + ch.toUpperCase());

const STEP_SLUGS = ['cleanse', 'nourish-repair', 'correct', 'moisturize-prevent', 'protect', 'intensive-rejuvenation', 'corporal-treatment'];

export const steps = Object.entries(masterBrand.steps).map(([num, sourceLabel]) => {
  const [label, group] = sourceLabel.split(' — ');
  return {
    number: Number(num),   // the Master's own key, 0–6 (data, filters and checks use this)
    // What the site shows: counted from 1 (Cleanse = Step 01, Nourish & Repair = Step 02 … Corporal Treatment = Step 07).
    display: `Step ${String(Number(num) + 1).padStart(2, '0')}`,
    slug: STEP_SLUGS[Number(num)],
    label: titleCase(label),
    group: group ? titleCase(group) : null,
    sourceLabel,
  };
});

const firstSentence = (s) => (s ? s.match(/^.*?\.(\s|$)/)[0].trim() : null);

export const categories = [
  {
    slug: 'facial-treatment',
    label: 'Facial Treatment',
    sourceLabel: masterBrand.categories['facial-treatment'].sourceLabel,
    description: masterBrand.categories['facial-treatment'].description,
  },
  {
    slug: 'flash-treatment',
    label: 'Flash Treatment',
    sourceLabel: masterBrand.categories['flash-treatment'].sourceLabel,
    // Only the first sentence describes the products; the second describes the document.
    description: firstSentence(masterBrand.categories['flash-treatment'].description),
  },
  {
    slug: 'beauty-devices',
    // Display label per brief; Master source label "Beaut Device" is kept (V-08).
    label: 'Beauty Devices',
    sourceLabel: masterBrand.categories['beauty-devices'].sourceLabel,
    // The Master line for devices describes the document, not the products.
    description: null,
  },
];

export const getCategory = (slug) => categories.find((c) => c.slug === slug) || null;
export const getStepByNumber = (n) => steps.find((s) => s.number === n) || null;
export const getStepBySlug = (slug) => steps.find((s) => s.slug === slug) || null;
