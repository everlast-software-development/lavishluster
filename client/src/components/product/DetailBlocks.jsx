/**
 * Product detail content blocks. All text is rendered exactly as it appears
 * in the Master; lists are the source text split along its own punctuation.
 */

export function Benefits({ product }) {
  const items = product.display.benefits;
  if (!items) return <p className="prose-lg">{product.enhancedBenefits}</p>;
  return (
    <ul className="benefit-list">
      {items.map((b) => <li key={b}>{b}</li>)}
    </ul>
  );
}

export function ApplicationSecret({ product }) {
  return (
    <div className="application">
      <p className="application__label">How to use</p>
      <p className="application__text">{product.applicationSecret}</p>
    </div>
  );
}

export function Ingredients({ product }) {
  return (
    <dl className="ingredient-list">
      {product.display.ingredients.map((ing) => (
        <div className="ingredient-list__row" key={ing.raw}>
          <dt>{ing.name}</dt>
          <dd>{ing.concentration || ''}</dd>
        </div>
      ))}
    </dl>
  );
}

export function Evidence({ product, compact = false }) {
  const items = product.display.evidence;
  const figures = items.filter((i) => i.figure);
  const statements = items.filter((i) => !i.figure);
  return (
    <div className={`evidence${compact ? ' evidence--compact' : ''}`}>
      {figures.length > 0 && (
        <ul className="evidence__figures">
          {figures.map((e) => (
            <li key={e.raw}>
              <span className="evidence__figure">{e.figure}</span>{' '}
              <span className="evidence__text">{e.text}</span>
            </li>
          ))}
        </ul>
      )}
      {statements.length > 0 && (
        <ul className="evidence__statements">
          {statements.map((e) => <li key={e.raw}>{e.text}</li>)}
        </ul>
      )}
    </div>
  );
}

export function Technology({ product }) {
  return (
    <ul className="spec-list">
      {product.technology.map((t) => <li key={t.text}>{t.text}</li>)}
    </ul>
  );
}

export function Modes({ product }) {
  return (
    <dl className="mode-list">
      {product.modes.map((m) => (
        <div className="mode-list__row" key={m.label}>
          <dt>{m.label}</dt>
          {m.description && <dd>{m.description}</dd>}
        </div>
      ))}
    </dl>
  );
}
