/**
 * Contact form messages — approved (content-source/website-content.md, section 10, "Contact form messages";
 * checked verbatim by scripts/verify-website-content.mjs). `{email}` is replaced with contact.email (as a link).
 * Field errors are keyed by the validation codes in shared/inquiry.js.
 */
export const enquiryCopy = {
  approved: true,
  note: 'Write to us below and we will reply by email. You can also reach us at {email}.',
  sending: 'Sending…',
  success: 'Thank you. Your message has been sent, and we will reply by email.',
  error: 'Your message could not be sent. Please try again, or write to us at {email}.',
  verificationFailed: 'The security check could not be completed. Please try it again and resend.',
  rateLimited: 'Too many attempts. Please wait a few minutes and try again.',
  fields: {
    name: { required: 'Please enter your name.', length: 'Your name should be 2 to 100 characters.' },
    email: { required: 'Please enter your email address.', invalid: 'Please enter a valid email address.' },
    phone: { invalid: 'Use digits, spaces and + - ( ) only.', too_long: 'Keep the phone number under 30 characters.' },
    subject: { too_long: 'Keep the subject under 150 characters.' },
    message: { required: 'Please write your message.', too_short: 'Please write at least 10 characters.', too_long: 'Please keep your message under 5,000 characters.' },
  },
};
