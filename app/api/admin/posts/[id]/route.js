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

export async function GET(request, { params }) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!hasPageAccess(session, "posts")) {
    return NextResponse.json({ error: "You don't have access to Blog Posts." }, { status: 403 });
  }
  const postId = Number(params.id);
  if (!Number.isFinite(postId)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  await ensureSchema();
  const rows = await sql`SELECT * FROM posts WHERE id = ${postId}`;
  if (!rows[0]) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ post: rows[0] });
}

export async function PUT(request, { params }) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!hasPageAccess(session, "posts")) {
    return NextResponse.json({ error: "You don't have access to Blog Posts." }, { status: 403 });
  }
  const postId = Number(params.id);
  if (!Number.isFinite(postId)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  await ensureSchema();
  const existingRows = await sql`SELECT * FROM posts WHERE id = ${postId}`;
  const existing = existingRows[0];
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await request.json().catch(() => null);
  const title = body?.title?.trim() || existing.title;
  const content = body?.content?.trim() || existing.content;
  const slug = body?.slug?.trim() ? slugify(body.slug) : existing.slug;
  const excerpt = body?.excerpt?.trim() || existing.excerpt;
  const coverColor = body?.cover_color || existing.cover_color;
  const category = body?.category?.trim() || existing.category || "Travel Tips";
  const featured = body?.featured === undefined ? existing.featured : body.featured ? 1 : 0;
  const seoTitle = body?.seo_title !== undefined ? body.seo_title.trim() || null : existing.seo_title || null;
  const metaDescription =
    body?.meta_description !== undefined ? body.meta_description.trim() || null : existing.meta_description || null;
  const coverImage = body?.cover_image !== undefined ? body.cover_image.trim() || null : existing.cover_image || null;
  const coverImageAlt =
    body?.cover_image_alt !== undefined ? body.cover_image_alt.trim() || null : existing.cover_image_alt || null;
  const published = body?.published === undefined ? existing.published : body.published ? 1 : 0;
  const noindex = body?.noindex === undefined ? existing.noindex : body.noindex ? 1 : 0;

  try {
    const rows = await sql`
      UPDATE posts SET
        title = ${title}, slug = ${slug}, excerpt = ${excerpt}, content = ${content},
        cover_color = ${coverColor}, category = ${category}, featured = ${featured},
        seo_title = ${seoTitle}, meta_description = ${metaDescription}, cover_image = ${coverImage},
        cover_image_alt = ${coverImageAlt},
        published = ${published}, noindex = ${noindex}, updated_at = NOW()
      WHERE id = ${postId}
      RETURNING *
    `;
    return NextResponse.json({ post: rows[0] });
  } catch (err) {
    if (err?.code === "23505" || String(err).includes("duplicate key")) {
      return NextResponse.json({ error: "A post with that slug already exists." }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to update post." }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.role !== "admin") {
    return NextResponse.json({ error: "Only admins can delete posts." }, { status: 403 });
  }
  const postId = Number(params.id);
  if (!Number.isFinite(postId)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  await ensureSchema();
  await sql`DELETE FROM posts WHERE id = ${postId}`;
  return NextResponse.json({ ok: true });
}
