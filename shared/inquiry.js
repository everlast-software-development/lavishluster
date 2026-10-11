/**
 * Enquiry validation — shared by the contact form (client) and POST /api/enquiry (server) so both apply
 * identical rules. Errors are per-field CODES (never sentences); the form maps them to approved copy.
 *   name     2–100 characters                         required | length
 *   email    a valid address (max 254)                required | invalid
 *   phone    optional: digits, spaces, + - ( ), ≤ 30   invalid  | too_long
 *   subject  optional, ≤ 150                           too_long
 *   message  10–5000 characters                        required | too_short | too_long
 * Everything is trimmed; CR/LF are stripped from every value that can reach an email header.
 */
export const INQUIRY_TYPES = ['general', 'consultation'];

export const LIMITS = {
  name: [2, 100],
  email: [3, 254],
  phone: [0, 30],
  subject: [0, 150],
  message: [10, 5000],
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE = /^[0-9+()\- ]*$/;
const clean = (v) => String(v ?? '').trim();
const oneLine = (v) => clean(v).replace(/[\r\n]+/g, ' ');

export function validateInquiry(input) {
  const data = {
    type: INQUIRY_TYPES.includes(input?.type) ? input.type : 'general',
    name: oneLine(input?.name),
    email: oneLine(input?.email).replace(/\s+/g, ''),
    phone: oneLine(input?.phone),
    subject: oneLine(input?.subject),
    message: clean(input?.message),
  };
  const errors = {};
  const len = (k) => data[k].length;

  if (!len('name')) errors.name = 'required';
  else if (len('name') < LIMITS.name[0] || len('name') > LIMITS.name[1]) errors.name = 'length';

  if (!len('email')) errors.email = 'required';
  else if (len('email') > LIMITS.email[1] || !EMAIL.test(data.email)) errors.email = 'invalid';

  if (len('phone') > LIMITS.phone[1]) errors.phone = 'too_long';
  else if (!PHONE.test(data.phone)) errors.phone = 'invalid';

  if (len('subject') > LIMITS.subject[1]) errors.subject = 'too_long';

  if (!len('message')) errors.message = 'required';
  else if (len('message') < LIMITS.message[0]) errors.message = 'too_short';
  else if (len('message') > LIMITS.message[1]) errors.message = 'too_long';

  return { data, errors, valid: Object.keys(errors).length === 0 };
}

/** The three required fields (name, email, message) are valid — the form's submit condition with the Turnstile token. */
export const requiredValid = (input) => {
  const { errors } = validateInquiry(input);
  return !errors.name && !errors.email && !errors.message;
};
