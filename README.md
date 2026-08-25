# St Mark's Basilica Entry

A Next.js (App Router) booking landing page for St Mark's Basilica tickets and guided tours in
Venice, with a built-in blog and a password-protected admin panel for managing blog posts and
every editable section of the site. Data is stored in a dedicated Neon Postgres database — this
project does not share a database with any other site.

Targets the keywords: **St Mark's Basilica tickets**, **St Mark's Basilica Venice**,
**St Mark's Basilica skip the line tickets**, **St Mark's Basilica guided tours**, plus a long
list of supporting keywords (ticket price, entry, admission, dress code, opening hours, and
more) covered naturally across the homepage, blog, and FAQ.

## Setup

Requires Node.js 18+ and a Neon Postgres database (create a free one at
[neon.tech](https://neon.tech) — use a project dedicated to this site, separate from any other
project's database).

```bash
npm install
# create .env.local in the project root (see the required variables below)
npm run seed                 # creates the schema, an admin user, and 3 starter blog posts
npm run dev                  # http://localhost:3000
```

`.env.local` is git-ignored — create it yourself in the project root (never commit it) with:

```env
# Neon Postgres connection string. Get this from your Neon project dashboard
# (Connection Details → the "pooled connection" string). Must include
# ?sslmode=require at the end if Neon doesn't add it automatically.
DATABASE_URL=postgres://user:password@ep-example-12345.us-east-2.aws.neon.tech/neondb?sslmode=require

# Secret used to sign admin session cookies. Set this to a long random string in production.
SESSION_SECRET=change-me-to-a-long-random-string

# Used only by `npm run seed` to create the initial admin account (fresh installs).
# Leave SEED_ADMIN_PASS blank to have the script generate a random password
# for you (printed once in the terminal) instead of using a guessable default.
SEED_ADMIN_USER=admin
SEED_ADMIN_PASS=

# Vercel Blob — stores images uploaded from the admin panel (photos, blog
# covers, etc). Required because Vercel's serverless functions run on a
# read-only filesystem, so uploads can't be saved to disk directly.
# Create a Blob store: Vercel dashboard → your project → Storage → Create
# Database → Blob. It will generate this token for you automatically —
# just copy it here for local dev; on Vercel itself it's added for you.
BLOB_READ_WRITE_TOKEN=

# Cloudflare Turnstile — protects the admin login page with a CAPTCHA
# challenge. Get both keys from the Turnstile tab of your Cloudflare
# dashboard. Optional: if left blank, the login page skips the widget and
# logs in as normal (useful for local dev without Turnstile set up).
NEXT_PUBLIC_TURNSTILE_SITE_KEY=
TURNSTILE_SECRET_KEY=
```

Leave `SEED_ADMIN_PASS` blank in `.env.local` and the seed script will generate a random admin
password for you, printed once in the terminal — save it, then log in and change it from the
admin panel (`/admin/login`, default username `admin` unless `SEED_ADMIN_USER` is set).

## Booking / affiliate links

Tour cards on the homepage link to GetYourGuide listings. Open `lib/tours-data.js` and set
`AFFILIATE_PARTNER_ID` to your own GetYourGuide (or other) partner/affiliate ID so bookings made
through the site earn commission. Until then, links work but won't be attributed to you.

## Project structure

- `app/page.js` — main landing page (hero, tour cards, ticket prices, FAQ, etc.)
- `app/blog/` — public blog listing and post pages
- `app/admin/` — admin panel (login, dashboard, create/edit posts, edit every page's content)
- `app/api/admin/` — auth + posts + content API routes used by the admin panel
- `lib/db.js` — Neon Postgres connection and schema
- `lib/home-content.js`, `lib/about-content.js`, `lib/contact-content.js`,
  `lib/privacy-content.js`, `lib/site-chrome-content.js` — default editable copy for each page,
  stored in the `site_content` table and overridable from the admin panel
- `lib/tours-data.js` — affiliate partner ID and link-building helper
- `lib/images.js` — the Unsplash photo set used across the site
- `scripts/seed.js` — creates the admin user and seeds 3 starter blog posts
- `scripts/push-content-update.js` — pushes a rewritten `lib/home-content.js` /
  `scripts/seed-data.js` into an already-seeded database

## Production build

```bash
npm run build
npm start
```

Set a real `SESSION_SECRET` in your production environment — the admin session cookies are signed
with it. Also replace the placeholder Google Analytics ID (`G-XXXXXXXXXX`) in `app/layout.js` with
this project's own GA4 measurement ID before launch.

## Notes

- Photos are curated, free-to-use Unsplash images of St Mark's Basilica and Venice
  (`lib/images.js`). Swap in real/licensed photos when you have them — just replace the image
  keys or point the relevant fields to your own URLs from the admin panel.
- Ticket prices and hours are current as of publishing but should be periodically checked against
  the official St Mark's Basilica ticketing site.
# st_marks_basilica
