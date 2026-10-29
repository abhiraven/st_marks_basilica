import { sql, ensureSchema } from "@/lib/db";
import { getHomeContent } from "@/lib/home-content";
import { getAboutContent } from "@/lib/about-content";
import { getContactContent } from "@/lib/contact-content";
import { getPrivacyContent } from "@/lib/privacy-content";

const SITE_URL = "https://www.stmarksbasilicaentry.com";

// Same reasoning as every other page here: content (and therefore which
// URLs are noindex'd) can change at any time via the admin panel, so the
// sitemap is generated fresh per-request rather than baked in at build
// time, which also avoids needing a database connection during `next build`.
// Cached; purged on every admin save (see lib/revalidate).
export const dynamic = "force-static";
export const revalidate = 86400; // admin saves purge instantly; this is only a daily safety refresh

// Static pages, each paired with the same admin-controlled "seo.noIndex"
// flag used by their own generateMetadata() — a page hidden from search
// engines via the admin checkbox is left out of the sitemap too, since
// listing a noindex URL in the sitemap is a well-known SEO contradiction
// (submitting a page to crawlers while simultaneously telling them not to
// index it).
const STATIC_PAGES = [
  { path: "/", getContent: getHomeContent, priority: 1.0, changeFrequency: "weekly" },
  { path: "/about", getContent: getAboutContent, priority: 0.6, changeFrequency: "monthly" },
  { path: "/contact", getContent: getContactContent, priority: 0.5, changeFrequency: "yearly" },
  { path: "/privacy-policy", getContent: getPrivacyContent, priority: 0.3, changeFrequency: "yearly" },
];

async function getPublishedPosts() {
  try {
    await ensureSchema();
    return await sql`
      SELECT slug, noindex, updated_at
      FROM posts
      WHERE published = 1
      ORDER BY updated_at DESC
    `;
  } catch {
    return [];
  }
}

export default async function sitemap() {
  const entries = [];

  // /blog itself has no admin-editable noIndex toggle (see app/blog/page.js
  // — it's a static `metadata` export, not tied to site_content), so it's
  // unconditionally included.
  entries.push({
    url: `${SITE_URL}/blog`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.7,
  });

  for (const { path, getContent, priority, changeFrequency } of STATIC_PAGES) {
    const content = await getContent();
    if (content?.seo?.noIndex) continue;
    entries.push({
      url: `${SITE_URL}${path}`,
      lastModified: new Date(),
      changeFrequency,
      priority,
    });
  }

  const posts = await getPublishedPosts();
  for (const post of posts) {
    if (post.noindex) continue;
    entries.push({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: post.updated_at ? new Date(post.updated_at) : new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    });
  }

  return entries;
}
