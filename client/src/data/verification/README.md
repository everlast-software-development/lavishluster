# Verification data (development only)

- `register.js` — open questions (V-01 … V-13) and how each is handled.
- `withheld.json` — Master text withheld under Tier B, stored verbatim (generated).
- `normalizations.json` — whitespace-only normalizations applied during extraction (generated).

Nothing in this folder is imported by the website.

Releasing a Tier B item after verification: in `scripts/extract-master.mjs` set the rule's
`status` to `'released'` and run `npm run extract`.
- V-04 certifications then land verbatim in the device's `certifications` field; also set
  `features.certifications = true`.
- V-03 keeps the NIR row in the Centurion light functions.
