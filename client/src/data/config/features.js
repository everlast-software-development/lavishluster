/**
 * Feature flags. Every unconfirmed section is built and wired to its data
 * source but stays OFF until approved content is supplied.
 * A section renders only when its flag is true AND its data is non-empty.
 */
export const features = {
  clinic: false,                // /clinic page, nav/footer entries, Home clinic teaser
  featuredProducts: false,      // Home featured products (select slugs in config/featured.js)
  beforeAfter: false,           // Home + Results galleries (data/results/beforeAfter.js)
  testimonials: false,          // Home + Results (data/testimonials/index.js)
  experts: false,               // About + Clinic (data/experts/index.js)
  certifications: false,        // Device pages + Science (V-04)
  socialLinks: false,           // Footer social (data/content/contact.js)
  legalPages: false,            // /privacy, /terms and footer legal links
  lusterscanIntegration: false, // LusterScan "start analysis" CTA / app link
  lusterscanVideo: false,       // LusterScan welcome video
  inquirySubmission: true,      // Contact form submission (copy approved in data/content/enquiry.js);
                                // needs TURNSTILE_SITE_KEY at build time and the server env (.env.example)
};

export const site = {
  name: 'Lavish Luster',
  url: 'https://lavishluster.com',
};
