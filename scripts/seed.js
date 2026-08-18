// Fresh-install seed script — targets Neon Postgres (DATABASE_URL).
// Creates the schema if it doesn't exist yet, ensures an admin account, and
// inserts a few sample blog posts. Safe to re-run: everything is idempotent.
//
// If you're migrating an *existing* SQLite install into Neon instead of
// starting fresh, use `npm run migrate-to-neon` (scripts/migrate-to-neon.js)
// so your real posts/users/home content come across instead of this sample data.

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const { neon } = require("@neondatabase/serverless");
const { POSTS } = require("./seed-data");

// A random password beats a static one — a hardcoded default would end up
// documented in this repo, so anyone who runs `npm run seed` on a fresh
// install without setting SEED_ADMIN_PASS would otherwise get a
// widely-known, guessable admin password.
function generateRandomPassword() {
  return crypto.randomBytes(12).toString("base64url");
}

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
    CREATE TABLE IF NOT EXISTS admin_users (
      id SERIAL PRIMARY KEY,
      username TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      email TEXT,
      role TEXT DEFAULT 'editor',
      permissions TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
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

async function main() {
  await ensureSchema();

  // --- Admin user ---
  const ADMIN_USER = (process.env.SEED_ADMIN_USER || "admin").trim().toLowerCase();
  const usingGeneratedPass = !process.env.SEED_ADMIN_PASS;
  const ADMIN_PASS = process.env.SEED_ADMIN_PASS || generateRandomPassword();

  const existingAdminRows = await sql`SELECT id FROM admin_users WHERE username = ${ADMIN_USER}`;
  if (!existingAdminRows[0]) {
    const hash = bcrypt.hashSync(ADMIN_PASS, 10);
    await sql`
      INSERT INTO admin_users (username, password_hash, role, permissions, created_at)
      VALUES (${ADMIN_USER}, ${hash}, 'admin', '[]', NOW())
    `;
    console.log(`Created admin user "${ADMIN_USER}" with password "${ADMIN_PASS}"`);
    if (usingGeneratedPass) {
      console.log("(SEED_ADMIN_PASS wasn't set, so a random password was generated — save it now, it won't be shown again. Log in and change it from the admin panel.)");
    }
  } else {
    await sql`
      UPDATE admin_users SET role = 'admin' WHERE username = ${ADMIN_USER} AND (role IS NULL OR role = '')
    `;
    console.log(`Admin user "${ADMIN_USER}" already exists, skipping.`);
  }

  // --- Blog posts ---
  for (const post of POSTS) {
    const existingRows = await sql`SELECT id FROM posts WHERE slug = ${post.slug}`;
    if (!existingRows[0]) {
      await sql`
        INSERT INTO posts (title, slug, excerpt, content, cover_color, category, featured, published)
        VALUES (${post.title}, ${post.slug}, ${post.excerpt}, ${post.content}, ${post.cover_color}, ${post.category}, ${post.featured}, 1)
      `;
      console.log(`Inserted post: ${post.title}`);
    } else {
      // Post already exists — backfill its category/featured values without
      // touching other fields (e.g. if it was edited from the admin panel).
      await sql`
        UPDATE posts SET category = ${post.category}, featured = ${post.featured} WHERE slug = ${post.slug}
      `;
      console.log(`Post already exists, updated category/featured: ${post.title}`);
    }
  }

  console.log("Seed complete.");
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
