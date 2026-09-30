# Lavish Luster — website

A catalog and showcase site for Lavish Luster's 27 products and devices, built as a prerendered React frontend with a small Node service for enquiries.

There are no prices, cart, checkout, payment or any other commerce feature anywhere in the codebase.

## Run it

```bash
npm install
npm run build      # checks the Master extraction, builds and prerenders the site, then runs the integrity check
npm start          # serves client/dist and the API on http://localhost:3001
```

For development, run `npm run dev` for the frontend with hot reload, and `npm run dev:server` in a second terminal for the API. The Vite dev server forwards `/api` to port 3001.

Node 20 or newer is required.

## Structure

```
content-source/         source of truth snapshots (never edited by hand)
  LAVISH_LUSTER___MASTER_COMPLETE_PRODUCT_CONTENT.docx
  master.md             verbatim text extract of the Master document
  old-site-verified.md  verified brand text from the old site (demo content excluded)
  asset-manifest.json   verified old-site images (logo, brand photos, 2 product images)
scripts/
  extract-master.mjs    Master → catalog JSON (normalisation + withholding rules live here)
  verify-content.mjs    final content-integrity check (runs on every build)
  fetch-assets.mjs      downloads the assets in the manifest
shared/inquiry.js       enquiry validation used by both the form and the API
client/                 React 18 + React Router + Vite, prerendered to static HTML
  src/data/             all content and configuration (no content lives in components)
    products/ flashTreatments/ devices/   generated from the Master; do not edit
    devices/specs.js    device technology/modes, exact Master substrings only
    taxonomy.js catalog.js
    content/            verified brand text, contact, science index, legal
    config/             features.js (flags), featured.js, integrations.js
    testimonials/ results/ experts/ clinic/   empty until approved content exists
    verification/       register, withheld text, normalisation log (development data only; never imported)
  src/components/       layout, navigation, footer, product, sections, ui
  src/pages/            Home, About, Products, Product, LusterScan, Science, Results, Clinic, Contact, Legal, NotFound
  src/assets/           products/<slug>/, devices/<slug>/, brand/, clinic/, results/
  scripts/prerender.mjs static HTML for every route, plus 404.html, sitemap.xml and robots.txt
server/                 Express: POST /api/inquiry, GET /api/health, static hosting
```

## Content rules (enforced by the build)

`npm run build` fails if any of the following checks fails. It runs 2,700+ checks.

1. The catalog JSON must equal a fresh extraction of `content-source/master.md`, with 15 facial treatments, 5 flash treatments and 7 devices.
2. Every published field must be verbatim Master text. The only exceptions are the two logged whitespace fixes (V-11). Withheld sentences are re-attached during the check to prove that nothing else changed.
3. Every list item, evidence figure, device spec and science phrase must be an exact substring of its Master field.
4. Every brand text block must appear verbatim in `old-site-verified.md`.
5. The prerendered HTML of all 27 product pages must contain every fragment.
6. The build must contain no commerce terms, theme or demo content, excluded old products or categories, or withheld text (FDA, the 650 nm row).
7. Disabled pages must be absent, and the sitemap must list all 27 product pages.

When the Master changes, update `content-source/master.md` and run `npm run extract`.

## Feature flags

Everything is off by default. The flags live in `client/src/data/config/features.js`. A section renders only when its flag is `true` **and** its data file has approved content.

| Flag | Enables | Data needed |
|---|---|---|
| `clinic` | `/clinic` page, nav and footer links, Home teaser | `data/clinic/index.js` |
| `featuredProducts` | Home featured products | slugs in `config/featured.js` |
| `beforeAfter` | Home and Results galleries | `data/results/beforeAfter.js` |
| `testimonials` | Home and Results testimonials | `data/testimonials/index.js` |
| `experts` | About and Clinic experts | `data/experts/index.js` |
| `certifications` | Device certification section | released V-04 text (below) |
| `socialLinks` | Footer social links | URLs in `data/content/contact.js` |
| `legalPages` | `/privacy`, `/terms` and footer legal links | text in `data/content/legal.js` |
| `lusterscanIntegration` | "Start LusterScan AI" button | `integrations.lusterscan.appUrl` |
| `lusterscanVideo` | LusterScan welcome video | `integrations.lusterscan.videoUrl` |
| `inquirySubmission` | Contact form submission | `integrations.inquiry.consentText` plus the server env below |

To go live with the contact form:

1. Publish the Privacy Policy.
2. Set `consentText` and `inquirySubmission: true` in the client.
3. On the server, set `INQUIRY_ENABLED=true` and the SMTP variables (see `server/.env.example`).

Until then, the form renders in full but disabled, with a pointer to the email address, and the API returns 503.

## Enquiry API

`POST /api/inquiry` takes `{ type: "general" | "consultation", name, email, phone?, subject, message, consent, website }`.

| Situation | Response |
|---|---|
| Submission disabled or SMTP not configured | 503 |
| Honeypot field `website` filled | 202, and the enquiry is silently dropped |
| Validation errors | 422 with per-field messages (same rules as the form) |
| Rate limit exceeded (5 per 15 minutes per IP, configurable) | 429 |
| Sent | 202 |
| Mail delivery failed | 502 |

The server also sends security headers, including a CSP that allows only the Google Maps frame. Hashed assets are served with immutable caching and HTML with `no-cache`.

Optional 301 redirects from the old WordPress URLs (`/shop`, `/product/*`, `/product-category/*`, `/about-us`, `/contacts`) are ready but off: set `REDIRECTS_ENABLED=true`.

## Adding images

Drop files into these folders and rebuild. No code or data changes are needed.

```
client/src/assets/products/<slug>/primary.webp     (+ gallery-01.webp, gallery-02.webp …)
client/src/assets/devices/<slug>/primary.webp
client/src/assets/brand/<name>.webp                 (see "Brand images" below)
```

Until a product file exists, its slot shows the placeholder: `brand/silk.webp` in the same 4:5 frame, with a 1px gold inset frame and the product name and subtitle set small in the lower third. Product images use a 4:5 frame, so supply WebP at least 1200×1500. `luster-sculpt-and-lift` has no image yet, and the `luster-instant-glow-shot` photo is withheld because it shows other packaging.

`node scripts/fetch-assets.mjs` copies the verified old-site images into place. Confirm the usage rights and logo variant before publishing.

## Verification items (V-01 … V-13)

See `client/src/data/verification/register.js`.

**Tier A: published verbatim and flagged**
- V-05: ingredient spellings
- V-06: "natural Botox effect"
- V-07: Korean Mask evidence phrasing

**Tier B: withheld, with the text kept verbatim in `withheld.json`**
- V-03: Centurion NIR 650 nm row
- V-04: "CE and FDA certified." (Centurion and Omega), plus the old-site FDA lines

**Structural items pending confirmation**
- V-01: UNIC gel pairing
- V-02: Thermo-Sonic mode names

To release a Tier B item after verification, set its rule's `status` to `'released'` in `scripts/extract-master.mjs` and run `npm run extract`.

## Design notes

The "Maison" direction: pearl, ink and gold, one typeface, and editorial photography.

- **Tokens:** every colour, size and spacing value lives in `client/src/styles/tokens.css`. No stylesheet contains a hex value.
  - Surfaces are pearl `#F3F2EE` (page), white (alternate sections and image mats), silk `#EDECE7` under `brand/silk.webp`, noir `#151412` (Home LusterScan, footer, mobile menu) and grain grey `#8E8D8B` (the cover hero).
  - Text is ink `#1C1B19`, ink-soft `#4E4A44` for body copy, and taupe `#6F6860` for meta text.
  - Gold is jewellery only: `#B99A6B` for lines and underlines, `#7F6647` for small labels on light surfaces, and `#C9AE84` for labels and numerals on dark ones. It is never used as a fill or for large areas.
  - The only gradients are dark or pearl scrims over photography, there to keep text legible.
- **Type:** Montserrat Variable only, self-hosted, with the Latin subset preloaded.
  - Section titles: 28–44px, weight 200, uppercase, tracking 0.07em.
  - Hero H1: 24–30px, weight 300, tracking 0.14em.
  - Statement: 22–34px, weight 200.
  - Eyebrows: 11px, weight 500, tracking 0.26em, gold.
  - Body: 16px, line-height 1.75, at most 65ch.
- **Components** (all under `client/src/components`):
  - `ui/SectionHeader` (eyebrow, title, lead)
  - `ui/Section` (split or stack; pearl, white, silk or noir)
  - `ui/Links`: the ink button, with a pearl variant on dark sections, and the tracked text link with a gold underline
  - `product/ProductCard`: the one card, a 4:5 image on a white mat
  - `ui/Placeholder`
  - `ui/PageHero`: a photo band with a pearl scrim, or the grain variant
  - `sections/ConsultationCta` (50/50 with `couple.webp`)
  - `ui/Icon`: thin line icons for the product detail sections
- **Logo:** there is one file, `brand/logo.png` (white artwork on transparency). `navigation/Wordmark` uses it as a CSS mask filled with `currentColor`, so `tone="light|dark"` tints it. `brand/logo-script-watermark.png` is masked the same way for the cover hero and the footer watermark.
- **Home:** there is one component per section in `components/sections/home/`, each with its stylesheet next to it: HomeHero, HomeStatement, HomeCollections, HomeSignature, HomeFeatured, HomeScience, HomeLusterScan, HomeResults and HomeConsultation. Refine a section by editing its pair of files.
- **Layout:**
  - Content is at most 1200px wide, with gutters from 24px (mobile) to 120px (desktop).
  - Section padding runs from 72px to 144px.
  - `.split` places the header in columns 1–5 and content in 7–12. `.halves` is the edge-to-edge 50/50.
  - Radius is 0 everywhere, there are no shadows, and hairlines appear only between rows.
- **Header:** the nav is split around a centred logo. It is transparent over the Home hero until the page scrolls, and solid pearl everywhere else. On mobile, a full-screen noir menu opens.
- **Motion:** image hover zoom (1.035 over 1.2s), link underlines, a 300ms page fade, a crossfade on catalog filters and a fade on the mobile menu. There is no smooth scrolling and no scroll-triggered animation, and `prefers-reduced-motion` is respected.
