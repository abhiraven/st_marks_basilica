// Booking/affiliate links are free-text fields in the admin panel. If
// someone pastes a link without "http(s)://" (e.g. "getyourguide.com/...."),
// using it directly as an <a href> makes the browser treat it as a path
// *relative to this site* — so the button silently "redirects" to
// https://thissite.com/getyourguide.com/... instead of leaving the site,
// which 404s since no such route exists here. That's the "it's taking a
// prefix" bug: this site's own domain becomes an unwanted prefix in front
// of the link the admin actually typed.
//
// normalizeExternalUrl guarantees a link always has a scheme, so it always
// takes visitors straight to the exact URL saved in the admin panel.
export function normalizeExternalUrl(url) {
  const trimmed = String(url || "").trim();
  if (!trimmed) return trimmed;
  if (/^https?:\/\//i.test(trimmed) || trimmed.startsWith("//")) return trimmed;
  if (trimmed.startsWith("#") || trimmed.startsWith("/")) return trimmed; // in-page/relative links stay as-is
  return `https://${trimmed}`;
}
