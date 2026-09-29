/**
 * Small in-memory fixed-window rate limiter keyed by client IP.
 * Suitable for a single instance; use a shared store (e.g. Redis) if the
 * server is scaled horizontally.
 */
export function rateLimit({ windowMs, max }) {
  const hits = new Map();
  const sweep = setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of hits) if (entry.reset <= now) hits.delete(key);
  }, windowMs);
  sweep.unref();

  return function limiter(req, res, next) {
    const key = req.ip || req.socket.remoteAddress || 'unknown';
    const now = Date.now();
    let entry = hits.get(key);
    if (!entry || entry.reset <= now) { entry = { count: 0, reset: now + windowMs }; hits.set(key, entry); }
    entry.count += 1;
    res.setHeader('RateLimit-Limit', String(max));
    res.setHeader('RateLimit-Remaining', String(Math.max(0, max - entry.count)));
    res.setHeader('RateLimit-Reset', String(Math.ceil((entry.reset - now) / 1000)));
    if (entry.count > max) {
      res.setHeader('Retry-After', String(Math.ceil((entry.reset - now) / 1000)));
      return res.status(429).json({ error: 'rate_limited', message: 'Too many enquiries. Try again later.' });
    }
    return next();
  };
}
