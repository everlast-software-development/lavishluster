/**
 * Standard section. Headings always sit in the left column of the grid
 * (columns 1–4 on desktop) and content in the right (5–12), so heading
 * alignment is identical across every page.
 */
export default function Section({ id, title, titleAs: Title = 'h2', kicker, lead, children, tone = 'plain', layout = 'split', className = '' }) {
  const headingId = id ? `${id}-title` : undefined;
  return (
    <section id={id} className={`section section--${tone} ${className}`} aria-labelledby={title ? headingId : undefined}>
      <div className={`container ${layout === 'split' ? 'split' : 'stack'}`}>
        {(title || kicker) && (
          <header className="section__head">
            {kicker && <p className="kicker">{kicker}</p>}
            {title && <Title id={headingId} className="section__title">{title}</Title>}
          </header>
        )}
        <div className="section__body">
          {lead && <p className="lead">{lead}</p>}
          {children}
        </div>
      </div>
    </section>
  );
}
