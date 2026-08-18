const SITE_URL = "https://www.stmarksbasilicaentry.com";

// Serves at /robots.txt (Next.js file-convention route, same pattern as
// app/sitemap.js). Points crawlers at the sitemap and keeps the admin panel
// out of the crawl — it's already noindexed per-page via metadata, but
// disallowing the whole /admin path here also stops crawlers from wasting
// time requesting it at all.
export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/admin",
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
