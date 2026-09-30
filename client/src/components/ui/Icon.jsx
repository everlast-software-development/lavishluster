/**
 * Thin line icons for product detail sections (1px stroke, currentColor).
 * magnifier = Application Secret, hand-heart = Enhanced Benefits,
 * leaf = Active Ingredients, flask = Scientific Evidence.
 */
const PATHS = {
  magnifier: (
    <>
      <circle cx="14" cy="14" r="8.5" />
      <path d="M20.2 20.2 28 28" />
    </>
  ),
  'hand-heart': (
    <>
      <path d="M16 13.2c-1.6-3.2-6.4-2.6-6.4 1 0 2.6 3.4 4.8 6.4 7.2 3-2.4 6.4-4.6 6.4-7.2 0-3.6-4.8-4.2-6.4-1Z" />
      <path d="M3 24.5h5.5l4.2 2.5h7.1c1.2 0 1.2-2 0-2h-5.3" />
      <path d="M8.5 24.5 12 22h4.5l12.2-3.4c1.2-.3 1.8 1.4.6 1.9L19.8 25" />
    </>
  ),
  leaf: (
    <>
      <path d="M6 26C6 13 14 6 27 5c0 13-7 21-20 21Z" />
      <path d="M6 26 19 13" />
    </>
  ),
  flask: (
    <>
      <path d="M12.5 4h7M13.5 4v8.5L6 25.2c-.8 1.4.2 2.8 1.7 2.8h16.6c1.5 0 2.5-1.4 1.7-2.8L18.5 12.5V4" />
      <path d="M9.4 19.5h13.2" />
    </>
  ),
};

export default function Icon({ name, className = '' }) {
  const d = PATHS[name];
  if (!d) return null;
  return (
    <svg className={`icon ${className}`.trim()} viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      {d}
    </svg>
  );
}
