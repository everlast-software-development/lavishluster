import { useEffect, useId, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { requiredValid, validateInquiry } from '../../../../shared/inquiry.js';
import Turnstile from '../../components/ui/Turnstile.jsx';
import { features } from '../../data/config/features.js';
import { integrations } from '../../data/config/integrations.js';
import { contact } from '../../data/content/contact.js';
import { enquiryCopy } from '../../data/content/enquiry.js';

const EMPTY = { type: 'general', name: '', email: '', phone: '', subject: '', message: '', consent: false, website: '' };
const FIELDS = ['name', 'email', 'phone', 'subject', 'message'];

// The public Turnstile site key (TURNSTILE_SITE_KEY in the project-root .env, injected at build time).
const SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY || '';
// Submission goes live once the form copy is approved and the flag is on. VITE_ENQUIRY_PREVIEW is a local
// testing switch only (never set in .env or on a production build).
const LIVE = (features.inquirySubmission && enquiryCopy.approved) || import.meta.env.VITE_ENQUIRY_PREVIEW === 'true';

/** A copy string with {email} replaced by the address, as a mailto link. */
const withEmail = (text) => {
  const [before, after = ''] = text.split('{email}');
  return <>{before}<a href={`mailto:${contact.email}`}>{contact.email}</a>{after}</>;
};

function Field({ id, label, error, optional, children }) {
  return (
    <div className={`field${error ? ' field--error' : ''}`}>
      <label htmlFor={id}>
        {label}
        {optional && <span className="field__optional"> (optional)</span>}
      </label>
      {children}
      {error && <p className="field__error" id={`${id}-error`}>{error}</p>}
    </div>
  );
}

/**
 * Contact / consultation form → POST /api/enquiry (emailed via SMTP, protected by Cloudflare Turnstile).
 * Validation is shared with the server (shared/inquiry.js, per-field codes → approved copy). The button is
 * enabled only when name, email and message are valid AND a Turnstile token exists. Until the copy is
 * approved (LIVE false) the form keeps its closed state: the note, typeable fields, the button disabled.
 */
export default function InquiryForm() {
  const uid = useId().replace(/:/g, '');
  const [params] = useSearchParams();
  const [values, setValues] = useState(EMPTY);
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [serverErrors, setServerErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | success | error | verification | rate
  const [token, setToken] = useState(null);
  const formRef = useRef(null);
  const turnstile = useRef(null);

  // Input modality for the focus style: the label turns gold on keyboard focus only (browsers treat any
  // focus in a text field as :focus-visible). Set on the form element directly — no re-render.
  useEffect(() => {
    const mark = (m) => () => { if (formRef.current) formRef.current.dataset.modality = m; };
    const onPointer = mark('pointer'), onKey = mark('keyboard');
    document.addEventListener('pointerdown', onPointer, true);
    document.addEventListener('keydown', onKey, true);
    return () => { document.removeEventListener('pointerdown', onPointer, true); document.removeEventListener('keydown', onKey, true); };
  }, []);

  useEffect(() => {
    if (LIVE && !SITE_KEY && import.meta.env.DEV) {
      console.warn('[enquiry] TURNSTILE_SITE_KEY is not set (project-root .env): the Turnstile widget is not rendered and the form cannot be sent.');
    }
  }, []);

  useEffect(() => {
    if (params.get('type') === 'consultation') setValues((v) => ({ ...v, type: 'consultation' }));
  }, [params]);

  const consentText = integrations.inquiry.consentText;
  const { errors: clientErrors, valid } = validateInquiry(values);
  const errorFor = (name) => {
    if (!LIVE) return null;
    const code = serverErrors[name] || ((touched[name] || submitted) && clientErrors[name]);
    return code ? enquiryCopy.fields[name]?.[code] || null : null;
  };

  const id = (name) => `${uid}-${name}`;
  const set = (name) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setValues((v) => ({ ...v, [name]: value }));
    if (serverErrors[name]) setServerErrors((er) => ({ ...er, [name]: undefined }));
    if (status !== 'idle' && status !== 'sending') setStatus('idle');
  };
  const blur = (name) => () => setTouched((t) => (t[name] ? t : { ...t, [name]: true }));
  const aria = (name) => (errorFor(name) ? { 'aria-invalid': true, 'aria-describedby': `${id(name)}-error` } : {});

  const sending = status === 'sending';
  const canSend = LIVE && Boolean(SITE_KEY) && Boolean(token) && requiredValid(values) && !sending;

  async function onSubmit(e) {
    e.preventDefault();
    if (!LIVE || sending) return;
    setSubmitted(true);
    if (!valid) {
      const first = FIELDS.find((f) => clientErrors[f]);
      formRef.current?.querySelector(`[name="${first}"]`)?.focus();
      return;
    }
    if (!token) return;
    setStatus('sending');
    setServerErrors({});
    try {
      const { type, name, email, phone, subject, message, website } = values;
      const res = await fetch(integrations.inquiry.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, name, email, phone, subject, message, website, turnstileToken: token }),
      });
      const body = await res.json().catch(() => ({}));
      if (res.ok && body.ok) {
        setValues((v) => ({ ...EMPTY, type: v.type }));
        setTouched({});
        setSubmitted(false);
        setStatus('success');
      } else if (res.status === 400 && body.errors) {
        setServerErrors(body.errors);
        setStatus('idle');
      } else if (res.status === 403) setStatus('verification');
      else if (res.status === 429) setStatus('rate');
      else setStatus('error');
    } catch {
      setStatus('error');
    } finally {
      turnstile.current?.reset();   // a token is single-use: a fresh one for the next submit
    }
  }

  const statusText = {
    success: enquiryCopy.success,
    error: withEmail(enquiryCopy.error),
    verification: enquiryCopy.verificationFailed,
    rate: enquiryCopy.rateLimited,
  }[status];

  return (
    <form ref={formRef} className="inquiry" onSubmit={onSubmit} noValidate aria-describedby={`${uid}-notice`}>
      <p className="inquiry__notice" id={`${uid}-notice`}>
        {LIVE ? withEmail(enquiryCopy.note) : (
          <>Online enquiries are not open yet. You can reach us at{' '}<a href={`mailto:${contact.email}`}>{contact.email}</a>.</>
        )}
      </p>
      <div className="inquiry__type" role="radiogroup" aria-label="Enquiry type">
        <label className={values.type === 'general' ? 'is-active' : ''}>
          <input type="radio" name="type" value="general" checked={values.type === 'general'} onChange={set('type')} />
          General enquiry
        </label>
        <label className={values.type === 'consultation' ? 'is-active' : ''}>
          <input type="radio" name="type" value="consultation" checked={values.type === 'consultation'} onChange={set('type')} />
          Request a consultation
        </label>
      </div>
      <fieldset>
        <legend className="visually-hidden">Enquiry details</legend>
        <div className="inquiry__grid">
          <Field id={id('name')} label="Name" error={errorFor('name')}>
            <input id={id('name')} name="name" autoComplete="name" required value={values.name} onChange={set('name')} onBlur={blur('name')} {...aria('name')} />
          </Field>
          <Field id={id('email')} label="Email" error={errorFor('email')}>
            <input id={id('email')} name="email" type="email" autoComplete="email" required value={values.email} onChange={set('email')} onBlur={blur('email')} {...aria('email')} />
          </Field>
          <Field id={id('phone')} label="Phone" optional error={errorFor('phone')}>
            <input id={id('phone')} name="phone" type="tel" autoComplete="tel" value={values.phone} onChange={set('phone')} onBlur={blur('phone')} {...aria('phone')} />
          </Field>
          <Field id={id('subject')} label="Subject" error={errorFor('subject')}>
            <input id={id('subject')} name="subject" value={values.subject} onChange={set('subject')} onBlur={blur('subject')} {...aria('subject')} />
          </Field>
        </div>
        <Field id={id('message')} label="Message" error={errorFor('message')}>
          <textarea id={id('message')} name="message" rows={6} required value={values.message} onChange={set('message')} onBlur={blur('message')} {...aria('message')} />
        </Field>
        {consentText && (
          <div className="field field--check">
            <label>
              <input type="checkbox" checked={values.consent} onChange={set('consent')} />
              <span>{consentText}</span>
            </label>
          </div>
        )}
        {/* Honeypot: hidden from people, filled by bots. */}
        <div className="hp" aria-hidden="true">
          <label htmlFor={id('website')}>Website</label>
          <input id={id('website')} name="website" tabIndex={-1} autoComplete="off" value={values.website} onChange={set('website')} />
        </div>
        {LIVE && SITE_KEY && <Turnstile ref={turnstile} siteKey={SITE_KEY} onToken={setToken} className="inquiry__turnstile" />}
        <div className="inquiry__actions">
          <button type="submit" className="btn btn--primary" disabled={!canSend} aria-disabled={!canSend || undefined} aria-busy={sending || undefined}>
            {sending ? enquiryCopy.sending : values.type === 'consultation' ? 'Send consultation request' : 'Send enquiry'}
          </button>
        </div>
        {LIVE && (
          <p className={`inquiry__status${status === 'success' ? ' inquiry__status--ok' : ''}`} role="status" aria-live="polite">{statusText || ''}</p>
        )}
      </fieldset>
    </form>
  );
}
