/** Server configuration from environment variables (project-root .env; see .env.example). */
const bool = (v) => String(v).toLowerCase() === 'true';
const str = (v) => (typeof v === 'string' && v.trim() !== '' ? v.trim() : null);
const proxy = (v) => (v ? (/^\d+$/.test(v) ? Number(v) : v) : false);

export const config = {
  port: Number(process.env.PORT) || 3001,   // the host's assigned port (Railway sets PORT)
  // Listen on every IPv4 interface, so the host's proxy can reach the process (HOST overrides, e.g. "::").
  host: str(process.env.HOST) || '0.0.0.0',
  // Set when running behind a reverse proxy / load balancer (e.g. "1"), so req.ip is the visitor's IP
  // (used by the rate limit and sent to Turnstile).
  trustProxy: proxy(process.env.TRUST_PROXY),
  // 301s from old WordPress URLs — pending approval.
  redirects: bool(process.env.REDIRECTS_ENABLED),
  enquiry: {
    bodyLimit: '20kb',
    rateLimit: { windowMs: 15 * 60 * 1000, max: 5 },
  },
  // SMTP delivery (port 587 = STARTTLS: secure false + requireTLS).
  email: {
    host: str(process.env.EMAIL_HOST),
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: process.env.EMAIL_SECURE === 'true',
    user: str(process.env.EMAIL_USER),
    pass: str(process.env.EMAIL_PASS),
    to: str(process.env.EMAIL_TO),
  },
  // Cloudflare Turnstile (server-side verification). The public site key is a build-time client value.
  turnstile: { secret: str(process.env.TURNSTILE_SECRET_KEY) },
};
