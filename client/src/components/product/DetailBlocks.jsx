import { evidenceHighlight } from '../../utils/text.js';

/**
 * Product detail content blocks (the spec-sheet template). All text is rendered exactly as it appears in
 * the Master; lists are the source text split along its own punctuation (utils/text.js). Item numbers
 * (01, 02 …) are presentation only. Nothing is shown for a field a product does not have.
 */

const pad = (n) => String(n).padStart(2, '0');

/** Enhanced Benefits: a numbered 2-column list where the source is a list; otherwise the paragraph as written. */
export function Benefits({ product }) {
  const items = product.display.benefits;
  if (!items) return <p className="pdp-text">{product.enhancedBenefits}</p>;
  return (
    <ol className="pdp-benefits">
      {items.map((b, i) => (
        <li key={b} className="pdp-benefits__item">
          <span className="pdp-benefits__num" aria-hidden="true">{pad(i + 1)}</span>
          <span className="pdp-benefits__text">{b}</span>
        </li>
      ))}
    </ol>
  );
}

/** Application Secret, under the template's small "How to use" label. */
export function ApplicationSecret({ product }) {
  return (
    <>
      <p className="pdp-label">How to use</p>
      <p className="pdp-application">{product.applicationSecret}</p>
    </>
  );
}

/** Active Ingredients: name left, concentration right (empty when the Master gives none). */
export function Ingredients({ product }) {
  return (
    <dl className="pdp-ingredients">
      {product.display.ingredients.map((ing) => (
        <div className="pdp-ingredients__row" key={ing.raw}>
          <dt className="pdp-ingredients__name">{ing.name}</dt>
          <dd className="pdp-ingredients__pct">{ing.concentration || ''}</dd>
        </div>
      ))}
    </dl>
  );
}

/** The evidence highlight: the figure, then the rest of the item (uppercase by CSS only). */
function Highlight({ item, className }) {
  return (
    <p className={`pdp-highlight ${className}`}>
      <span className="pdp-highlight__figure">{item.figure}</span>{' '}
      <span className="pdp-highlight__label">{item.text}</span>
    </p>
  );
}

/**
 * Hero key-result strip (a summary of the product's own evidence, no new strings): with a stat, its first
 * stat, a 1px divider and the claims stacked; with no stat, the first claim alone; no evidence, no strip.
 */
export function EvidenceStrip({ product }) {
  const items = product.display.evidence;
  if (items.length === 0) return null;
  const { highlight } = evidenceHighlight(items);
  const claims = items.filter((e) => !e.figure);
  if (!highlight) {
    return (
      <div className="pdp-strip pdp-strip--claim">
        <p className="pdp-strip__claim">{claims[0].raw}</p>
      </div>
    );
  }
  return (
    <div className="pdp-strip">
      <Highlight item={highlight} className="pdp-strip__highlight" />
      {claims.length > 0 && <span className="pdp-strip__divider" aria-hidden="true" />}
      {claims.length > 0 && (
        <ul className="pdp-strip__lines">
          {claims.map((e) => <li key={e.raw}>{e.raw}</li>)}
        </ul>
      )}
    </div>
  );
}

/**
 * Scientific Evidence row: the first stat (left), then the other stats (value in gold, then the label) and
 * every claim as a hairline list (right); no stat → the list takes the full width.
 */
export function Evidence({ product }) {
  const { highlight, rest } = evidenceHighlight(product.display.evidence);
  const stats = rest.filter((e) => e.figure);
  const claims = rest.filter((e) => !e.figure);
  return (
    <div className={`pdp-evidence${highlight ? '' : ' pdp-evidence--list'}`}>
      {highlight && <Highlight item={highlight} className="pdp-evidence__highlight" />}
      {rest.length > 0 && (
        <ul className="pdp-list">
          {stats.map((e) => (
            <li key={e.raw} className="pdp-list__stat">
              <span className="pdp-list__value">{e.figure}</span>{' '}
              <span className="pdp-list__label">{e.text}</span>
            </li>
          ))}
          {claims.map((e) => <li key={e.raw}>{e.raw}</li>)}
        </ul>
      )}
    </div>
  );
}

/** Device technology, as named in the Master (data/devices/specs.js). */
export function Technology({ product }) {
  return (
    <ul className="pdp-list">
      {product.technology.map((t) => <li key={t.text}>{t.text}</li>)}
    </ul>
  );
}

/** Device modes, only where the Master names them. */
export function Modes({ product }) {
  return (
    <dl className="pdp-modes">
      {product.modes.map((m) => (
        <div className="pdp-modes__row" key={m.label}>
          <dt className="pdp-modes__label">{m.label}</dt>
          {m.description && <dd className="pdp-modes__desc">{m.description}</dd>}
        </div>
      ))}
    </dl>
  );
}
