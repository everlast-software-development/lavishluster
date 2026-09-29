import { useEffect, useId, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { validateInquiry } from '../../../../shared/inquiry.js';
import { features } from '../../data/config/features.js';
import { integrations } from '../../data/config/integrations.js';
import { contact } from '../../data/content/contact.js';

const EMPTY = { type: 'general', name: '', email: '', phone: '', subject: '', message: '', consent: false, website: '' };

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
 * Contact / consultation form. Fully implemented; submission stays disabled
 * until features.inquirySubmission is on (requires the Privacy Policy and
 * consent wording in config/integrations.js).
 */
export default function InquiryForm() {
  const uid = useId().replace(/:/g, '');
  const [params] = useSearchParams();
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | sent | failed
  const consentText = integrations.inquiry.consentText;
  const enabled = features.inquirySubmission && Boolean(consentText);

  useEffect(() => {
    if (params.get('type') === 'consultation') setValues((v) => ({ ...v, type: 'consultation' }));
  }, [params]);

  const id = (name) => `${uid}-${name}`;
  const set = (name) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setValues((v) => ({ ...v, [name]: value }));
    if (errors[name]) setErrors((er) => ({ ...er, [name]: undefined }));
  };
  const aria = (name) => (errors[name] ? { 'aria-invalid': true, 'aria-describedby': `${id(name)}-error` } : {});

  async function onSubmit(e) {
    e.preventDefault();
    if (!enabled) return;
    const { data, errors: found, valid } = validateInquiry(values, { consentRequired: true });
    setErrors(found);
    if (!valid) return;
    setStatus('sending');
    try {
      const res = await fetch(integrations.inquiry.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, website: values.website }),
      });
      if (res.ok) { setStatus('sent'); setValues(EMPTY); return; }
      const body = await res.json().catch(() => ({}));
      if (body.errors) setErrors(body.errors);
      setStatus('failed');
    } catch {
      setStatus('failed');
    }
  }

  if (status === 'sent') {
    return (
      <div className="form-status" role="status">
        <p className="prose-lg">Your enquiry has been sent.</p>
        <button type="button" className="text-link" onClick={() => setStatus('idle')}>Send another enquiry</button>
      </div>
    );
  }

  return (
    <form className="inquiry" onSubmit={onSubmit} noValidate aria-describedby={!enabled ? `${uid}-notice` : undefined}>
      {!enabled && (
        <p className="inquiry__notice" id={`${uid}-notice`}>
          Online enquiries are not open yet. You can reach us at{' '}
          <a href={`mailto:${contact.email}`}>{contact.email}</a>.
        </p>
      )}
      <fieldset disabled={!enabled}>
        <legend className="visually-hidden">Enquiry details</legend>
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
        <div className="inquiry__grid">
          <Field id={id('name')} label="Name" error={errors.name}>
            <input id={id('name')} name="name" autoComplete="name" value={values.name} onChange={set('name')} {...aria('name')} />
          </Field>
          <Field id={id('email')} label="Email" error={errors.email}>
            <input id={id('email')} name="email" type="email" autoComplete="email" value={values.email} onChange={set('email')} {...aria('email')} />
          </Field>
          <Field id={id('phone')} label="Phone" optional error={errors.phone}>
            <input id={id('phone')} name="phone" type="tel" autoComplete="tel" value={values.phone} onChange={set('phone')} {...aria('phone')} />
          </Field>
          <Field id={id('subject')} label="Subject" error={errors.subject}>
            <input id={id('subject')} name="subject" value={values.subject} onChange={set('subject')} {...aria('subject')} />
          </Field>
        </div>
        <Field id={id('message')} label="Message" error={errors.message}>
          <textarea id={id('message')} name="message" rows={6} value={values.message} onChange={set('message')} {...aria('message')} />
        </Field>
        {consentText && (
          <div className={`field field--check${errors.consent ? ' field--error' : ''}`}>
            <label>
              <input type="checkbox" checked={values.consent} onChange={set('consent')} {...aria('consent')} />
              <span>{consentText}</span>
            </label>
            {errors.consent && <p className="field__error" id={`${id('consent')}-error`}>{errors.consent}</p>}
          </div>
        )}
        {/* Honeypot: hidden from people, filled by bots. */}
        <div className="hp" aria-hidden="true">
          <label htmlFor={id('website')}>Website</label>
          <input id={id('website')} name="website" tabIndex={-1} autoComplete="off" value={values.website} onChange={set('website')} />
        </div>
        <div className="inquiry__actions">
          <button type="submit" className="btn btn--primary" disabled={!enabled || status === 'sending'}>
            {status === 'sending' ? 'Sending…' : values.type === 'consultation' ? 'Send consultation request' : 'Send enquiry'}
          </button>
          {status === 'failed' && (
            <p className="field__error" role="alert">
              The enquiry couldn’t be sent. Check the highlighted fields, or write to {contact.email}.
            </p>
          )}
        </div>
      </fieldset>
    </form>
  );
}
