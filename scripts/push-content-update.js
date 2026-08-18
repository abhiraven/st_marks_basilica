// Pushes freshly rewritten copy into an EXISTING Neon database — use this
// after a content rewrite in lib/home-content.js / scripts/seed-data.js,
// since editing those source files alone has no effect on a site whose
// homepage and posts are already saved in the database.
//
// What it touches:
//   - site_content ('home' key): overwritten with the current
//     DEFAULT_HOME_CONTENT from lib/home-content.js.
//   - posts: for each entry in scripts/seed-data.js, updates title/excerpt/
//     content on the matching row (matched by slug). Everything else on
//     that post — category, featured, cover photo, SEO fields, published
//     state — is left exactly as it is, in case you've customized it from
//     the admin panel. If a slug doesn't exist yet, the post is inserted.
//
// Usage:  npm run push-content-update
//
// Safe to re-run. This does NOT touch admin_users.

const fs = require("fs");
const path = require("path");
const { neon } = require("@neondatabase/serverless");
const { POSTS } = require("./seed-data");

loadEnvLocal();

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is not set. Add your Neon connection string to .env.local first.");
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

function loadEnvLocal() {
  const envPath = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = value;
  }
}

async function ensureSchema() {
  await sql`
    CREATE TABLE IF NOT EXISTS posts (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      excerpt TEXT,
      content TEXT NOT NULL,
      cover_color TEXT DEFAULT 'marble',
      category TEXT DEFAULT 'Travel Tips',
      featured INTEGER DEFAULT 0,
      published INTEGER DEFAULT 1,
      seo_title TEXT,
      meta_description TEXT,
      cover_image TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS site_content (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
}

async function pushHomeContent() {
  // lib/home-content.js is an ES module (uses `import`/`export`), so it's
  // loaded here via dynamic import rather than require(), which works fine
  // from a CommonJS script in modern Node. It also imports lib/db.js, which
  // requires DATABASE_URL to already be set — loadEnvLocal() above runs
  // first, so that's covered.
  const { DEFAULT_HOME_CONTENT } = await import("../lib/home-content.js");
  const value = JSON.stringify(DEFAULT_HOME_CONTENT);
  await sql`
    INSERT INTO site_content (key, value, updated_at) VALUES ('home', ${value}, NOW())
    ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()
  `;
  console.log("Home page content updated.");
}

async function pushPosts() {
  for (const post of POSTS) {
    const existingRows = await sql`SELECT id FROM posts WHERE slug = ${post.slug}`;
    if (existingRows[0]) {
      await sql`
        UPDATE posts SET title = ${post.title}, excerpt = ${post.excerpt}, content = ${post.content}, updated_at = NOW()
        WHERE slug = ${post.slug}
      `;
      console.log(`Updated post copy: ${post.title}`);
    } else {
      await sql`
        INSERT INTO posts (title, slug, excerpt, content, cover_color, category, featured, published)
        VALUES (${post.title}, ${post.slug}, ${post.excerpt}, ${post.content}, ${post.cover_color}, ${post.category}, ${post.featured}, 1)
      `;
      console.log(`Inserted new post: ${post.title}`);
    }
  }
}

async function main() {
  await ensureSchema();
  await pushHomeContent();
  await pushPosts();
  console.log("Content update complete.");
}

main().catch((err) => {
  console.error("Content push failed:", err);
  process.exit(1);
});
