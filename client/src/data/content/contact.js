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
  mapEmbedUrl: 'https://maps.google.com/maps?q=The%20Galleria%2C%20Al%20Maryah%20Island%20Abu%20Dhabi%2C%20UAE&t=m&z=14&output=embed&iwloc=near',
  phone: null,
  openingHours: null,
  social: { instagram: null, facebook: null, tiktok: null },
  copyright: 'Lavish Luster. All rights reserved.',
};
