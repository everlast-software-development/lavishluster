/** Pending integrations. Values stay null until confirmed. */
export const integrations = {
  lusterscan: { appUrl: null, videoUrl: null },
  inquiry: {
    endpoint: '/api/enquiry',
    // Optional consent line (with the Privacy Policy). When set, it renders above the button; it is not
    // required by the endpoint.
    consentText: null,
  },
};
