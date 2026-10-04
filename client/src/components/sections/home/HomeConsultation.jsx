import ConsultationCta from '../ConsultationCta.jsx';
import { home } from '../../../data/content/home.js';

/** 08 — Consultation: the shared centred band; title (on two lines) and CTA from home.js. */
export default function HomeConsultation() {
  const { title, titleLines, cta } = home.consultation;
  return <ConsultationCta title={title} titleLines={titleLines} cta={cta} />;
}
