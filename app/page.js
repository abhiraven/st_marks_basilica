import Link from "next/link";
import Image from "next/image";
import TourCard from "@/components/TourCard";
import FAQ from "@/components/FAQ";
import MobileBookBar from "@/components/MobileBookBar";
import { img, getPostCoverImage } from "@/lib/images";
import { normalizeExternalUrl } from "@/lib/url";
import Eyebrow from "@/components/Eyebrow";
import Icon from "@/components/Icon";
import { getHomeContent } from "@/lib/home-content";
import { sql, ensureSchema } from "@/lib/db";

export const dynamic = "force-static";
export const revalidate = 86400; // admin saves purge instantly; this is only a daily safety refresh

async function getLatestPosts() {
  try {
    await ensureSchema();
    return await sql`
      SELECT title, slug, excerpt, cover_color, cover_image, cover_image_alt, created_at
      FROM posts WHERE published = 1 ORDER BY created_at DESC LIMIT 3
    `;
  } catch {
    return [];
  }
}

// Homepage title/description are now editable from the admin panel (Home
// Page -> SEO) via seo.title / seo.description, same as About, Contact, and
// Privacy Policy. DEFAULT_HOME_CONTENT.seo in lib/home-content.js supplies
// the fallback used on a fresh install or if either field is ever left
// blank, so the <title>/<meta name="description"> tags are never empty.
// This also sets the robots directive based on whether an admin checked
// "Hide from search engines," and the canonical URL. Robots is always set
// explicitly (rather than omitted when indexing is on) so the page always
// renders exactly one <meta name="robots"> tag either way.
export async function generateMetadata() {
  const { seo } = await getHomeContent();
  return {
    title: seo?.title,
    description: seo?.description,
    alternates: { canonical: "/" },
    openGraph: {
      title: seo?.title,
      description: seo?.description,
    },
    robots: seo?.noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}

function renderBoldText(text) {
  const parts = String(text || "").split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={i}>{part.slice(2, -2)}</strong>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

export default async function HomePage() {
  const content = await getHomeContent();
  const { hero, trustBar, toursSection, combosSection, ticketPrices, benefits, highlights, bestTime, hours, location, nearby, faq, finalCta, tours } = content;
  const latestPosts = await getLatestPosts();

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-white">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25"
          style={{
            backgroundImage: `url(${hero.backgroundImage})`,
          }}
          aria-hidden="true"
        />
        {/* Below lg the right-hand image collage sits underneath the text
            instead of beside it, so the left-to-right fade used on desktop
            would otherwise leave the raw background photo bleeding through
            on the right edge behind a single centered text column. Mobile
            gets a near-solid overlay instead; the fade only kicks in once
            the two-column layout (and the photo it's fading toward) exists. */}
        <div className="absolute inset-0 bg-white/95 lg:hidden" aria-hidden="true" />
        <div
          className="absolute inset-0 hidden lg:block"
          style={{
            background:
              "linear-gradient(90deg, rgba(255,255,255,0.97) 0%, rgba(255,255,255,0.94) 40%, rgba(255,255,255,0.55) 70%, rgba(255,255,255,0.2) 100%)",
          }}
          aria-hidden="true"
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 lg:py-14 grid gap-8 lg:gap-12 lg:grid-cols-2 lg:items-center">
          {/* Left column */}
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-basilica-marbleBlack px-4 py-2 text-xs font-bold tracking-wide text-white">
                <Icon name="landmark" className="h-3.5 w-3.5" /> {hero.badgeText}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-basilica-marbleDark/25 bg-white px-4 py-1.5 text-xs font-semibold text-basilica-marbleBlack shadow-sm">
                <Icon name="landmark" className="h-4 w-4" />
                <span className="leading-tight">
                  {hero.subBadgeTitle}
                  <br />
                  <span className="font-normal text-basilica-marbleBlack/70">{hero.subBadgeSubtitle}</span>
                </span>
              </span>
            </div>

            <h1 className="mt-6 font-display text-3xl sm:text-4xl lg:text-[2.75rem] font-bold leading-[1.15] text-basilica-marbleBlack">
              {hero.title.split("\n").map((line, i, arr) => (
                <span key={i}>
                  {line}
                  {i < arr.length - 1 && <br />}
                </span>
              ))}
            </h1>

            <p className="mt-5 max-w-lg text-basilica-marbleBlack/70 text-base sm:text-lg leading-relaxed">
              {hero.subtitle}
            </p>

            <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 max-w-lg">
              {hero.features.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <Icon name={item.icon} className="h-8 w-8 shrink-0 text-basilica-bronze" />
                  <div>
                    <div className="text-sm font-semibold text-basilica-marbleBlack">{item.title}</div>
                    <div className="text-xs text-basilica-marbleBlack/60">{item.body}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="#tours"
                className="inline-flex items-center rounded-full bg-basilica-marbleBlack px-7 py-3.5 font-bold text-white shadow hover:bg-basilica-marbleBlack/90 transition"
              >
                {hero.primaryCtaText}
              </Link>
              <Link
                href="#tickets"
                className="inline-flex items-center rounded-full border-2 border-basilica-marbleBlack/20 px-7 py-3.5 font-bold text-basilica-marbleBlack hover:bg-basilica-marbleBlack/5 transition"
              >
                {hero.secondaryCtaText}
              </Link>
            </div>

            <div className="mt-7 flex items-center gap-3">
              <span className="flex items-center gap-0.5 text-basilica-copper">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Icon key={i} name="star" filled className="h-4 w-4" />
                ))}
              </span>
              <span className="font-bold text-basilica-marbleBlack">{hero.ratingValue}</span>
              <span className="text-sm text-basilica-marbleBlack/60">{hero.ratingText}</span>
            </div>
          </div>

          {/* Right column: image collage */}
          <div className="relative">
            <div className="relative h-40 sm:h-52 lg:h-56 w-full rounded-3xl overflow-hidden border-4 border-white shadow-lg">
              <Image
                src={hero.collageMainImage || img("mosaicCeiling", 1200)}
                alt={hero.collageMainImageAlt || "Gold Byzantine mosaic ceiling inside St Mark's Basilica"}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
                priority
              />
            </div>

            <span className="absolute -left-4 top-40 sm:top-48 z-10 flex h-24 w-24 flex-col items-center justify-center rounded-full bg-basilica-bronze text-center text-white shadow-lg">
              <span className="text-[10px] font-bold tracking-wide">{hero.priceBadgeLabel}</span>
              <span className="text-xl font-extrabold leading-none">{hero.priceBadgeValue}</span>
              <span className="text-[9px] font-semibold tracking-wide">{hero.priceBadgeUnit}</span>
            </span>

            <div className="mt-3 grid grid-cols-2 gap-3">
              {[
                "Crowds and pigeons in Piazza San Marco, Venice",
                "Gold mosaic facade detail of St Mark's Basilica",
                "Piazza San Marco with the Doge's Palace",
                "St Mark's Campanile bell tower above the square",
              ].map((fallbackAlt, i) => (
                <div
                  key={i}
                  className="relative h-20 sm:h-24 lg:h-28 w-full overflow-hidden rounded-2xl border-4 border-white shadow"
                >
                  <Image
                    src={hero.collageImages?.[i] || img(["piazza", "goldMosaic", "dogesPalace", "campanile"][i], 700)}
                    alt={hero.collageImagesAlt?.[i] || fallbackAlt}
                    fill
                    sizes="(min-width: 1024px) 25vw, 50vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <section className="border-y border-basilica-marbleDark/10 bg-basilica-marble">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-2 sm:grid-cols-4 gap-6">
          {trustBar.items.map((item, i) => (
            <div key={i} className="flex items-start gap-3">
              <Icon name={item.icon} className="h-8 w-8 shrink-0 text-basilica-bronze" />
              <div>
                <div className="text-sm font-semibold text-basilica-marbleBlack">{item.title}</div>
                <div className="text-xs text-basilica-marbleBlack/60">{item.body}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TOURS / TICKETS */}
      <section id="tours" className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <Eyebrow>{toursSection.eyebrow}</Eyebrow>
        <h2 className="mt-4 font-display text-3xl font-bold text-basilica-marbleBlack">
          {toursSection.title}
        </h2>
        <p className="mt-2 text-basilica-marbleBlack/70 max-w-2xl">{toursSection.subtitle}</p>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tours.map((tour, idx) => (
            <TourCard key={tour.id || idx} tour={tour} highlighted={idx === 0} />
          ))}
        </div>
      </section>

      {/* COMBOS */}
      <section className="bg-white border-y border-basilica-marbleDark/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
          <Eyebrow>{combosSection.eyebrow}</Eyebrow>
          <h2 className="mt-4 font-display text-3xl font-bold text-basilica-marbleBlack">
            {combosSection.title}
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {(combosSection.items || []).map((c, ci) => (
              <div key={c.title} className="rounded-2xl border border-basilica-marbleDark/15 bg-white overflow-hidden flex flex-col hover:shadow-lg transition-shadow">
                <div className="relative h-36 w-full">
                  <Image
                    src={c.image || img(["dogesPalace", "byzantineDetail", "rialto"][ci % 3], 500)}
                    alt={c.imageAlt || c.title}
                    fill
                    sizes="(min-width: 640px) 33vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-6 flex flex-1 flex-col">
                  <h3 className="font-display font-bold text-basilica-marbleBlack">{c.title}</h3>
                  <p className="mt-2 text-sm text-basilica-marbleBlack/70 flex-1">{c.description}</p>
                  <a
                    href={normalizeExternalUrl(c.url)}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    className="mt-4 inline-flex w-fit items-center rounded-full bg-basilica-marbleDark px-5 py-2 text-sm font-bold text-white hover:bg-basilica-marbleBlack transition"
                  >
                    BUY NOW
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TICKET PRICE BREAKDOWN */}
      <section id="tickets" className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <Eyebrow>{ticketPrices.eyebrow}</Eyebrow>
        <h2 className="mt-4 font-display text-3xl font-bold text-basilica-marbleBlack">
          {ticketPrices.title}
        </h2>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {ticketPrices.items.map((item, i) => (
            <div key={i} id={item.anchorId || undefined} className="rounded-2xl border border-basilica-marbleDark/15 bg-white p-6">
              <div className="flex items-start gap-4">
                <Icon name={item.icon} className="h-9 w-9 shrink-0 text-basilica-bronze" />
                <div>
                  <h3 className="font-display font-bold text-lg text-basilica-marbleBlack">{item.title}</h3>
                  <p className="mt-2 text-sm text-basilica-marbleBlack/70 leading-relaxed">
                    {renderBoldText(item.body)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* BENEFITS */}
      <section className="relative overflow-hidden bg-basilica-marbleBlack text-white">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${benefits.backgroundImage})` }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(90deg, rgba(10,90,82,0.97) 0%, rgba(10,90,82,0.85) 100%)",
          }}
          aria-hidden="true"
        />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-16">
          <Eyebrow tone="dark">{benefits.eyebrow}</Eyebrow>
          <h2 className="mt-4 font-display text-3xl font-bold">{benefits.title}</h2>
          <div className="mt-8 grid gap-8 sm:grid-cols-3">
            {benefits.items.map((item, i) => (
              <div key={i}>
                <Icon name={item.icon} className="h-9 w-9 text-basilica-copper" />
                <h3 className="mt-4 font-semibold">{item.title}</h3>
                <p className="mt-1 text-sm text-white/70">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HIGHLIGHTS */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <Eyebrow>{highlights.eyebrow}</Eyebrow>
        <h2 className="mt-4 font-display text-3xl font-bold text-basilica-marbleBlack">
          {highlights.title}
        </h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {highlights.items.map((item, i) => (
            <div key={i} className="rounded-2xl bg-white border border-basilica-marbleDark/15 p-6">
              <Icon name={item.icon} className="h-8 w-8 text-basilica-bronze" />
              <h3 className="mt-3 font-display font-bold text-basilica-marbleBlack">{item.title}</h3>
              <p className="mt-2 text-sm text-basilica-marbleBlack/70">{item.body}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-basilica-marbleBlack/50">{highlights.footnote}</p>
      </section>

      {/* BEST TIME TO VISIT + HOURS */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 grid gap-10 md:grid-cols-2">
        <div>
          <Eyebrow>{bestTime.eyebrow}</Eyebrow>
          <h2 className="mt-4 font-display text-2xl font-bold text-basilica-marbleBlack">
            {bestTime.title}
          </h2>
          <p className="mt-3 text-sm text-basilica-marbleBlack/70 leading-relaxed">{bestTime.body}</p>
        </div>
        <div id="hours">
          <h2 className="font-display text-2xl font-bold text-basilica-marbleBlack">{hours.title}</h2>
          <table className="mt-3 w-full text-sm border border-basilica-marbleDark/15 rounded-xl overflow-hidden">
            <tbody>
              <tr className="border-b border-basilica-marbleDark/15">
                <td className="px-4 py-3 font-medium bg-basilica-marbleDark/5">{hours.summerLabel}</td>
                <td className="px-4 py-3">{hours.summerHours}</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium bg-basilica-marbleDark/5">{hours.winterLabel}</td>
                <td className="px-4 py-3">{hours.winterHours}</td>
              </tr>
            </tbody>
          </table>
          <p className="mt-2 text-xs text-basilica-marbleBlack/50">{hours.note}</p>
        </div>
      </section>

      {/* LOCATION */}
      <section id="location" className="bg-white border-y border-basilica-marbleDark/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 grid gap-8 lg:grid-cols-2 lg:items-center">
          <div>
            <Eyebrow>{location.eyebrow}</Eyebrow>
            <h2 className="mt-4 font-display text-2xl font-bold text-basilica-marbleBlack">{location.title}</h2>
            <div className="mt-4 grid gap-2 text-sm text-basilica-marbleBlack/80">
              <p><strong>Address:</strong> {location.address}</p>
              <p><strong>GPS coordinates:</strong> {location.gps}</p>
              <p><strong>Nearest metro:</strong> {location.metro}</p>
            </div>
          </div>
          <div className="relative h-56 w-full rounded-2xl overflow-hidden">
            <Image
              src={location.image || img("piazza", 800)}
              alt={location.imageAlt || "Piazza San Marco in front of St Mark's Basilica"}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* NEARBY */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <Eyebrow>{nearby.eyebrow}</Eyebrow>
        <h2 className="mt-4 font-display text-2xl font-bold text-basilica-marbleBlack">{nearby.title}</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          {nearby.items.map((item, i) => (
            <div key={i} className="rounded-2xl border border-basilica-marbleDark/15 bg-white overflow-hidden flex flex-col sm:flex-row">
              <div className="relative h-40 w-full overflow-hidden sm:h-auto sm:w-40">
                <Image
                  src={item.image || img(i === 0 ? "dogesPalace" : "campanile", 500)}
                  alt={item.imageAlt || item.title}
                  fill
                  sizes="(min-width: 640px) 160px, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="font-display font-bold text-basilica-marbleBlack">{item.title}</h3>
                <p className="mt-2 text-sm text-basilica-marbleBlack/70">{item.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FROM THE BLOG */}
      {latestPosts.length > 0 && (
        <section className="bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <Eyebrow>FROM THE BLOG</Eyebrow>
                <h2 className="mt-4 font-display text-3xl font-bold text-basilica-marbleBlack">
                  St Mark's Basilica Tips &amp; Guides
                </h2>
              </div>
              <Link
                href="/blog"
                className="text-sm font-semibold text-basilica-bronze hover:text-basilica-bronzeDark"
              >
                View All Articles →
              </Link>
            </div>

            <div className="mt-8 grid gap-6 sm:grid-cols-3">
              {latestPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-basilica-marbleDark/15 bg-white hover:shadow-lg transition-shadow"
                >
                  <div className="relative h-40 w-full overflow-hidden">
                    <Image
                      src={getPostCoverImage(post)}
                      alt={post.cover_image_alt || post.title}
                      fill
                      sizes="(min-width: 640px) 33vw, 100vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <div className="text-xs text-basilica-marbleBlack/50">
                      {new Date(post.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                    <h3 className="mt-1 font-display text-base font-bold text-basilica-marbleBlack leading-snug">
                      {post.title}
                    </h3>
                    <p className="mt-2 text-sm text-basilica-marbleBlack/70 line-clamp-3">{post.excerpt}</p>
                    <span className="mt-3 text-sm font-semibold text-basilica-bronze">Read More »</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section id="faq" className="bg-white border-y border-basilica-marbleDark/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
          <Eyebrow>{faq.eyebrow}</Eyebrow>
          <h2 className="mt-4 font-display text-3xl font-bold text-basilica-marbleBlack">{faq.title}</h2>
          <div className="mt-8 max-w-3xl">
            <FAQ items={faq.items} />
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative overflow-hidden text-white">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${finalCta.backgroundImage})` }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-basilica-marbleBlack/85"
          aria-hidden="true"
        />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-16 text-center">
          <h2 className="font-display text-3xl font-bold">{finalCta.title}</h2>
          <p className="mt-3 text-white/80 max-w-xl mx-auto">{finalCta.subtitle}</p>
          <Link
            href="#tours"
            className="mt-6 inline-flex items-center rounded-full bg-basilica-bronze px-8 py-3 font-bold text-white shadow hover:bg-basilica-bronzeDark transition"
          >
            {finalCta.ctaText}
          </Link>
        </div>
      </section>

      <MobileBookBar tour={tours[0]} />
    </>
  );
}
