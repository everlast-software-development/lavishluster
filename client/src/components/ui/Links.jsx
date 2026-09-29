import { Link } from 'react-router-dom';

export function ButtonLink({ to, children, variant = 'primary', ...rest }) {
  return (
    <Link to={to} className={`btn btn--${variant}`} {...rest}>
      {children}
    </Link>
  );
}

export function TextLink({ to, children, ...rest }) {
  return (
    <Link to={to} className="text-link" {...rest}>
      {children}
    </Link>
  );
}
