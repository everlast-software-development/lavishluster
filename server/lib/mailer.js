import nodemailer from 'nodemailer';
import { config } from './config.js';

let transporter = null;

/** All four are required; without them POST /api/enquiry answers 503 (the site keeps running). */
export const mailerConfigured = () => Boolean(config.email.host && config.email.user && config.email.pass && config.email.to);

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: config.email.host,
      port: config.email.port,
      secure: config.email.secure,
      requireTLS: true, // port 587: upgrade with STARTTLS, never send in clear text
      auth: { user: config.email.user, pass: config.email.pass },
    });
  }
  return transporter;
}

/** On startup: logs "SMTP ready" or a clear error — never a credential. */
export async function verifyMailer() {
  if (!mailerConfigured()) {
    console.warn('SMTP not configured: EMAIL_HOST, EMAIL_USER, EMAIL_PASS and EMAIL_TO are required; POST /api/enquiry answers 503.');
    return false;
  }
  try {
    await getTransporter().verify();
    console.log('SMTP ready');
    return true;
  } catch (err) {
    console.error(`SMTP error: ${err.code || 'ERROR'} — ${err.message}`);
    return false;
  }
}

const oneLine = (s) => String(s ?? '').replace(/[\r\n]+/g, ' ').trim();
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const dubaiTime = () => `${new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Dubai', dateStyle: 'full', timeStyle: 'short' }).format(new Date())} (Asia/Dubai)`;

/**
 * The email for one enquiry (already validated and trimmed): to EMAIL_TO, from the authenticated account,
 * Reply-To the visitor, plain text + escaped HTML. Internal email strings only — not website copy.
 */
export function buildEnquiryMessage(data, { pageUrl } = {}) {
  const kind = data.type === 'consultation' ? 'Consultation Request' : 'General Enquiry';
  // Single-line fields stay single-line here too (the shared validation already strips CR/LF).
  const rows = [
    ['Type', kind],
    ['Name', oneLine(data.name)],
    ['Email', oneLine(data.email)],
    ['Phone', oneLine(data.phone) || '—'],
    ['Subject', oneLine(data.subject) || '—'],
    ['Date/time', dubaiTime()],
    ['Page', pageUrl || '—'],
  ];
  const text = `${rows.map(([k, v]) => `${k}: ${v}`).join('\n')}\n\nMessage:\n${data.message}\n`;
  const html = [
    '<!doctype html><html><body style="font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.5;color:#1c1b19">',
    `<p style="margin:0 0 12px"><strong>${esc(kind)}</strong> from the Lavish Luster website</p>`,
    '<table cellpadding="6" cellspacing="0" style="border-collapse:collapse">',
    ...rows.map(([k, v]) => `<tr><td style="color:#6f6860;vertical-align:top">${esc(k)}</td><td>${esc(v)}</td></tr>`),
    '</table>',
    '<p style="margin:16px 0 4px;color:#6f6860">Message</p>',
    `<p style="margin:0;white-space:pre-wrap">${esc(data.message)}</p>`,
    '</body></html>',
  ].join('');

  return {
    from: { name: 'Lavish Luster Website', address: config.email.user },
    to: config.email.to,
    replyTo: oneLine(data.email),
    subject: `[Lavish Luster] ${kind} — ${oneLine(data.name)}`,
    text,
    html,
  };
}

/** Sends one enquiry through the SMTP transport. */
export async function sendEnquiry(data, meta) {
  await getTransporter().sendMail(buildEnquiryMessage(data, meta));
}
