/** Cloudflare Turnstile server-side verification. Any failure (bad token, network, timeout) is "not verified". */
const SITEVERIFY = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

export async function verifyTurnstile(token, remoteip, secret) {
  if (typeof token !== 'string' || token === '' || token.length > 2048 || !secret) return false;
  try {
    const body = new URLSearchParams({ secret, response: token });
    if (remoteip) body.set('remoteip', remoteip);
    const res = await fetch(SITEVERIFY, { method: 'POST', body, signal: AbortSignal.timeout(8000) });
    const data = await res.json();
    return data.success === true;
  } catch (err) {
    console.error('[enquiry] Turnstile verification unavailable:', err.name);
    return false;
  }
}
