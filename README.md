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
cp .env.example .env.local   # add your Neon DATABASE_URL, SESSION_SECRET, SEED_ADMIN_USER
npm run seed                 # creates the schema, an admin user, and 3 starter blog posts
npm run dev                  # http://localhost:3000
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
