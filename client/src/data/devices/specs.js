/**
 * Structured device information.
 * Every `text`, `label` and `description` below MUST be an exact substring of
 * the Master field named in `from` (enforced by scripts/verify-content.mjs).
 * Only information the Master provides is listed. Withheld/pending items
 * (V-01 pairing, V-02 Thermo-Sonic modes, V-03 NIR row, V-04 certifications)
 * are intentionally absent here — see data/verification/.
 */
export const deviceSpecs = {
  'luster-centurion-led-pro-5-0': {
    technology: [
      { text: '8 wavelengths', from: 'enhancedBenefits' },
      { text: '7 LED colors plus NIR', from: 'enhancedBenefits' },
      { text: 'full-face treatment design', from: 'enhancedBenefits' },
      { text: 'medical-grade antibacterial silicone', from: 'enhancedBenefits' },
      { text: '100% wireless operation', from: 'enhancedBenefits' },
      { text: 'AI-powered skin diagnosis', from: 'enhancedBenefits' },
    ],
  },
  'luster-hair-growth-omega-5-0': {
    technology: [
      { text: 'LLLT-LED system with 352 diodes', from: 'enhancedBenefits' },
      { text: 'Red LED plus NIR', from: 'enhancedBenefits' },
      { text: 'AI-powered scalp diagnosis', from: 'enhancedBenefits' },
      { text: '100% wireless operation', from: 'enhancedBenefits' },
      { text: 'Bluetooth for music', from: 'enhancedBenefits' },
      { text: 'flexible medical-grade silicone', from: 'enhancedBenefits' },
    ],
  },
  'luster-korean-mask': {
    technology: [
      { text: '1,064 LED lights', from: 'enhancedBenefits' },
      { text: '7 LED light colors', from: 'applicationSecret' },
      { text: 'Ophthalmologically compatible', from: 'enhancedBenefits' },
    ],
  },
  'luster-led-neck-and-chin-mask': {
    technology: [
      { text: 'Red LED and NIR light', from: 'enhancedBenefits' },
      { text: '100% wireless', from: 'enhancedBenefits' },
      { text: 'portable', from: 'enhancedBenefits' },
      { text: 'multifunctional', from: 'enhancedBenefits' },
    ],
    modes: [
      { label: 'CHIN MODE', description: 'slimming the chin and face', from: 'applicationSecret' },
      { label: 'NECK & DÉCOLLETÉ MODE', description: 'anti-aging treatment on the neck and décolleté', from: 'applicationSecret' },
    ],
  },
  'luster-tech-eye-mask': {
    technology: [
      { text: 'Microstimulation / EMS', from: 'enhancedBenefits' },
      { text: 'Red LED Light', from: 'enhancedBenefits' },
      { text: 'Customizable', from: 'enhancedBenefits' },
      { text: 'portable', from: 'enhancedBenefits' },
      { text: '100% wireless', from: 'enhancedBenefits' },
    ],
  },
  'luster-thermo-sonic-2-0': {
    technology: [
      { text: '3-in-1 device', from: 'enhancedBenefits' },
      { text: '42°C Thermal Technology', from: 'enhancedBenefits' },
      { text: 'Sonic Vibration', from: 'enhancedBenefits' },
      { text: 'Portable', from: 'enhancedBenefits' },
      { text: 'wireless', from: 'enhancedBenefits' },
      { text: 'multifunctional', from: 'enhancedBenefits' },
    ],
    // modes: pending — V-02 (UNIC mode names)
  },
  'luster-tech-body-slim-x4': {
    technology: [
      { text: 'LED', from: 'enhancedBenefits' },
      { text: 'EMS', from: 'enhancedBenefits' },
      { text: 'RF', from: 'enhancedBenefits' },
      { text: 'Slim', from: 'enhancedBenefits' },
      { text: 'Wireless', from: 'enhancedBenefits' },
      { text: 'portable', from: 'enhancedBenefits' },
    ],
    modes: [
      { label: 'toning', from: 'applicationSecret' },
      { label: 'fat burning', from: 'applicationSecret' },
      { label: 'cellulite reduction', from: 'applicationSecret' },
      { label: 'all-in-one treatment', from: 'applicationSecret' },
    ],
    // recommendedProducts: pending — V-01 (UNIC gel reference)
  },
};
