/** Server configuration from environment variables (see .env.example). */
const bool = (v) => String(v).toLowerCase() === 'true';

export const config = {
  port: Number(process.env.PORT) || 3001,
  trustProxy: process.env.TRUST_PROXY || false,
  // 301s from old WordPress URLs — pending approval.
  redirects: bool(process.env.REDIRECTS_ENABLED),
  inquiry: {
    // Stays false until the Privacy Policy and consent wording are published.
    enabled: bool(process.env.INQUIRY_ENABLED),
    consentRequired: process.env.INQUIRY_CONSENT_REQUIRED === undefined ? true : bool(process.env.INQUIRY_CONSENT_REQUIRED),
    to: process.env.INQUIRY_TO || null,
    from: process.env.INQUIRY_FROM || null,
    rateLimit: {
      windowMs: Number(process.env.INQUIRY_RATE_WINDOW_MS) || 15 * 60 * 1000,
      max: Number(process.env.INQUIRY_RATE_MAX) || 5,
    },
  },
  smtp: {
    host: process.env.SMTP_HOST || null,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: bool(process.env.SMTP_SECURE),
    user: process.env.SMTP_USER || null,
    pass: process.env.SMTP_PASS || null,
  },
};
