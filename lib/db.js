import { neon } from "@neondatabase/serverless";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "DATABASE_URL is not set. Add your Neon connection string to .env.local — see .env.example."
  );
}

// Neon's HTTP driver: every `sql` call is a single stateless HTTPS request,
// which is what makes it safe to use from serverless functions / route
// handlers without managing a connection pool ourselves.
//
// IMPORTANT: Next.js caches `fetch()` calls by default, and the Neon driver
// makes its queries over `fetch()` under the hood. Without `cache: "no-store"`
// here, Next.js can silently serve a stale cached response for a SELECT
// query even on a `force-dynamic` page — which is why admin panel edits can
// fail to show up on the live site. This disables that caching so every
// query always hits the database.
export const sql = neon(connectionString, {
  fetchOptions: { cache: "no-store" },
});

// Idempotent schema setup — safe to call on every cold start. Postgres's
// `IF NOT EXISTS` / `ADD COLUMN IF NOT EXISTS` make this much simpler than
// the old SQLite PRAGMA-based migration dance: the full target schema is
// just declared directly, and re-running it is always a no-op once it's
// already applied.
let schemaReady = null;

export function ensureSchema() {
  if (!schemaReady) {
    schemaReady = (async () => {
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

      // Tracks failed admin login attempts so the login route can lock out
      // an IP+username pair after too many wrong passwords in a short
      // window — Turnstile alone doesn't help here since it's optional and
      // skipped entirely when TURNSTILE_SECRET_KEY isn't configured.
      await sql`
        CREATE TABLE IF NOT EXISTS login_attempts (
          id SERIAL PRIMARY KEY,
          username TEXT NOT NULL,
          ip TEXT NOT NULL,
          created_at TIMESTAMPTZ DEFAULT NOW()
        )
      `;

      // Safety net for anyone re-running this against a database that
      // already has these tables from an earlier, partial version of the
      // schema — every one of these is a no-op once the column exists.
      await sql`ALTER TABLE posts ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'Travel Tips'`;
      await sql`ALTER TABLE posts ADD COLUMN IF NOT EXISTS featured INTEGER DEFAULT 0`;
      await sql`ALTER TABLE posts ADD COLUMN IF NOT EXISTS seo_title TEXT`;
      await sql`ALTER TABLE posts ADD COLUMN IF NOT EXISTS meta_description TEXT`;
      await sql`ALTER TABLE posts ADD COLUMN IF NOT EXISTS cover_image TEXT`;
      await sql`ALTER TABLE posts ADD COLUMN IF NOT EXISTS cover_image_alt TEXT`;
      await sql`ALTER TABLE posts ADD COLUMN IF NOT EXISTS noindex INTEGER DEFAULT 0`;
      await sql`ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS email TEXT`;
      await sql`ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'editor'`;
      await sql`ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS permissions TEXT`;
      await sql`ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW()`;
    })();
  }
  return schemaReady;
}
