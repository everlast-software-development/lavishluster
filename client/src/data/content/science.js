/**
 * Beauty technology index for The Science page (derived, source tag D).
 * Labels are the technology names used in the Master; each device entry
 * quotes the exact Master phrase (substring of the named field, verified).
 */
export const technologies = [
  {
    id: 'led', label: 'LED',
    devices: [
      { slug: 'luster-centurion-led-pro-5-0', phrase: '7 LED colors plus NIR', from: 'enhancedBenefits' },
      { slug: 'luster-hair-growth-omega-5-0', phrase: 'LLLT-LED system with 352 diodes', from: 'enhancedBenefits' },
      { slug: 'luster-korean-mask', phrase: '1,064 LED lights', from: 'enhancedBenefits' },
      { slug: 'luster-led-neck-and-chin-mask', phrase: 'Red LED and NIR light', from: 'enhancedBenefits' },
      { slug: 'luster-tech-eye-mask', phrase: 'Red LED Light', from: 'enhancedBenefits' },
      { slug: 'luster-tech-body-slim-x4', phrase: 'LED, EMS, RF, and Slim', from: 'enhancedBenefits' },
    ],
  },
  {
    id: 'nir', label: 'NIR',
    devices: [
      { slug: 'luster-centurion-led-pro-5-0', phrase: '7 LED colors plus NIR', from: 'enhancedBenefits' },
      { slug: 'luster-hair-growth-omega-5-0', phrase: 'Red LED plus NIR', from: 'enhancedBenefits' },
      { slug: 'luster-led-neck-and-chin-mask', phrase: 'Red LED and NIR light', from: 'enhancedBenefits' },
    ],
  },
  {
    id: 'lllt', label: 'LLLT',
    devices: [{ slug: 'luster-hair-growth-omega-5-0', phrase: 'LLLT-LED system with 352 diodes', from: 'enhancedBenefits' }],
  },
  {
    id: 'ems', label: 'EMS',
    devices: [
      { slug: 'luster-tech-eye-mask', phrase: 'Microstimulation / EMS', from: 'enhancedBenefits' },
      { slug: 'luster-tech-body-slim-x4', phrase: 'LED, EMS, RF, and Slim', from: 'enhancedBenefits' },
    ],
  },
  {
    id: 'rf', label: 'RF',
    devices: [{ slug: 'luster-tech-body-slim-x4', phrase: 'LED, EMS, RF, and Slim', from: 'enhancedBenefits' }],
  },
  {
    id: 'thermal', label: 'Thermal',
    devices: [{ slug: 'luster-thermo-sonic-2-0', phrase: '42°C Thermal Technology', from: 'enhancedBenefits' }],
  },
  {
    id: 'sonic', label: 'Sonic',
    devices: [{ slug: 'luster-thermo-sonic-2-0', phrase: 'Sonic Vibration', from: 'enhancedBenefits' }],
  },
  {
    id: 'slim', label: 'Slim',
    devices: [{ slug: 'luster-tech-body-slim-x4', phrase: 'LED, EMS, RF, and Slim', from: 'enhancedBenefits' }],
  },
];
