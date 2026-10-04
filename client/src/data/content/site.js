/**
 * Verified Lavish Luster brand texts (from the previous lavishluster.com Home
 * and About pages), assembled from the page copy files, which follow
 * content-source/website-content.md. scripts/verify-content.mjs checks every
 * string in `site` and `lusterscan` against content-source/old-site-verified.md,
 * so the brand texts are verified against both sources. Components read the
 * page copy files directly (home.js, about.js, lusterscan.js, …), not this file.
 * `verbatim` gives the old-site spelling of a label shown in another case.
 */
import { home } from './home.js';
import { about } from './about.js';
import { lusterscanPage } from './lusterscan.js';

export const site = {
  heroTitle: { text: home.hero.title },
  pillars: { items: home.hero.pillars },
  intro: {
    title: { text: home.philosophy.title },
    body: { text: home.philosophy.text },
  },
  science: {
    label: { text: home.science.eyebrow, verbatim: 'CLINICAL EXCELLENCE' },
    title: { text: home.science.title },
    body: { text: home.science.text },
  },
  results: {
    label: { text: home.results.eyebrow },
    title: { text: home.results.title },
    body: { text: home.results.text },
  },
  story: { text: about.story.text },
  vision: { text: about.vision.text },
  mission: { text: about.mission.text },
  values: { items: about.values.items },
};

export const lusterscan = {
  label: { text: home.lusterscan.eyebrow, verbatim: 'AI-POWERED DIAGNOSTICS' },
  homeTitle: home.lusterscan.title,
  description: home.lusterscan.text,
  steps: home.lusterscan.steps.map(({ title, text }) => ({ title, text })),
  analyzes: lusterscanPage.analyzes.items,
  disclaimer: home.lusterscan.note,
};
