/** Pending integrations. Values stay null until confirmed. */
export const integrations = {
  lusterscan: { appUrl: null, videoUrl: null },
  inquiry: {
    endpoint: '/api/inquiry',
    // Consent wording must be supplied with the Privacy Policy before submission is enabled.
    consentText: null,
  },
};
