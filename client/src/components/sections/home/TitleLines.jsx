import nb from '../../ui/nb.jsx';

/**
 * A section title set on fixed lines. The lines come from `titleLines` in
 * home.js and always join back to the verbatim title (checked by
 * scripts/verify-website-content.mjs); a trailing space keeps the words
 * apart in the text content.
 */
export default function TitleLines({ id, lines, title, as: Tag = 'h2', className = '' }) {
  const parts = lines || [title];
  return (
    <Tag id={id} className={`home-title ${className}`.trim()}>
      {parts.map((line, i) => (
        <span key={line} className="home-title__line">{nb(line)}{i < parts.length - 1 && ' '}</span>
      ))}
    </Tag>
  );
}
