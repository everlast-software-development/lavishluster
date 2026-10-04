/**
 * Lavish Luster server.
 *  - POST /api/inquiry   contact / consultation enquiries (OFF unless INQUIRY_ENABLED=true)
 *  - GET  /api/health    health check
 *  - Static hosting of the prerendered client build (client/dist) with clean URLs.
 * There is no commerce backend of any kind.
 */
import express from 'express';
import { existsSync } from 'node:fs';
import { dirname, join, resolve, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { config } from './lib/config.js';
import { rateLimit } from './lib/rateLimit.js';
import { mailerConfigured, sendInquiry } from './lib/mailer.js';
import { validateInquiry } from '../shared/inquiry.js';
import { legacyRedirects, routeRedirects } from './lib/redirects.js';

const here = dirname(fileURLToPath(import.meta.url));
const DIST = resolve(here, '../client/dist');

const app = express();
app.disable('x-powered-by');
if (config.trustProxy) app.set('trust proxy', config.trustProxy);

app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  res.setHeader(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "img-src 'self' data:",
      "style-src 'self' 'unsafe-inline'",
      "script-src 'self'",
      "font-src 'self'",
      "connect-src 'self'",
      'frame-src https://www.google.com https://maps.google.com',
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'self'",
    ].join('; '),
  );
  next();
});

// ---------- API ----------
const api = express.Router();
api.use(express.json({ limit: '16kb' }));

api.get('/health', (req, res) => {
  res.json({ ok: true, inquiry: { enabled: config.inquiry.enabled, mailer: mailerConfigured() } });
});

api.post('/inquiry', rateLimit(config.inquiry.rateLimit), async (req, res) => {
  if (!config.inquiry.enabled || !mailerConfigured()) {
    return res.status(503).json({ error: 'inquiry_disabled', message: 'Online enquiries are not open yet.' });
  }
  const body = req.body || {};
  // Honeypot: silently accept and drop.
  if (typeof body.website === 'string' && body.website.trim() !== '') {
    return res.status(202).json({ ok: true });
  }
  const { data, errors, valid } = validateInquiry(body, { consentRequired: config.inquiry.consentRequired });
  if (!valid) return res.status(422).json({ error: 'invalid', errors });
  try {
    await sendInquiry(data);
    return res.status(202).json({ ok: true });
  } catch (err) {
    console.error('[inquiry] delivery failed:', err.message);
    return res.status(502).json({ error: 'delivery_failed', message: 'The enquiry could not be delivered.' });
  }
});

api.use((req, res) => res.status(404).json({ error: 'not_found' }));
app.use('/api', api);

// ---------- Static site ----------
app.use(routeRedirects);
if (config.redirects) app.use(legacyRedirects);
if (existsSync(DIST)) {
  app.use('/assets', express.static(join(DIST, 'assets'), { immutable: true, maxAge: '1y', fallthrough: false }));
  app.use(express.static(DIST, { index: false, redirect: false, maxAge: '1h' }));

  app.get('*', (req, res) => {
    const clean = normalize(decodeURIComponent(req.path)).replace(/^(\.\.[/\\])+/, '').replace(/\/+$/, '');
    const candidate = join(DIST, clean, 'index.html');
    res.setHeader('Cache-Control', 'no-cache');
    if (candidate.startsWith(DIST) && existsSync(candidate)) return res.sendFile(candidate);
    return res.status(404).sendFile(join(DIST, '404.html'));
  });
} else {
  console.warn('client/dist not found — run `npm run build` to serve the website.');
}

app.listen(config.port, () => {
  console.log(`Lavish Luster server on http://localhost:${config.port} (inquiry ${config.inquiry.enabled ? 'ENABLED' : 'disabled'})`);
});
