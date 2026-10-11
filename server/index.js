/**
 * Lavish Luster server.
 *  - POST /api/enquiry   contact / consultation enquiries, emailed via SMTP, protected by Cloudflare Turnstile
 *                        (503 until the EMAIL_* and TURNSTILE_SECRET_KEY variables are set)
 *  - GET  /api/health    health check
 *  - Static hosting of the prerendered client build (client/dist) with clean URLs.
 * There is no commerce backend of any kind.
 */
import './lib/env.js'; // first: loads the project-root .env before the configuration is read
import express from 'express';
import { existsSync } from 'node:fs';
import { dirname, join, resolve, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { config } from './lib/config.js';
import { rateLimit } from './lib/rateLimit.js';
import { mailerConfigured, sendEnquiry, verifyMailer } from './lib/mailer.js';
import { verifyTurnstile } from './lib/turnstile.js';
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
      // Cloudflare Turnstile (Contact form): its script, its iframe and its verification calls.
      "script-src 'self' https://challenges.cloudflare.com",
      "font-src 'self'",
      "connect-src 'self' https://challenges.cloudflare.com",
      'frame-src https://www.google.com https://maps.google.com https://challenges.cloudflare.com',
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'self'",
    ].join('; '),
  );
  next();
});

// ---------- API ----------
const api = express.Router();
// 1 · Body size: 20kb (larger → 413).
api.use(express.json({ limit: config.enquiry.bodyLimit }));

api.get('/health', (req, res) => {
  res.json({ ok: true, enquiry: { mailer: mailerConfigured(), turnstile: Boolean(config.turnstile.secret) } });
});

/** The page the enquiry was sent from (Referer), for the email only. */
const pageUrlFrom = (req) => {
  const ref = String(req.get('referer') || '').replace(/[\r\n]/g, '').slice(0, 500);
  return /^https?:\/\//.test(ref) ? ref : null;
};

/**
 * POST /api/enquiry { type, name, email, phone?, subject?, message, website, turnstileToken }
 * Checks, in order: body size → rate limit (5 / 15 min / IP) → honeypot → Turnstile → validation → send.
 * 200 {ok:true} · 400 {ok:false, code:"invalid", errors:{field: code}} · 403 {ok:false, code:"verification_failed"}
 * · 429 {ok:false, code:"rate_limited"} · 500 {ok:false} · 503 {ok:false, code:"unavailable"} (env missing).
 */
api.post('/enquiry', rateLimit(config.enquiry.rateLimit), async (req, res) => {
  if (!mailerConfigured() || !config.turnstile.secret) return res.status(503).json({ ok: false, code: 'unavailable' });
  const body = req.body && typeof req.body === 'object' ? req.body : {};
  // 3 · Honeypot: accept silently, send nothing.
  if (typeof body.website === 'string' && body.website.trim() !== '') return res.status(200).json({ ok: true });
  // 4 · Turnstile, verified server-side.
  if (!(await verifyTurnstile(body.turnstileToken, req.ip, config.turnstile.secret))) {
    return res.status(403).json({ ok: false, code: 'verification_failed' });
  }
  // 5 · Validation (shared with the form): per-field codes.
  const { data, errors, valid } = validateInquiry(body);
  if (!valid) return res.status(400).json({ ok: false, code: 'invalid', errors });
  try {
    await sendEnquiry(data, { pageUrl: pageUrlFrom(req) });
    console.log(`[enquiry] sent: ${data.type === 'consultation' ? 'Consultation Request' : 'General Enquiry'}`);   // no personal data in logs
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('[enquiry] send failed:', err.code || 'ERROR', err.message);
    return res.status(500).json({ ok: false });
  }
});

api.use((req, res) => res.status(404).json({ ok: false, code: 'not_found' }));
// Body too large / not JSON → JSON errors, never an HTML page.
api.use((err, req, res, next) => {
  if (err.type === 'entity.too.large') return res.status(413).json({ ok: false, code: 'too_large' });
  if (err.type === 'entity.parse.failed') return res.status(400).json({ ok: false, code: 'invalid_json' });
  return next(err);
});
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
  console.log(`Lavish Luster server on http://localhost:${config.port}`);
  verifyMailer();
});
