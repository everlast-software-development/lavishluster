/**
 * Inquiry validation rules — shared by the contact form (client) and the
 * /api/inquiry endpoint (server) so both apply identical checks.
 */
export const INQUIRY_TYPES = ['general', 'consultation'];

export const LIMITS = {
  name: [2, 120],
  email: [3, 254],
  phone: [0, 40],
  subject: [2, 150],
  message: [10, 4000],
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE = /^[0-9+()\-.\s]*$/;

export function validateInquiry(input, { consentRequired = false } = {}) {
  const data = {
    type: INQUIRY_TYPES.includes(input?.type) ? input.type : 'general',
    name: String(input?.name ?? '').trim(),
    email: String(input?.email ?? '').trim(),
    phone: String(input?.phone ?? '').trim(),
    subject: String(input?.subject ?? '').trim(),
    message: String(input?.message ?? '').trim(),
    consent: input?.consent === true,
  };
  const errors = {};
  const len = (k) => data[k].length;
  const within = (k) => len(k) >= LIMITS[k][0] && len(k) <= LIMITS[k][1];

  if (!within('name')) errors.name = 'Enter your name.';
  if (!within('email') || !EMAIL.test(data.email)) errors.email = 'Enter a valid email address, like name@example.com.';
  if (!within('phone') || !PHONE.test(data.phone)) errors.phone = 'Use digits, spaces and + ( ) - only.';
  if (!within('subject')) errors.subject = 'Enter a subject.';
  if (len('message') < LIMITS.message[0]) errors.message = `Write at least ${LIMITS.message[0]} characters.`;
  else if (len('message') > LIMITS.message[1]) errors.message = `Keep your message under ${LIMITS.message[1]} characters.`;
  if (consentRequired && !data.consent) errors.consent = 'Confirm your consent to continue.';

  return { data, errors, valid: Object.keys(errors).length === 0 };
}
