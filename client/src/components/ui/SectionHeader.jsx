/**
 * Section header: optional eyebrow, the title, optional lead.
 * Left-aligned by default; align="center" only where the design calls for it.
 */
export default function SectionHeader({ id, eyebrow, title, lead, as: Title = 'h2', align = 'left', tone = 'dark', className = '' }) {
  return (
    <header className={`section-header section-header--${align}${tone === 'light' ? ' section-header--light' : ''} ${className}`.trim()}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      {title && <Title id={id} className="section-title">{title}</Title>}
      {lead && <p className="lead">{lead}</p>}
    </header>
  );
}
