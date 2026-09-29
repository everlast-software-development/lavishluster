/**
 * Display helpers. They only SPLIT verbatim Master strings along the source's
 * own punctuation; every fragment returned is an exact substring of the input
 * (verified by scripts/verify-content.mjs). No words are added or changed.
 */

const stripEnd = (s) => s.replace(/\.$/, '');

/** Enhanced Benefits: split at "; " when the source is a semicolon list. */
export function splitBenefits(text) {
  if (!text) return null;
  const parts = text.split('; ');
  if (parts.length < 2) return null; // render as a paragraph
  return parts.map((p) => stripEnd(p.replace(/^and /, '')));
}

/** Active Ingredients: split at ", " and separate a trailing "(n%)" concentration. */
export function splitIngredients(text) {
  if (!text) return [];
  return stripEnd(text).split(', ').map((raw) => {
    const m = raw.match(/^(.*) \((\d+(?:\.\d+)?%)\)$/);
    return m ? { name: m[1], concentration: m[2], raw } : { name: raw, concentration: null, raw };
  });
}

const FIGURE = /^(\d[\d.,]*%|\d+ (?:years|hours|times)|\d+-hour)\s(.+)$/;

/** Scientific Evidence: split at "; " and separate a leading figure where present. */
export function splitEvidence(text) {
  if (!text) return [];
  return text.split('; ').map((part) => {
    const s = stripEnd(part.trim());
    const m = s.match(FIGURE);
    return m ? { figure: m[1], text: m[2], raw: s } : { figure: null, text: s, raw: s };
  });
}
