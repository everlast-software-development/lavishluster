import { useId } from 'react';

/**
 * Generated "luster plate": thin-film interference rings (Newton's rings),
 * the optical phenomenon behind the luster of pearl and nacre.
 * Ring radii follow r(n) = k·√n. Deterministic per seed so prerendered and
 * hydrated markup match. Used as the image slot fallback until real assets
 * are supplied, and as the brand visual where no photography exists.
 */
const PALETTES = {
  'facial-treatment': { base: '#E9EBE8', light: '#FBFBF9', rings: ['#C8C0D9', '#BCD5D0', '#DCCDB5'] },
  'flash-treatment': { base: '#ECE9E3', light: '#FCFBF8', rings: ['#DAC7AB', '#CCC3DC', '#C3D8D1'] },
  'beauty-devices': { base: '#E4E8E8', light: '#FAFBFB', rings: ['#B3C9CE', '#C6C0DA', '#C0D3C7'] },
  brand: { base: '#E6E9E6', light: '#FDFDFB', rings: ['#C4BCD8', '#B7D2CD', '#D9CAB1'] },
};

function hash(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}
function rng(seed) {
  let a = seed;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const f = (n) => Number(n.toFixed(2));

export default function LusterPlate({ seed = 'lavish-luster', variant = 'brand', ratio = 0.8, animate = false, density = 1, className = '' }) {
  const uid = useId().replace(/:/g, '');
  const pal = PALETTES[variant] || PALETTES.brand;
  const r = rng(hash(seed));
  const w = 400;
  const h = f(w / ratio);
  const cx = f(w * (0.3 + 0.4 * r()));
  const cy = f(h * (0.3 + 0.35 * r()));
  const diag = Math.hypot(Math.max(cx, w - cx), Math.max(cy, h - cy));
  const count = Math.round(34 * density);
  const k = diag / Math.sqrt(count);
  const offset = Math.floor(r() * 3);

  const rings = [];
  for (let n = 1; n <= count; n++) {
    const radius = k * Math.sqrt(n);
    const prev = k * Math.sqrt(n - 1);
    const band = radius - prev;
    rings.push({
      n,
      r: f(radius),
      sw: f(Math.max(0.45, band * 0.3)),
      color: pal.rings[(n + offset) % pal.rings.length],
      o: f(0.5 - (n / count) * 0.36),
    });
  }

  return (
    <svg
      className={`plate${animate ? ' plate--animate' : ''} ${className}`}
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
      style={{ '--ox': `${cx}px`, '--oy': `${cy}px` }}
    >
      <defs>
        <radialGradient id={`g${uid}`} cx={cx / w} cy={cy / h} r="0.85">
          <stop offset="0" stopColor={pal.light} />
          <stop offset="1" stopColor={pal.base} />
        </radialGradient>
      </defs>
      <rect width={w} height={h} fill={`url(#g${uid})`} />
      <g fill="none">
        {rings.map((ring) => (
          <circle
            key={ring.n}
            className="plate__ring"
            cx={cx}
            cy={cy}
            r={ring.r}
            stroke={ring.color}
            strokeWidth={ring.sw}
            strokeOpacity={ring.o}
            style={animate ? { '--i': ring.n } : undefined}
          />
        ))}
      </g>
      <circle cx={cx} cy={cy} r={f(k * 0.55)} fill={pal.light} opacity="0.85" />
    </svg>
  );
}
