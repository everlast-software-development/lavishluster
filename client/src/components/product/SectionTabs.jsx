import { useEffect, useState } from 'react';

/**
 * Section tabs: a full-width bar of in-page links to the detail rows. The link of the row being read is
 * marked (aria-current="location"); the first is marked until the page scrolls (and in the prerender).
 */
export default function SectionTabs({ items }) {
  const [active, setActive] = useState(items[0]?.id);
  const ids = items.map((i) => i.id).join(' ');

  useEffect(() => {
    const rows = ids.split(' ').map((id) => document.getElementById(id)).filter(Boolean);
    if (!rows.length || typeof IntersectionObserver === 'undefined') return undefined;
    // A row counts as "being read" while it crosses a line 35% down the viewport.
    const seen = new Map();
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => seen.set(e.target.id, e.isIntersecting));
      const current = rows.find((r) => seen.get(r.id));
      if (current) setActive(current.id);
    }, { rootMargin: '-35% 0px -64% 0px' });
    rows.forEach((r) => io.observe(r));
    return () => io.disconnect();
  }, [ids]);

  return (
    <nav className="pdp-tabs" aria-label="On this page">
      <div className="pdp-wrap">
        <ul className="pdp-tabs__list">
          {items.map((it) => (
            <li key={it.id}>
              <a href={`#${it.id}`} aria-current={active === it.id ? 'location' : undefined} onClick={() => setActive(it.id)}>{it.label}</a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
