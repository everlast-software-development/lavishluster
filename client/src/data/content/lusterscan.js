/**
 * LusterScan AI page copy — content-source/website-content.md, section 7,
 * exactly as written there. Checked by scripts/verify-website-content.mjs.
 * Excluded (section 16): the "Your Personal Dermatologist" headline and the
 * "Dermatological precision analysis" bullet; the welcome video and the
 * app/API integration stay off until supplied.
 */
export const lusterscanPage = {
  hero: { eyebrow: 'LusterScan AI', title: 'Your Personal Skin Advisor' },
  what: {
    title: 'What is LusterScan AI',
    text: 'Advanced AI software analyzes your skin in detail—wrinkles, imperfections, firmness, and blemishes—to provide a 100% personalized skincare protocol.',
  },
  steps: [
    { title: 'High-Quality Capture', text: 'Take a selfie or upload a high-resolution photo of your skin.' },
    { title: 'Advanced Analysis', text: 'AI analyzes your skin to detect concerns and estimate skin age.' },
    { title: 'Personalized Luxury Care', text: 'Receive a tailored product protocol designed for your skin’s needs.' },
    { title: 'Progress Tracking', text: 'Monitor your skin’s improvement step by step with each new scan.' },
  ],
  analyzes: {
    title: 'What it analyzes',
    items: ['wrinkles', 'imperfections', 'firmness', 'blemishes', 'skin age', '25+ skin concern identification'],
  },
  features: ['Personalized recommendations', 'Progress tracking'],
  // The document's disclaimer line, published as the full verified note from section 5.
  disclaimer: 'Results are precise and personalized, enhancing your beauty routine, while professional dermatological consultation remains the best option when needed.',
  cta: { label: 'Request a Consultation', to: '/contact' },
};
