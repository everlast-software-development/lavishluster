/**
 * Home page copy — content-source/website-content.md, section 5, one field per
 * block, exactly as written there (the bold "Label:" prefixes are field names).
 * Checked by scripts/verify-website-content.mjs: every string here must appear
 * verbatim in the document, and every block must render once on the Home page.
 */
export const home = {
  hero: {
    eyebrow: 'World Leader in Medical Techno-Skincare',
    title: 'Where Science Meets Luxury',
    titleLines: ['Where Science', 'Meets Luxury'],
    text: 'Lavish Luster is a medical techno-beauty and biotechnological dermocosmetics company. Its mission is to bring the effectiveness of medical-aesthetic treatments into the home through clinical, safe, and accessible solutions.',
    pillars: ['Medical-Grade Efficacy', 'Biotechnological Innovation', 'Clean Luxury', 'Proven Results'],
    ctas: [
      { label: 'Explore Products', to: '/products' },
      { label: 'Discover LusterScan AI', to: '/lusterscan-ai' },
    ],
    // Vertical label on the hero stage panel: the footer logo line from the same section.
    verticalLabel: 'Lavish Luster — Beauty & More',
    figure: { alt: 'A model in a black abaya and shayla looking over her shoulder', width: 797, height: 805 },
  },

  philosophy: {
    eyebrow: 'Welcome to Lavish Luster',
    title: 'Medical Precision. Luxurious Ritual.',
    titleLines: ['Medical Precision.', 'Luxurious Ritual.'],
    text: 'Lavish Luster was born from a vision to democratize beauty by bringing the effectiveness of medical-aesthetic treatments into the home. We recognized that sophisticated individuals shouldn’t have to choose between clinical efficacy and sensorial luxury.',
    label: 'Smart Clinical Unisex Beauty',
    cta: { label: 'About Lavish Luster', to: '/about' },
  },

  productWorlds: {
    eyebrow: 'Products',
    categories: [
      { slug: 'facial-treatment', label: 'Facial Treatment', count: '15 products', text: 'All facial, eye-and-lip, sun-protection, intensive rejuvenation, and body-treatment products.' },
      { slug: 'flash-treatment', label: 'Flash Treatment', count: '5 products', text: 'Instant-effect ampoules, patches, and mask products.' },
      { slug: 'beauty-devices', label: 'Beauty Devices', count: '7 devices', text: 'All techno-beauty devices.' },
    ],
    cta: { label: 'Explore Products', to: '/products' },
  },

  science: {
    eyebrow: 'Clinical Excellence',
    title: 'The Science of Beautiful Skin',
    titleLines: ['The Science of', 'Beautiful Skin'],
    text: 'Our pharmaceutical-grade formulations deliver clinical results previously only available through professional aesthetic treatments.',
    technologies: ['LED', 'NIR', 'LLLT', 'EMS', 'RF', 'Thermal', 'Sonic', 'Slim'],
    cta: { label: 'Discover The Science', to: '/science' },
  },

  lusterscan: {
    eyebrow: 'AI-Powered Diagnostics',
    title: 'LusterScan AI: Your Personal Skin Advisor',
    titleLines: ['LusterScan AI:', 'Your Personal', 'Skin Advisor'],
    text: 'Advanced AI software analyzes your skin in detail—wrinkles, imperfections, firmness, and blemishes—to provide a 100% personalized skincare protocol.',
    steps: [
      { number: '01', title: 'High-Quality Capture', text: 'Take a selfie or upload a high-resolution photo of your skin.' },
      { number: '02', title: 'Advanced Analysis', text: 'AI analyzes your skin to detect concerns and estimate skin age.' },
      { number: '03', title: 'Personalized Luxury Care', text: 'Receive a tailored product protocol designed for your skin’s needs.' },
      { number: '04', title: 'Progress Tracking', text: 'Monitor your skin’s improvement step by step with each new scan.' },
    ],
    // Labels of the analysis motif: words from the text above (wrinkles, firmness, blemishes, imperfections).
    motifLabels: ['wrinkles', 'firmness', 'blemishes', 'imperfections'],
    note: 'Results are precise and personalized, enhancing your beauty routine, while professional dermatological consultation remains the best option when needed.',
    cta: { label: 'Explore LusterScan AI', to: '/lusterscan-ai' },
  },

  results: {
    eyebrow: 'Clinically Proven Results You Can Trust',
    title: 'Results and Proven Effectiveness',
    titleLines: ['Results and', 'Proven Effectiveness'],
    text: 'Lavish Luster’s dedication to medical techno-skincare is substantiated by a compelling array of clinically validated outcomes, showcasing a sophisticated and profound skin transformation. Our formulations, a synergy of pharmaceutical precision and biotechnological innovation, are meticulously crafted to deliver quantifiable and visible enhancements at both cellular and epidermal levels.',
    cta: { label: 'Explore Results', to: '/results' },
  },

  consultation: {
    title: 'Not sure which treatment is right for you?',
    titleLines: ['Not sure which treatment', 'is right for you?'],
    cta: { label: 'Request a Consultation', to: '/contact' },
  },

  footer: {
    logo: 'Lavish Luster — Beauty & More',
    text: 'Lavish Luster stands at the forefront of medical techno-skincare, driven by a profound commitment to innovation, scientific precision, and accessible efficacy.',
    exploreTitle: 'Explore',
    visitTitle: 'Visit',
    visit: 'The Galleria, Al Maryah Island, Abu Dhabi, UAE',
    contactTitle: 'Contact',
    contact: 'info@lavishluster.com',
    bottomLine: '© 2026 Lavish Luster. All rights reserved.',
  },
};
