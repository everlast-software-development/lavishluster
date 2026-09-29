/**
 * Verified Lavish Luster brand content (source tag W).
 * Every text value here appears verbatim in content-source/old-site-verified.md
 * (checked by scripts/verify-content.mjs). Only presentation-level changes are
 * made at render time (e.g. sentence case via CSS is NOT used to alter text).
 * Pending/withheld brand text lives in data/verification/register.js and is
 * never imported by the website.
 */
const HOME = 'https://lavishluster.com/';
const ABOUT = 'https://lavishluster.com/about-us/';

export const site = {
  heroTitle: { text: 'Where Science Meets Luxury', source: HOME },
  pillars: {
    source: HOME,
    items: ['Medical-Grade Efficacy', 'Biotechnological Innovation', 'Clean Luxury', 'Proven Results'],
  },
  intro: {
    title: { text: 'Medical Precision. Luxurious Ritual.', source: HOME },
    // Paragraph 2 of the welcome text is withheld (V-04, FDA terminology).
    body: {
      text: 'Lavish Luster was born from a vision to democratize beauty by bringing the effectiveness of medical-aesthetic treatments into the home. We recognized that sophisticated individuals shouldn’t have to choose between clinical efficacy and sensorial luxury.',
      source: HOME,
    },
  },
  science: {
    label: { text: 'Clinical excellence', verbatim: 'CLINICAL EXCELLENCE', source: HOME },
    title: { text: 'The Science of Beautiful Skin', source: HOME },
    body: {
      text: 'Our pharmaceutical-grade formulations deliver clinical results previously only available through professional aesthetic treatments.',
      source: HOME,
    },
  },
  results: {
    label: { text: 'Clinically Proven Results You Can Trust', source: HOME },
    title: { text: 'Results and Proven Effectiveness', source: HOME },
    body: {
      text: 'Lavish Luster’s dedication to medical techno-skincare is substantiated by a compelling array of clinically validated outcomes, showcasing a sophisticated and profound skin transformation. Our formulations, a synergy of pharmaceutical precision and biotechnological innovation, are meticulously crafted to deliver quantifiable and visible enhancements at both cellular and epidermal levels.',
      source: HOME,
    },
  },
  story: {
    text: 'Lavish Luster stands at the forefront of medical techno-skincare, driven by a profound commitment to innovation, scientific precision, and accessible efficacy. Our foundational principles are encapsulated in our Vision, Mission, and Core Values, which guide every aspect of our research, development, and engagement with our global community.',
    source: ABOUT,
  },
  vision: {
    text: 'To redefine the global landscape of beauty and skincare by pioneering biotechnological dermocosmetics that seamlessly integrate pharmaceutical precision with cutting-edge innovation. We envision a future where advanced, clinically proven skincare solutions are universally accessible, empowering individuals to achieve optimal skin health and radiant confidence through science-backed efficacy.',
    source: ABOUT,
  },
  mission: {
    text: 'Our mission is to democratize beauty by bringing the transformative power of medical-aesthetic treatments into the home. We achieve this by developing and delivering smart, clinical, and unisex beauty solutions that are not only highly effective and safe but also intuitively accessible. Through continuous scientific advancement and a relentless pursuit of excellence, we strive to empower every individual to experience visibly healthier, more resilient, and radiantly youthful skin.',
    source: ABOUT,
  },
  values: {
    source: ABOUT,
    items: [
      { title: 'Scientific Integrity', text: 'We are committed to rigorous scientific research, clinical validation, and transparent communication. Every formulation is grounded in evidence-based science, ensuring unparalleled efficacy and safety.' },
      { title: 'Biotechnological Innovation', text: 'We embrace pioneering advancements in biotechnology and dermocosmetics, constantly pushing the boundaries of what is possible in skincare to deliver next-generation solutions.' },
      { title: 'Precision & Efficacy', text: 'We meticulously craft our products with pharmaceutical precision, utilizing optimal concentrations of active ingredients to guarantee measurable, transformative results that rival professional treatments.' },
      { title: 'Accessibility & Empowerment', text: 'We believe that advanced skincare should be accessible to all. Our aim is to empower individuals globally with effective, easy-to-use solutions that foster confidence and well-being.' },
      { title: 'Sustainability & Responsibility', text: 'We uphold ethical practices, responsible sourcing, and environmental stewardship in all we do.' },
      { title: 'Client-Centric Excellence', text: 'Our community is at the heart of everything; we deliver exceptional experiences and build lasting trust through superior product performance.' },
    ],
  },
};

export const lusterscan = {
  source: HOME,
  label: { text: 'AI-powered diagnostics', verbatim: 'AI-POWERED DIAGNOSTICS' },
  homeTitle: 'LusterScan AI: Your Personal Skin Advisor',
  description: 'Advanced AI software analyzes your skin in detail—wrinkles, imperfections, firmness, and blemishes—to provide a 100% personalized skincare protocol.',
  // Terms taken verbatim from the description and step texts above.
  analyzes: ['wrinkles', 'imperfections', 'firmness', 'blemishes', 'skin age'],
  capabilities: ['Dermatological precision analysis', '25+ skin concern identification', 'Personalized product recommendations', 'Progress tracking & adjustments'],
  steps: [
    { title: 'High-Quality Capture', text: 'Take a selfie or upload a high-resolution photo of your skin.' },
    { title: 'Advanced Analysis', text: 'AI analyzes your skin to detect concerns and estimate skin age' },
    { title: 'Personalized Luxury Care', text: 'Receive a tailored product protocol designed for your skin’s needs.' },
    { title: 'Progress Tracking', text: 'Monitor your skin’s improvement step by step with each new scan.' },
  ],
  disclaimer: 'Results are precise and personalized, enhancing your beauty routine, while professional dermatological consultation remains the best option when needed.',
};
