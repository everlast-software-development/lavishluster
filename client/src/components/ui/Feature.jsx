import { features } from '../../data/config/features.js';

/**
 * Gate for pending sections. Renders children only when the flag is on
 * AND (if given) the data is non-empty — so enabling a section later is a
 * data/config change, never a page rebuild.
 */
export default function Feature({ flag, data, children }) {
  if (!features[flag]) return null;
  if (data !== undefined && (data === null || (Array.isArray(data) && data.length === 0))) return null;
  return children;
}
