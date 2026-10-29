import { withRevalidate } from "@/lib/revalidate";
import { NextResponse } from "next/server";
import { sql, ensureSchema } from "@/lib/db";
import { getSession } from "@/lib/auth-server";
import { hasPageAccess } from "@/lib/admin-pages";

function slugify(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export async function GET(request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!hasPageAccess(session, "posts")) {
    return NextResponse.json({ error: "You don't have access to Blog Posts." }, { status: 403 });
  }
  await ensureSchema();
  const posts = await sql`SELECT * FROM posts ORDER BY created_at DESC`;
  return NextResponse.json({ posts });
}

async function __POST(request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!hasPageAccess(session, "posts")) {
    return NextResponse.json({ error: "You don't have access to Blog Posts." }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const title = body?.title?.trim();
  const content = body?.content?.trim();
  if (!title || !content) {
    return NextResponse.json({ error: "Title and content are required." }, { status: 400 });
  }

  let slug = body?.slug?.trim() ? slugify(body.slug) : slugify(title);
  if (!slug) slug = `post-${Date.now()}`;

  const excerpt = body?.excerpt?.trim() || content.slice(0, 160).replace(/\n/g, " ") + "…";
  const coverColor = body?.cover_color || "teal";
  const category = body?.category?.trim() || "Travel Tips";
  const featured = body?.featured ? 1 : 0;
  const seoTitle = body?.seo_title?.trim() || null;
  const metaDescription = body?.meta_description?.trim() || null;
  const coverImage = body?.cover_image?.trim() || null;
  const coverImageAlt = body?.cover_image_alt?.trim() || null;
  const published = body?.published ? 1 : 0;
  const noindex = body?.noindex ? 1 : 0;

  try {
    await ensureSchema();
    const rows = await sql`
      INSERT INTO posts (title, slug, excerpt, content, cover_color, category, featured, seo_title, meta_description, cover_image, cover_image_alt, published, noindex, updated_at)
      VALUES (${title}, ${slug}, ${excerpt}, ${content}, ${coverColor}, ${category}, ${featured}, ${seoTitle}, ${metaDescription}, ${coverImage}, ${coverImageAlt}, ${published}, ${noindex}, NOW())
      RETURNING *
    `;
    return NextResponse.json({ post: rows[0] }, { status: 201 });
  } catch (err) {
    if (err?.code === "23505" || String(err).includes("duplicate key")) {
      return NextResponse.json({ error: "A post with that slug already exists." }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to create post." }, { status: 500 });
  }
}

export const POST = withRevalidate(__POST);
