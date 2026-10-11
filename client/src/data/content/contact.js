/**
 * Contact information. Only confirmed values are set; pending values are null
 * and are never rendered (phone, opening hours, social accounts — V-13).
 */
export const contact = {
  email: 'info@lavishluster.com',
  // Verified old-site spelling: kept for the build check, the map link and structured data.
  address: 'The Galleria, Al Maryah Island Abu Dhabi, UAE',
  // Display spelling from content-source/website-content.md (sections 5 and 10).
  addressDisplay: 'The Galleria, Al Maryah Island, Abu Dhabi, UAE',
  mapsUrl: 'https://maps.app.goo.gl/HxejzQSJBxtU2YXg6',
  phone: null,
  openingHours: null,
  social: { instagram: null, facebook: null, tiktok: null },
  copyright: 'Lavish Luster. All rights reserved.',
};
