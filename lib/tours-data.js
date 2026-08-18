// Replace YOUR_PARTNER_ID in AFFILIATE_PARTNER_ID with your real GetYourGuide
// (or other booking partner) affiliate/partner ID to start earning commission
// on every booking made through these links. Every tour/combo URL saved from
// the admin panel currently ships with this literal placeholder, so no
// affiliate revenue is being tracked until it's replaced.
export const AFFILIATE_PARTNER_ID = "YOUR_PARTNER_ID";

export function withPartnerId(url) {
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}partner_id=${AFFILIATE_PARTNER_ID}&utm_medium=online_publisher&cmp=stmarksbasilica`;
}

// The 3 main tour/ticket cards and the combo cards used to live here as
// static exports. Both are now editable from the admin panel (Home Page →
// Tour & Ticket Cards / Combo Offer Cards) and stored in the database — see
// lib/home-content.js `DEFAULT_HOME_CONTENT.tours` /
// `DEFAULT_HOME_CONTENT.combosSection.items` for the current defaults.
