/**
 * Centurion LED & NIR light functions (Master). Wavelength strings are shown
 * exactly as written; the spectrum strip is a derived visual that positions
 * each confirmed wavelength along the visible range.
 * The NIR row is withheld pending verification (V-03).
 */
const MIN = 420;
const MAX = 640;

function nmToTint(nm) {
  // Approximate hue for a wavelength, heavily desaturated to suit the palette.
  const t = Math.min(1, Math.max(0, (nm - 430) / (635 - 430)));
  const hue = 265 - t * 265;
  return `hsl(${hue.toFixed(0)} 32% 62%)`;
}

export default function LightFunctions({ data }) {
  const items = data.items.map((it) => ({ ...it, nm: parseInt(it.wavelength, 10) }));
  const sorted = [...items].sort((a, b) => a.nm - b.nm);
  return (
    <div className="light">
      <p className="light__intro">{data.intro}</p>
      <div className="light__spectrum" aria-hidden="true">
        <div className="light__band" />
        {sorted.map((it) => (
          <span
            key={it.name}
            className="light__marker"
            style={{ left: `${((it.nm - MIN) / (MAX - MIN)) * 100}%`, '--tint': nmToTint(it.nm) }}
          />
        ))}
        <span className="light__scale light__scale--min">{MIN} nm</span>
        <span className="light__scale light__scale--max">{MAX} nm</span>
      </div>
      <ul className="light__list">
        {items.map((it) => (
          <li key={it.name} style={{ '--tint': nmToTint(it.nm) }}>
            <span className="light__swatch" aria-hidden="true" />
            <span className="light__wavelength">{it.wavelength}</span>
            <span className="light__name">{it.name}</span>
            <span className="light__desc">{it.description}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
