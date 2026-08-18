"use client";

import Link from "next/link";
import { getPostCoverImage } from "@/lib/images";

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function BlogExplorer({ posts }) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-bold text-basilica-marbleBlack">All Articles</h2>
        <span className="text-xs text-basilica-marbleBlack/50">
          {posts.length} {posts.length === 1 ? "article" : "articles"}
        </span>
      </div>

      {posts.length === 0 ? (
        <p className="mt-6 rounded-2xl border border-dashed border-basilica-marbleDark/25 p-8 text-center text-sm text-basilica-marbleBlack/60">
          No articles published yet.
        </p>
      ) : (
        <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-[repeat(auto-fit,minmax(260px,1fr))]">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-basilica-marbleDark/15 bg-white hover:shadow-lg transition-shadow"
            >
              <div className="relative h-40 w-full overflow-hidden">
                <img
                  src={getPostCoverImage(post)}
                  alt={post.cover_image_alt || post.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold text-basilica-marbleBlack">
                  {post.category || "Travel Tips"}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <div className="text-xs text-basilica-marbleBlack/50">{formatDate(post.created_at)}</div>
                <h3 className="mt-1 font-display text-base font-bold text-basilica-marbleBlack leading-snug">
                  {post.title}
                </h3>
                <p className="mt-2 text-sm text-basilica-marbleBlack/70 line-clamp-3">{post.excerpt}</p>
                <span className="mt-3 text-sm font-semibold text-basilica-bronze">Read More »</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
