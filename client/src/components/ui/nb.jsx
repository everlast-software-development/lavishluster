import { useSyncExternalStore } from 'react';

/**
 * Keep hyphenated words whole below 1024px: "Luster Exosome Bio-Shield" → "Luster Exosome <span class="nb">Bio-Shield</span>".
 * Each whitespace-separated token that contains a hyphen (with any punctuation attached) is wrapped in a span
 * that cannot wrap (`.nb`, base.css), so headings, labels and product names never break after the hyphen on
 * phones. The characters are unchanged.
 *
 * The spans exist only below 1024px: the prerendered HTML and desktop render the plain text exactly as before
 * (extra elements shift glyph positioning by fractions of a pixel, and desktop must stay pixel-identical). On
 * phones and tablets the app switches to the wrapped words right after it starts (useCompact).
 */
const QUERY = '(max-width: 1023px)';
const subscribe = (cb) => {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener('change', cb);
  return () => mq.removeEventListener('change', cb);
};
/** true below 1024px, in the browser only (false while prerendering and during hydration). */
export const useCompact = () => useSyncExternalStore(subscribe, () => window.matchMedia(QUERY).matches, () => false);

function NoBreak({ text }) {
  const compact = useCompact();
  if (!compact) return text;
  // One wrapper span: in a flex container (eyebrows with a rule before them) the text stays a single item.
  return <span>{text.split(/(\s+)/).map((part, i) => (/\S-\S/.test(part) ? <span key={i} className="nb">{part}</span> : part))}</span>;
}

export default function nb(text) {
  if (typeof text !== 'string' || !/\S-\S/.test(text)) return text;
  return <NoBreak text={text} />;
}
