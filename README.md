# Lavish Luster — website

A catalog and showcase site for Lavish Luster's 27 products and devices, built as a prerendered React frontend with a small Node service for enquiries.

There are no prices, cart, checkout, payment or any other commerce feature anywhere in the codebase.

## Run it

```bash
npm install
npm run build      # checks the Master extraction, builds and prerenders the site, then runs both content checks
npm start          # serves client/dist and the API on http://localhost:3001
```

For development, run `npm run dev` for the frontend with hot reload, and `npm run dev:server` in a second terminal for the API. The Vite dev server forwards `/api` to port 3001.

Node 20 or newer is required.

## Deploy (one service)

The site and the API run in one Node process: `server/index.js` serves the prerendered build (`client/dist`, clean URLs, 404 page) and `/api/*` on the same origin, so the Contact form's relative `/api/enquiry` works without a second service. It listens on `PORT` and `HOST` (default `0.0.0.0`).

On Railway: one service, Root Directory = repository root, Build Command `npm run build`, Start Command `npm start`, health check `/api/health`. The same settings are in `railway.single.json` (opt-in: set it as the service's config file path; Railway only reads `railway.json` / `railway.toml` automatically). Variables: `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_SECURE`, `EMAIL_USER`, `EMAIL_PASS`, `EMAIL_TO`, `TURNSTILE_SECRET_KEY`, `TURNSTILE_SITE_KEY` (needed at build time: it is compiled into the client), `TRUST_PROXY=1`. Railway sets `PORT`.

## Structure

```
content-source/         source of truth snapshots (never edited by hand)
  LAVISH_LUSTER___MASTER_COMPLETE_PRODUCT_CONTENT.docx
  master.md             verbatim text extract of the Master document (product copy)
  website-content.md    final structure and page copy: sitemap, navigation, Home, About, LusterScan AI,
                        The Science, Results, Contact, and the do-not-publish list (section 16)
  old-site-verified.md  verified brand text from the old site (demo content excluded)
  asset-manifest.json   verified old-site images (logo, brand photos, 2 product images)
scripts/
  extract-master.mjs    Master → catalog JSON (normalisation + withholding rules live here)
  verify-content.mjs    final content-integrity check (runs on every build)
  verify-website-content.mjs  page copy vs website-content.md, section 16, Home blocks (runs on every build)
  fetch-assets.mjs      downloads the assets in the manifest
shared/inquiry.js       enquiry validation (per-field codes) used by both the form and the API
client/                 React 18 + React Router + Vite, prerendered to static HTML
  src/data/             all content and configuration (no content lives in components)
    products/ flashTreatments/ devices/   generated from the Master; do not edit
    devices/specs.js    device technology/modes, exact Master substrings only
    taxonomy.js catalog.js
    content/            page copy, one file per page: home.js, about.js, lusterscan.js, results.js,
                        science.js (sciencePage + technology index); site.js re-assembles the old-site
                        brand texts for the check; contact.js, legal.js
    config/             features.js (flags), featured.js, integrations.js
    testimonials/ results/ experts/ clinic/   empty until approved content exists
    verification/       register, withheld text, normalisation log (development data only; never imported)
  src/components/       layout, navigation, footer, product, sections, ui
  src/pages/            Home, About, Products, Product, LusterScan, Science, Results, Clinic, Contact, Legal, NotFound
  src/assets/           products/<slug>/, devices/<slug>/, brand/, clinic/, results/
  scripts/prerender.mjs static HTML for every route, plus 404.html, sitemap.xml and robots.txt
server/                 Express: POST /api/enquiry (SMTP + Turnstile), GET /api/health, static hosting
```

## Content rules (enforced by the build)

`npm run build` fails if any of the following checks fails. `verify-content.mjs` runs 2,700+ checks, and `verify-website-content.mjs` runs 500+.

1. The catalog JSON must equal a fresh extraction of `content-source/master.md`, with 15 facial treatments, 5 flash treatments and 7 devices.
2. Every published field must be verbatim Master text. The only exceptions are the two logged whitespace fixes (V-11). Withheld sentences are re-attached during the check to prove that nothing else changed.
3. Every list item, evidence figure, device spec and science phrase must be an exact substring of its Master field.
4. Every brand text block must appear verbatim in `old-site-verified.md`.
5. The prerendered HTML of all 27 product pages must contain every fragment.
6. The build must contain no commerce terms, theme or demo content, excluded old products or categories, or withheld text (FDA, the 650 nm row).
7. Disabled pages must be absent, and the sitemap must list all 27 product pages.
8. Every copy string in the page data files (`home.js`, `about.js`, `lusterscan.js`, `results.js`, `sciencePage`) must appear verbatim in `content-source/website-content.md`.
9. No prerendered page may contain anything from the document's section 16 (Pending / Do Not Publish) or a "[PENDING" marker. That includes FDA, the 650 nm row, the "Your Personal Dermatologist" headline, the "Dermatological precision analysis" bullet, "25+ specialized formulas", demo testimonials, ratings and the placeholder phone.
10. Every block of the document's Home section (section 5) renders on the Home page, and no paragraph appears there twice.

When the Master changes, update `content-source/master.md` and run `npm run extract`.

**Page copy.** `content-source/website-content.md` is the single source for page copy. Like `master.md`, it is a snapshot that is never edited by hand. Components read only from the page data files in `client/src/data/content/`, one field per block, written exactly as in the document; the bold "Label:" prefixes are field names, not text. The old-site brand texts (welcome, story, mission, vision, values, section teasers, LusterScan steps and note, results paragraph) must also appear in `old-site-verified.md`; the one missing text (LusterScan step 02 with its closing period) is recorded there under "Brand texts (lavishluster.com Home and About)". Product copy stays in `master.md`.

**Routes and navigation.** LusterScan AI lives at `/lusterscan-ai`. The old `/lusterscan` answers with an always-on 301 (`server/lib/redirects.js`, `routeRedirects`, query kept); in-app links to it redirect client-side, and it is not prerendered or in the sitemap. The main navigation is one level: About, Products, LusterScan AI | logo | The Science, Results, Contact (`NAV_SPLIT = 3` in `navItems.js`); the mobile menu adds Home. "Request a Consultation" is not in the menu; it stays in the Consultation band and on the other pages.

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
| `inquirySubmission` | Contact form submission | approved form copy in `data/content/enquiry.js` (`approved: true`), `TURNSTILE_SITE_KEY` at build time, and the server env below |

The contact form is **live** (`inquirySubmission: true`; the form messages are approved in `website-content.md`, section 10, and `data/content/enquiry.js`). On a server, set every variable in `.env.example` (project root), including `TURNSTILE_SITE_KEY`, and rebuild: the site key is baked into the client at build time. Without the SMTP or Turnstile variables the API returns 503 and the rest of the site keeps running. If `inquirySubmission` is switched off, the form falls back to its "not open yet" note with the button disabled.

**Pending: Privacy Policy and consent.** The form launched without a consent checkbox. When the Privacy Policy is published, set `integrations.inquiry.consentText`; the checkbox then renders above the button. Until then `consentText` is `null`, and nothing (neither the form nor the API) requires consent.

## Enquiry API

`POST /api/enquiry` takes `{ type: "general" | "consultation", name, email, phone?, subject?, message, website, turnstileToken }`. Configuration comes from the project-root `.env` (never committed; `.env.example` lists the names): `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_SECURE`, `EMAIL_USER`, `EMAIL_PASS`, `EMAIL_TO`, `PORT`, `TURNSTILE_SECRET_KEY`, `TURNSTILE_SITE_KEY` (public; the only value exposed to the client, as `VITE_TURNSTILE_SITE_KEY`). Optional: `TRUST_PROXY` (e.g. `1` behind a reverse proxy, so the rate limit and Turnstile see the visitor's IP), `REDIRECTS_ENABLED`.

Checks run in this order: body size (20kb) → rate limit (5 per 15 minutes per IP) → honeypot → Turnstile (server-side siteverify) → validation (`shared/inquiry.js`, the same rules as the form) → send. Mail goes from `"Lavish Luster Website" <EMAIL_USER>` (the authenticated account) to `EMAIL_TO`, Reply-To the visitor, as plain text and escaped HTML. On startup the server logs `SMTP ready` or a clear SMTP error, never a credential.

| Situation | Response |
|---|---|
| SMTP or Turnstile variables missing | 503 `{ok:false, code:"unavailable"}` |
| Body over 20kb | 413 `{ok:false, code:"too_large"}` |
| Rate limit exceeded | 429 `{ok:false, code:"rate_limited"}` |
| Honeypot field `website` filled | 200 `{ok:true}`, nothing is sent |
| Turnstile token missing or invalid | 403 `{ok:false, code:"verification_failed"}` |
| Validation errors | 400 `{ok:false, code:"invalid", errors:{field: code}}` |
| Sent | 200 `{ok:true}` |
| Mail delivery failed | 500 `{ok:false}` (the real error is logged server-side only) |

The server also sends security headers, including a CSP that allows only the Google Maps frame and Cloudflare Turnstile (`challenges.cloudflare.com`). Hashed assets are served with immutable caching and HTML with `no-cache`.

Optional 301 redirects from the old WordPress URLs (`/shop`, `/product/*`, `/product-category/*`, `/about-us`, `/contacts`) are ready but off: set `REDIRECTS_ENABLED=true`.

## Adding images

Drop files into these folders and rebuild. No code or data changes are needed.

```
client/src/assets/products/<slug>/primary.webp     (+ gallery-01.webp, gallery-02.webp …)
client/src/assets/devices/<slug>/primary.webp
client/src/assets/brand/<name>.webp                 (see "Brand images" below)
```

**Responsive variants.** Smaller WebP copies of a brand image go in `client/src/assets/brand/variants/<name>-<width>.webp` (never wider than the original). `getBrandSrcSet(name)` in `utils/assets.js` turns them into a `srcset` (adding the original when it is wider), and `ui/BrandImage` uses it when it gets a `sizes` prop, so phones download the small files. The About page images have 320–1293px variants.

Until a product file exists, its slot shows the placeholder: `brand/silk.webp` in the same 4:5 frame, with a 1px gold inset frame and the product name and subtitle set small in the lower third. Product images use a 4:5 frame, so supply WebP at least 1200×1500. `luster-sculpt-and-lift` has no image yet. The `luster-instant-glow-shot` photo (its packaging reads "THE U-PLAN") is used with the client's confirmation that it is the correct product image.

Source files: after converting an image, keep the original in `content-source/originals/` (git-ignored, outside the build). Never delete it. Step numbers: the Master keys steps 0–6. The site shows them counted from 1 (`step.display` in `data/taxonomy.js`: Cleanse = Step 01, Nourish & Repair = Step 02 … Corporal Treatment = Step 07). Home's Signature line still uses the raw key ("Step 1,"), because Home is frozen.

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
  - Surfaces are pearl `#F3F2EE` (page), white (alternate sections and image mats), noir `#151412` (dark sections, footer, mobile menu), raised noir `#1E1C19` (the hero stage panel), silk `#EDECE7` (placeholders and product heroes) and grain grey `#8E8D8B` (the About hero).
  - Text is ink `#1C1B19`, ink-soft `#4E4A44` for body copy, and taupe `#6F6860` for meta text.
  - Gold is jewellery only: `#B99A6B` for lines and underlines, `#7F6647` for small labels on light surfaces, and `#C9AE84` for labels and numerals on dark ones. It is never used as a fill or for large areas.
  - The only gradients are dark or pearl scrims over photography on inner pages. The Home page has none below the hero.
- **Type:** Montserrat Variable only, self-hosted, with the Latin subset preloaded.
  - Section titles (`--t-h2`): `clamp(28px, 2.8vw, 42px)`, weight 200, uppercase, tracking 0.06em, line-height 1.1.
  - Sub-titles (`.sub-title`, category or product name): `clamp(20px, 1.6vw, 26px)`, weight 300, uppercase, tracking 0.08em.
  - Home hero H1: two lines, `clamp(34px, 3.9vw, 56px)` (34px below 640px), weight 200, line-height 1.1, tracking 0.06em, uppercase, pearl.
  - Statement: `clamp(20px, 1.8vw, 28px)`, weight 200, line-height 1.5.
  - Big numerals (`.numeral`, `--t-numeral`): `clamp(44px, 4.4vw, 68px)`, weight 200, gold on dark and ink on light.
  - Eyebrows: 11px, weight 500, tracking 0.26em, gold.
  - Body: 16px, line-height 1.8, weight 300, at most 60ch. Small text is never below 13px (11px uppercase labels and the 12px footer base row are the exceptions).
  - `ui/SectionHeader` spacing: eyebrow to title 16px, title to lead 20px, header to content 40px.
- **Components** (all under `client/src/components`):
  - `ui/SectionHeader` (eyebrow, title, lead)
  - `ui/Section` (split or stack; pearl, white, silk or noir)
  - `ui/Links`: the ink button, with a pearl variant on dark sections, and the tracked text link with a gold underline
  - `product/ProductCard`: the one card, a 4:5 image on a white mat
  - `ui/Placeholder`
  - `ui/PageHero`: a photo band with a pearl scrim, or the grain variant
  - `sections/ConsultationCta`: the centred consultation band, shared by Home and the inner pages
  - `ui/Icon`: thin line icons for the product detail sections
- **Logo:** there is one file, `brand/logo.png`: the official logo, white artwork on transparency, trimmed to 2px padding and resized to 1200×204. `navigation/Wordmark` uses it as a CSS mask (`contain`, centred) filled with `currentColor`, in a box that keeps the 1200:204 ratio. `tone="light"` is pearl (Home hero, noir sections, mobile menu, footer) and `tone="dark"` is ink (the solid header). Sizes are set by height: header 40px (32px below 768px), mobile menu 40px, footer 200×34 (24px tall on mobile). `brand/logo-script-watermark.png` (separate, blurred script) is no longer used: the footer has no watermark.
- **Home:** one component per section in `components/sections/home/`, each with its stylesheet next to it; all copy comes from `src/data/content/home.js` (the Home section of `website-content.md`). The surfaces alternate in a fixed order, and the colour change is the only separator (no lines): Hero noir → Brand Philosophy pearl → Product Worlds noir → Signature white → The Science pearl → LusterScan noir → Results white → Consultation pearl → Footer noir.
  1. **Hero** (noir, final).
  2. **Brand Philosophy** (`HomeStatement`, pearl, ≈760px): in columns 1–6, the ruled eyebrow, the two-line title, the welcome paragraph (18px) and a hairline row with "Smart Clinical Unisex Beauty" and the "About Lavish Luster" link. In columns 8–12, `brand/philosophy.webp` at 440×550 over a gold frame offset 28px up and right (16px on mobile, where the image comes first). On desktop each title line stays whole.
  3. **Product Worlds** (`HomeCollections`, noir, ≈985px): a header (ruled gold-light "Products" eyebrow, the total 27 at 44px/200 in pearl with "products/devices" at pearl 62%, the light "Explore Products" link on the right), then 48px below, three expanding full-image panels in one row with a pearl 18% border, `clamp(500px, 44.4vw, 640px)` tall, each one link to its filtered catalog. **Every photograph covers its panel edge to edge** (`object-fit: cover`, open or closed, never bars). The open panel's width follows the image's ratio, `clamp(50%, row height × --ar, 60%)`. `--ar` (width / height) is read from the file at build time by the Vite plugin `client/scripts/image-sizes-plugin.mjs` (`virtual:image-sizes`, exposed as `images.primaryAspect` from `utils/assets.js`) and set inline on each panel, so the prerendered HTML is already right. Focal points (`--focus`, on the slug modifier) frame each subject with room around it: Facial `center 80%` (70% from 1680px), which lifts the jar so its lid label clears the count; Flash `center 22%` (eyes, patches, sachet); Devices `center 50%` (the whole mask). At 1440 the open panel crops at most 12% on any side. At 1920 the 50% floor makes it 800×638, so the 4:5 photographs lose about 36% of their height. The width animates on `flex-basis`. Layers, bottom to top, each `position: absolute; inset: 0` with a z-index: the image graded `brightness(.88) saturate(.92)` (0); the always-on base scrim `--g-worlds-base`, which darkens only the text area (noir 92% → 60% at 24% → 52% at 33% → 0 at 46%; Flash Treatment uses `--g-worlds-base-strong`, 65% at 28%, because its white box sits behind the count, plus a flat 30% veil from 1024 to 1279px where the panels are small), the top shade `--g-worlds-top` for the number, and, on closed panels only, a flat noir 50% veil with a left gradient `--g-worlds-closed-name` (1); the content (2), with pearl name, pearl 80% description, count and Explore, gold-light number and arrow, and `--shadow-worlds-text` on the name and description. Measured contrast at 1440 is at least 4.6:1 for the description, count and Explore, and 5.6:1 for the name. The open panel (the first by default) has, 32px from the bottom and within the bottom 36% of the panel, the number and count, the name (32px at 1440, scaled down to stay on one line on narrower panels), the description (15px / 1.6, max 420px) and "Explore →". The closed panels have the number top-left, a vertical name (26px) bottom-left and the count bottom-right. Hover or focus opens a panel: `flex-basis` over 0.6s, the veil fades out and the content fades in after 0.15s. The state is driven by the custom property `--o`; there are no transitions under reduced motion. Under 1024px the panels are three open 4:5 cards (the photographs' own ratio, so no crop) with the same focal points, 16px apart, with the taller scrim `--g-worlds-base-tall` plus the 30% veil because the text takes more of the card.
  4. **Signature** (`HomeSignature`, white, ≈760px): edge-to-edge 50/50. `brand/signature.webp` (a model holding a cream jar in window light; a brand photograph, not the product shot) fills the left half at `object-position: 55% 30%`, with a pearl 70% frame inset 28px. Beside it: the light eyebrow (gold rule, gold-text), the name (taupe), subtitle (ink), description (ink-soft), an ink 14% hairline, the 80% figure (`--t-figure-home`, gold-text) with its taupe label, and the ink "View Product" button.
  5. **The Science** (`HomeScience`, pearl, 680px band on desktop, no photograph): eyebrow, two-line title, teaser and link in columns 1–5. In columns 7–12, the eight technologies numbered 01–08 in a 2-column hairline grid (26px, weight 200).
  6. **LusterScan AI** (`HomeLusterScan`, noir, cinematic, ≈936px at 1440; `min-height: clamp(860px, 65vw, 1000px)`, `overflow: hidden`): `brand/lusterscan-cinematic.webp` (1323×1073, its background already noir) is a layer behind everything, 40px from the top, `min(62.5vw, 1100px)` wide. It runs past the right edge by `max(2.8vw, 552px − 37.3vw)`: 40px at 1440, more on narrower screens so the face (from 13% of the image's width) always starts right of the text. Over it sit a left scrim `--g-scan-left` and a 340px bottom scrim `--g-scan-bottom`. Above them: the text block (max 520px, from 128px) with the eyebrow, the three-line title (`clamp(32px, 3.33vw, 48px)`), the text (17px / 1.8, pearl 72%), the Explore link and the note (12px, pearl 50%). Its minimum height keeps the steps below the jar (66% of the image height). The four steps sit 84px above the bottom with no borders or boxes: 56px gold-light numerals, an 11px title and a 14px description at pearl 68%. At 768–1023px the image is 75vw, the text 440px and the steps 2×2. Under 768px the image comes first, edge to edge with a fade into noir (`--g-scan-fade`), then the text, then the steps in one column (44px numerals). Measured contrast: note 4.9:1, step descriptions 7.7:1 or more.
  7. **Results** (`HomeResults`, white, ≈760px): edge-to-edge 50/50 with the image on the **left** (LusterScan above has its image on the right, so the page alternates). `brand/results-couple.webp` (a couple behind a table of Lavish Luster products) fills the left half at `object-position: center 30%`, both faces in frame, with a pearl 75% frame inset 28px and no zoom. On the right (padding 0 120px 0 96px, vertically centred): the light eyebrow (gold rule, gold-text), the two-line title (`clamp(30px, 2.8vw, 40px)`, ink), the paragraph (16px / 1.85, ink-soft, max 520px) and "Explore Results". Under 1024px the image comes first (full width, 4:5, max 560px), then the text. The same photograph heads the Results page in a `split` `PageHero` (right half only, `center 20%`), where a full-width crop would cut the faces or put them under the text. `brand/intro.webp` was removed because its products carry another brand's labels.
  8. **Consultation** (`sections/ConsultationCta`, pearl, ≈440px, no image): a centred column with a 1px × 56px gold line, the two-line title and the ink button (plus a page's optional secondary link). Inner pages use the same band.
  9. **Footer** (noir, ≈496px): one centred column (`components/footer/Footer.jsx`, all text from `contact.js`, `master-brand.json` and `navItems.js`). It holds the logo at 280px (200px on mobile), the tagline (10px gold-light, tracking 0.32em), then 56px below the nav in one row (Home … Contact, 11px, tracking 0.22em, 44px gaps, narrower below 1280px so it never wraps; a 1px gold underline 6px below on hover; legal and social links join it when their flags are on). 56px below that: the address (linked to the map) and the email, split at the centre by a 1px gold-light divider, between two pearl 14% hairlines. Then © year with `contact.copyright` on the left and the sub-tagline on the right. It sits on the shared `.container` (the same edges as the header and every section). Under 768px the nav is a 2-column grid of 44px rows, and the contact row and bottom row stack centred.

  Following the document's Home page content rule, every block appears once: the brand statement and the four pillars are only in the hero; the footer carries only the logo, taglines, nav and contact details. `scripts/verify-website-content.mjs` enforces this on every build. No photograph is used twice. `HomeFeatured` (white) appears only when `features.featuredProducts` is on.
- **Home hero ("Noir Couture"):** flat noir (`100svh`, 720–1080px). There is no background photo and no gradients. A framed stage panel (`--c-noir-raised` with a 1px gold border at 60%) sits on the right. It is `clamp(340px, 30.5vw, 560px)` wide, 160px from the right edge at 1440, and bleeds past the bottom. The cut-out `brand/hero-noir-figure.webp` is 145.45% of the panel width; her head rises above the panel's top border and her shawl spills out to its left. A vertical gold label runs along the panel's right inner edge. The copy column starts at `--hero-pad-left` (120px at 1440), max 600px, vertically centred. It holds a gold eyebrow with a 36px rule, the two-line H1, the brand statement as lead (16px, pearl at 72%, max 470px), the pearl "Explore Products" button and the "Discover LusterScan AI" text link. The four pillars run from the copy edge to the header's right edge, above a pearl rule at 18% that crosses the panel. Below 1024px the hero stacks: the stage, centred and no longer bleeding, then the copy. Below 640px the actions stack, the button goes full width, the pillars become 2×2 and the label is hidden. Copy lives in `home.hero` (`src/data/content/home.js`); the vertical label is the footer logo line "Lavish Luster — Beauty & More".
- **Layout:**
  - Every page, the header and the footer use one shared set of edges. Sections and the footer use `.container`; the header bar is padded to `--edge`, the same line, so its first and last nav links sit on the content edges (from 1024 to 1199px the bar tightens to 24px gaps and a 32px logo to stay clear of it). The footer's logo and nav are centred in the container, its hairlines span it, and its bottom row sits on its left and right edges.
  - The shared `.container`: Content is at most 1600px wide (`--content-max`), with side padding `--page-pad`. That padding equals the Home hero's text edge at every width: `clamp(24px, 8.33vw, 180px)` from 1024px up (120px at 1440) and `clamp(24px, 6.25vw, 64px)` below 1024px. All left edges line up with the hero up to about 1960px wide. Wider than that, the 1600px content centres.
  - The grid has 12 columns with a 32px gutter (`--grid-gap`). `.split` places the header in columns 1–5 and content in 7–12.
  - `.halves` is the edge-to-edge 50/50. The image side has a capped height (`--halves-img-h`: `clamp(440px, 40vw, 640px)`, cover) and grows only if the text is taller. The text side is vertically centred, with `clamp(40px, 6vw, 96px)` on the inside edge.
  - Under 1024px, `.split` and `.halves` stack, image first: 4:5, at most 480px tall.
  - Home section padding (`--section-y`): `clamp(72px, 7.8vw, 128px)` (112px at 1440). Section building blocks live in `components.css`: `.home-eyebrow` (36px gold rule; gold-text on light, gold-light inside `.on-dark`), `.home-title` (weight 200, uppercase, line-height 1.1, tracking 0.05em), `.home-label`, and `TitleLines` (line breaks from `titleLines` in `home.js`, which must join back to the verbatim title; the build checks this). Hairlines are ink at 14% on light surfaces and pearl at 18% on dark ones.
  - Height and size limits:
    - Text columns are at most 520px wide (`--text-max`).
    - Images inside the container are at most 480×600.
    - At 1440×900 and 1920×1080, no Home section is taller than 860px; Collections may reach 960px.
    - Measured at 1440×900: Brand Philosophy 775, Product Worlds 970, Signature 760, Science 680, LusterScan 1041, Results 720, Consultation 463, footer 486.
  - **Footer:** 96px top and 40px bottom padding; one centred column (`components/footer/Footer.jsx`, all text from `contact.js`, `master-brand.json` and `navItems.js`). It holds the logo at 280px (200px on mobile), the tagline (10px gold-light, tracking 0.32em), then 56px below the nav in one row (Home … Contact, 11px, tracking 0.22em, 44px gaps, narrower below 1280px so it never wraps; a 1px gold underline 6px below on hover; legal and social links join it when their flags are on). 56px below that: the address (linked to the map) and the email, split at the centre by a 1px gold-light divider, between two pearl 14% hairlines. Then © year with `contact.copyright` on the left and the sub-tagline on the right. It sits on the shared `.container` (the same edges as the header and every section). Under 768px the nav is a 2-column grid of 44px rows, and the contact row and bottom row stack centred.
  - Radius is 0 everywhere, there are no shadows, and hairlines appear only between rows.
- **Header:** full width, 96px tall on desktop, padded to `--edge` (the content edges: 120px at 1440). The nav (11px, weight 500, tracking 0.2em, 34px gaps, gold underline growing on hover) is split three and three around the centred logo (About, Products, LusterScan AI on the left; The Science, Results, Contact on the right), shown at 40px tall in its natural 1200:204 ratio. The full bar starts at 1024px; below that, the menu button opens the menu with Home and the six links. It is transparent with pearl text and the light logo over the Home hero until the page scrolls, and solid pearl with dark text everywhere else. On mobile, a full-screen noir menu opens.
- **Motion:** image hover zoom (1.035 over 1.2s), link underlines, a 300ms page fade, a crossfade on catalog filters and a fade on the mobile menu. There is no smooth scrolling and no scroll-triggered animation, and `prefers-reduced-motion` is respected.
