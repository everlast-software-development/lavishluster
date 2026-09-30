import { Link } from 'react-router-dom';

/** Primary button. variant="primary" (ink fill) or "light" (pearl fill, for dark sections). No icons. */
export function ButtonLink({ to, children, variant = 'primary', className = '', ...rest }) {
  return (
    <Link to={to} className={`btn btn--${variant} ${className}`.trim()} {...rest}>
      {children}
    </Link>
  );
}

/** Tracked uppercase text link with a thin gold underline. tone="light" on photography and noir. */
export function TextLink({ to, children, tone = 'dark', className = '', ...rest }) {
  return (
    <Link to={to} className={`text-link${tone === 'light' ? ' text-link--light' : ''} ${className}`.trim()} {...rest}>
      {children}
    </Link>
  );
}
