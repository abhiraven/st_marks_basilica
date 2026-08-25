import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { sql, ensureSchema } from "@/lib/db";
import { getPostCoverImage } from "@/lib/images";
import { contentToHtml } from "@/lib/post-content";

export const dynamic = "force-dynamic";

async function getPost(slug) {
  try {
    await ensureSchema();
    const rows = await sql`SELECT * FROM posts WHERE slug = ${slug} AND published = 1`;
    return rows[0] || null;
  } catch {
    return null;
  }
}

async function getRelatedPosts(slug) {
  try {
    await ensureSchema();
    // Shows every other published post — was capped at 3, now the sidebar
    // lists all of them.
    return await sql`
      SELECT title, slug, excerpt, cover_color, cover_image, cover_image_alt, created_at
      FROM posts WHERE published = 1 AND slug != ${slug}
      ORDER BY created_at DESC
    `;
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }) {
  const post = await getPost(params.slug);
  if (!post) return { title: "Post not found" };
  const title = post.seo_title?.trim() || `${post.title} | St Mark's Basilica Entry Blog`;
  const description = post.meta_description?.trim() || post.excerpt;
  return {
    title,
    description,
    openGraph: { title, description },
    alternates: { canonical: `/blog/${post.slug}` },
    robots: post.noindex ? { index: false, follow: false } : { index: true, follow: true },
  };
}

export default async function BlogPostPage({ params }) {
  const post = await getPost(params.slug);
  if (!post) notFound();

  const relatedPosts = await getRelatedPosts(params.slug);

  return (
    <div className="bg-white">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
      <Link href="/blog" className="text-sm font-semibold text-basilica-bronze hover:text-basilica-bronzeDark">
        ← Back to Blog
      </Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-[1fr_320px] lg:items-start">
        <article className="max-w-3xl">
          <div className="relative h-48 w-full overflow-hidden rounded-2xl">
            <Image
              src={getPostCoverImage(post)}
              alt={post.cover_image_alt || post.title}
              fill
              sizes="(min-width: 1024px) 700px, 100vw"
              className="object-cover"
            />
          </div>

          <h1 className="mt-6 font-display text-3xl sm:text-4xl font-bold text-basilica-marbleBlack">
            {post.title}
          </h1>
          <div className="mt-2 text-sm text-basilica-marbleBlack/50">
            {new Date(post.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>

          <div
            className="prose-content mt-8 text-basilica-marbleBlack/90"
            dangerouslySetInnerHTML={{ __html: contentToHtml(post.content) }}
          />

          <div className="mt-12 rounded-2xl bg-basilica-marbleBlack text-white p-8 text-center">
            <h2 className="font-display text-xl font-bold">Got what you needed? Lock in your ticket.</h2>
            <Link
              href="/#tours"
              className="mt-4 inline-flex items-center rounded-full bg-basilica-bronze px-6 py-3 font-bold text-white shadow hover:bg-basilica-bronzeDark transition"
            >
              Book St Mark's Basilica Tour Now →
            </Link>
          </div>
        </article>

        {relatedPosts.length > 0 && (
          <aside className="lg:sticky lg:top-24">
            <h2 className="font-display text-lg font-bold text-basilica-marbleBlack">Related Articles</h2>
            <div className="mt-4 flex flex-col gap-4">
              {relatedPosts.map((related) => (
                <Link
                  key={related.slug}
                  href={`/blog/${related.slug}`}
                  className="flex gap-3 rounded-2xl border border-basilica-marbleDark/15 bg-white p-3 hover:shadow-lg transition-shadow"
                >
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl">
                    <Image
                      src={getPostCoverImage(related)}
                      alt={related.cover_image_alt || related.title}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-display text-sm font-bold text-basilica-marbleBlack leading-snug">
                      {related.title}
                    </h3>
                    <div className="mt-1 text-xs text-basilica-marbleBlack/50">
                      {new Date(related.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </aside>
        )}
      </div>
    </div>
    </div>
  );
}
