import ConsultationCta from '../ConsultationCta.jsx';
import { home } from '../../../data/content/home.js';

/** 09 — Consultation: the shared 50/50 band with couple.webp; title and CTA from home.js. */
export default function HomeConsultation() {
  const { title, cta } = home.consultation;
  return <ConsultationCta title={title} cta={cta} />;
}
