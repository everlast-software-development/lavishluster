/**
 * Image placeholder, used only where no photograph exists: the silk texture
 * in the same frame, a 1px gold inset frame, and (for products) the name and
 * subtitle set small in the lower third. Decorative — the real text is
 * always rendered next to it.
 */
export default function Placeholder({ title, subtitle }) {
  return (
    <div className="placeholder" aria-hidden="true">
      {title && (
        <div className="placeholder__text">
          <span className="placeholder__title">{title}</span>
          {subtitle && <span className="placeholder__subtitle">{subtitle}</span>}
        </div>
      )}
    </div>
  );
}
