import { NextResponse } from "next/server";
import { list } from "@vercel/blob";
import { getSession } from "@/lib/auth-server";
import { hasPageAccess } from "@/lib/admin-pages";

const ALLOWED_FOLDERS = ["posts", "tours", "site", "about", "contact", "site-chrome"];
// Same mapping used by the upload route — which admin page a given upload
// folder belongs to, for permission checks.
const FOLDER_PAGE = {
  posts: "posts",
  tours: "home",
  site: "home",
  about: "about",
  contact: "contact",
  "site-chrome": "site-chrome",
};

const PAGE_SIZE = 40;

// Lists previously-uploaded images so they can be reused instead of
// re-uploading the same file. Reads directly from Vercel Blob (the actual
// storage backend for every upload — see /api/admin/upload) rather than a
// separate database table, so this can never drift out of sync with what's
// really there.
export async function GET(request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { error: "Image storage isn't set up yet. See .env.example." },
      { status: 500 }
    );
  }

  const { searchParams } = new URL(request.url);
  const requestedFolder = searchParams.get("folder");
  const folder = ALLOWED_FOLDERS.includes(requestedFolder) ? requestedFolder : null;
  const cursor = searchParams.get("cursor") || undefined;

  if (folder && !hasPageAccess(session, FOLDER_PAGE[folder])) {
    return NextResponse.json({ error: "You don't have access to this media." }, { status: 403 });
  }

  try {
    const result = await list({
      prefix: folder ? `${folder}/` : undefined,
      limit: PAGE_SIZE,
      cursor,
    });

    const media = result.blobs
      .slice()
      .sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt))
      .map((b) => ({
        url: b.url,
        pathname: b.pathname,
        uploadedAt: b.uploadedAt,
        size: b.size,
      }));

    return NextResponse.json({
      media,
      cursor: result.cursor,
      hasMore: result.hasMore,
    });
  } catch {
    return NextResponse.json({ error: "Failed to load the media library." }, { status: 500 });
  }
}
