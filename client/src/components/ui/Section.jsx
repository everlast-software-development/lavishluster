import SectionHeader from './SectionHeader.jsx';

/**
 * Standard section. layout="split": header left (5 of 12 columns), content
 * right; layout="stack": header above content. tone: pearl | white | silk | noir.
 */
export default function Section({ id, title, titleAs = 'h2', kicker, lead, children, tone = 'pearl', layout = 'split', align = 'left', className = '' }) {
  const headingId = id ? `${id}-title` : undefined;
  const hasHead = title || kicker;
  return (
    <section id={id} className={`section section--${tone} ${className}`.trim()} aria-labelledby={title ? headingId : undefined}>
      <div className={`container ${layout === 'split' && hasHead ? 'split' : 'stack'}`}>
        {hasHead && (
          <SectionHeader id={headingId} eyebrow={kicker} title={title} as={titleAs} align={align} tone={tone === 'noir' ? 'light' : 'dark'} />
        )}
        <div className="section__body">
          {lead && <p className="lead">{lead}</p>}
          {children}
        </div>
      </div>
    </section>
  );
}
