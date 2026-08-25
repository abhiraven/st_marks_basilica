import Link from "next/link";
import Image from "next/image";
import { sql, ensureSchema } from "@/lib/db";
import { getPostCoverImage } from "@/lib/images";
import Eyebrow from "@/components/Eyebrow";
import Icon from "@/components/Icon";
import BlogExplorer from "@/components/blog/BlogExplorer";
import Newsletter from "@/components/blog/Newsletter";
import { getHomeContent } from "@/lib/home-content";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "St Mark's Basilica Blog | Ticket Price, Guided Tours & Visitor Guides",
  description:
    "The current St Mark's Basilica ticket price, whether a St Mark's Basilica guided tour is worth booking, when to go to skip the crowds, and whether the Pala d'Oro is worth the extra stop — written by people who've actually gone.",
  alternates: { canonical: "/blog" },
};

async function getPosts() {
  try {
    await ensureSchema();
    return await sql`
      SELECT title, slug, excerpt, cover_color, cover_image, cover_image_alt, category, featured, created_at
      FROM posts WHERE published = 1 ORDER BY created_at DESC
    `;
  } catch {
    return [];
  }
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function BlogIndexPage() {
  const posts = await getPosts();
  const featuredPost = posts.find((p) => p.featured) || posts[0] || null;
  const trendingPosts = posts.filter((p) => p.slug !== featuredPost?.slug).slice(0, 3);
  const categories = Array.from(new Set(posts.map((p) => p.category || "Travel Tips")));
  const { tours } = await getHomeContent();

  return (
    <div className="bg-white">
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10 lg:py-12">
      <Eyebrow>BLOG</Eyebrow>
      <h1 className="mt-3 font-display text-4xl font-bold text-basilica-marbleBlack">St Mark's Basilica Blog</h1>
      <p className="mt-2 text-basilica-marbleBlack/70 max-w-2xl">
        Straight answers on St Mark's Basilica ticket price, whether a guided tour or Pala d'Oro
        access is worth adding, and what's actually worth booking — no fluff.
      </p>

      <div className="mt-4 flex flex-wrap gap-x-8 gap-y-2 text-sm text-basilica-marbleBlack/60">
        <span><strong className="text-basilica-marbleBlack">{posts.length}</strong> visitor guides</span>
        <span><strong className="text-basilica-marbleBlack">{categories.length}</strong> categories</span>
        <span>Fact-checked and updated for <strong className="text-basilica-marbleBlack">2026</strong></span>
      </div>

      <div className="mt-6 grid gap-6 lg:gap-8 lg:grid-cols-[1fr_320px] lg:items-start">
        {posts.length === 0 ? (
          <p className="text-basilica-marbleBlack/60">No posts published yet.</p>
        ) : (
          <div className="flex flex-col gap-8 sm:gap-10">
            {featuredPost && (
              <Link
                href={`/blog/${featuredPost.slug}`}
                className="group grid overflow-hidden rounded-3xl border border-basilica-marbleDark/15 bg-white hover:shadow-xl transition-shadow sm:grid-cols-2"
              >
                <div className="relative h-40 sm:h-full overflow-hidden">
                  <Image
                    src={getPostCoverImage(featuredPost)}
                    alt={featuredPost.cover_image_alt || featuredPost.title}
                    fill
                    sizes="(min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <span className="absolute left-4 top-4 inline-flex items-center gap-1 rounded-full bg-basilica-bronze px-3 py-1 text-xs font-bold text-white shadow">
                    <Icon name="star" filled className="h-3 w-3" /> Featured
                  </span>
                </div>
                <div className="flex flex-col justify-center p-5 sm:p-6">
                  <span className="text-xs font-semibold uppercase tracking-wide text-basilica-bronze">
                    {featuredPost.category || "Travel Tips"}
                  </span>
                  <h2 className="mt-1.5 font-display text-2xl sm:text-3xl font-bold text-basilica-marbleBlack leading-snug">
                    {featuredPost.title}
                  </h2>
                  <p className="mt-2 text-sm sm:text-base text-basilica-marbleBlack/70 leading-relaxed line-clamp-2">
                    {featuredPost.excerpt}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-basilica-marbleBlack/50">
                    <span className="inline-flex items-center gap-1.5">
                      <span className="h-6 w-6 rounded-full bg-basilica-marbleDark/15 flex items-center justify-center text-[11px] font-bold text-basilica-marbleBlack">
                        SM
                      </span>
                      St Mark's Basilica Entry Team
                    </span>
                    <span>·</span>
                    <span>{formatDate(featuredPost.created_at)}</span>
                    <span>·</span>
                    <span>5 min read</span>
                  </div>
                  <span className="mt-3 inline-flex items-center text-sm font-semibold text-basilica-bronze">
                    Read Featured Article →
                  </span>
                </div>
              </Link>
            )}

            {trendingPosts.length > 0 && (
              <div>
                <h2 className="flex items-center gap-2 font-display text-lg font-bold text-basilica-marbleBlack">
                  <Icon name="flame" filled className="h-5 w-5 text-basilica-bronze" /> Trending Now
                </h2>
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-[repeat(auto-fit,minmax(180px,1fr))]">
                  {trendingPosts.map((post, i) => (
                    <Link
                      key={post.slug}
                      href={`/blog/${post.slug}`}
                      className="group flex items-center gap-3 rounded-2xl border border-basilica-marbleDark/15 bg-white p-3 hover:shadow-lg transition-shadow sm:flex-col sm:items-stretch"
                    >
                      <span className="font-display text-2xl font-bold text-basilica-marbleDark/30 shrink-0 sm:hidden">
                        0{i + 1}
                      </span>
                      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl sm:h-24 sm:w-full">
                        <Image
                          src={getPostCoverImage(post)}
                          alt={post.cover_image_alt || post.title}
                          fill
                          sizes="(min-width: 640px) 180px, 56px"
                          className="object-cover"
                        />
                        <span className="hidden sm:flex absolute -top-3 -left-2 h-8 w-8 items-center justify-center rounded-full bg-basilica-marbleBlack font-display text-sm font-bold text-white shadow">
                          {i + 1}
                        </span>
                      </div>
                      <h3 className="font-display text-sm font-bold text-basilica-marbleBlack leading-snug sm:mt-3">
                        {post.title}
                      </h3>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div>
              <BlogExplorer posts={posts} />
            </div>

            <div className="rounded-3xl bg-basilica-marbleBlack p-8 sm:p-10 text-white">
              <h2 className="font-display text-2xl font-bold">Still deciding which St Mark's Basilica tour to book?</h2>
              <p className="mt-2 text-white/70 max-w-xl">
                Skip-the-line entry, a St Mark's Basilica guided tour, or the Doge's Palace combo — see what each one actually includes before you pay.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                {tours.map((tour, i) => (
                  <div key={tour.id || i} className="rounded-xl bg-white/10 px-4 py-3">
                    <div className="text-xs text-white/70 max-w-[10rem]">{tour.title}</div>
                    <div className="font-display text-lg font-bold">{tour.price}</div>
                  </div>
                ))}
              </div>
              <Link
                href="/#tours"
                className="mt-6 inline-flex items-center rounded-full bg-basilica-bronze px-6 py-3 font-bold text-white shadow hover:bg-basilica-bronzeDark transition"
              >
                Compare All Tours →
              </Link>
            </div>
          </div>
        )}

        <aside className="lg:sticky lg:top-24 flex flex-col gap-6">
          <div className="rounded-2xl border border-basilica-marbleDark/15 bg-white p-6">
            <h2 className="font-display text-lg font-bold text-basilica-marbleBlack">Quick Visitor Info</h2>
            <ul className="mt-4 flex flex-col gap-3 text-sm text-basilica-marbleBlack/70">
              <li>
                <strong className="text-basilica-marbleBlack">From €19</strong> skip-the-line entry
              </li>
              <li>
                <strong className="text-basilica-marbleBlack">9:30am – 5:15pm</strong> Mon–Sat
              </li>
              <li>
                <strong className="text-basilica-marbleBlack">Piazza San Marco</strong> · Venice
              </li>
            </ul>
            <Link href="/#tickets" className="mt-4 inline-block text-sm font-semibold text-basilica-bronze hover:text-basilica-bronzeDark">
              See full ticket prices »
            </Link>
          </div>

          {posts.length > 0 && (
            <div className="rounded-2xl border border-basilica-marbleDark/15 bg-white p-6">
              <h2 className="font-display text-lg font-bold text-basilica-marbleBlack">Popular Guides</h2>
              <ol className="mt-4 flex flex-col gap-3 text-sm">
                {posts.slice(0, 5).map((post, i) => (
                  <li key={post.slug}>
                    <Link href={`/blog/${post.slug}`} className="flex gap-3 text-basilica-marbleBlack/70 hover:text-basilica-bronze">
                      <span className="font-display font-bold text-basilica-marbleDark/40">0{i + 1}</span>
                      <span>{post.title}</span>
                    </Link>
                  </li>
                ))}
              </ol>
            </div>
          )}

          <Newsletter />

          <div className="rounded-2xl bg-basilica-marbleBlack text-white p-6 text-center">
            <h2 className="font-display text-lg font-bold">Ready to go?</h2>
            <p className="mt-2 text-sm text-white/70">
              Booking takes a few minutes — skip-the-line entry or a guided tour, your call.
            </p>
            <Link
              href="/#tours"
              className="mt-4 inline-flex items-center rounded-full bg-basilica-bronze px-5 py-2.5 text-sm font-bold text-white shadow hover:bg-basilica-bronzeDark transition"
            >
              Book St Mark's Basilica Tour →
            </Link>
          </div>
        </aside>
      </div>
    </section>
    </div>
  );
}
