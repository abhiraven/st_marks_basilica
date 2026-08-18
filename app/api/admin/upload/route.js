import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { getSession } from "@/lib/auth-server";
import { hasPageAccess } from "@/lib/admin-pages";

const ALLOWED_TYPES = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};
const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FOLDERS = ["posts", "tours", "site", "about", "contact", "site-chrome"];
// Which admin page a given upload folder belongs to, for permission checks.
const FOLDER_PAGE = {
  posts: "posts",
  tours: "home",
  site: "home",
  about: "about",
  contact: "contact",
  "site-chrome": "site-chrome",
};

// The browser-supplied Content-Type on a FormData file is just a label the
// client attached — it doesn't guarantee the bytes are actually that
// format. Checking the file's real magic-number signature catches a file
// renamed/relabeled to slip past the Content-Type allowlist before it gets
// a real, publicly-servable URL from Vercel Blob.
const MAGIC_BYTES = {
  jpg: [[0xff, 0xd8, 0xff]],
  png: [[0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]],
  gif: [
    [0x47, 0x49, 0x46, 0x38, 0x37, 0x61],
    [0x47, 0x49, 0x46, 0x38, 0x39, 0x61],
  ],
  // WEBP is a RIFF container: bytes 0-3 "RIFF", bytes 8-11 "WEBP".
  webp: [[0x52, 0x49, 0x46, 0x46]],
};

async function matchesFileSignature(file, ext) {
  const signatures = MAGIC_BYTES[ext];
  if (!signatures) return false;

  const head = new Uint8Array(await file.slice(0, 12).arrayBuffer());

  if (ext === "webp") {
    const riff = signatures[0].every((b, i) => head[i] === b);
    const webp = [0x57, 0x45, 0x42, 0x50].every((b, i) => head[8 + i] === b);
    return riff && webp;
  }

  return signatures.some((sig) => sig.every((b, i) => head[i] === b));
}

export async function POST(request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let formData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid upload." }, { status: 400 });
  }

  const file = formData.get("file");
  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }

  const ext = ALLOWED_TYPES[file.type];
  if (!ext) {
    return NextResponse.json(
      { error: "Unsupported file type. Please upload a JPG, PNG, WEBP, or GIF." },
      { status: 400 }
    );
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "File is too large. Max size is 5MB." }, { status: 400 });
  }

  if (!(await matchesFileSignature(file, ext))) {
    return NextResponse.json(
      { error: "This file's contents don't match its extension. Please upload a real JPG, PNG, WEBP, or GIF." },
      { status: 400 }
    );
  }

  const requestedFolder = formData.get("type");
  const folder = ALLOWED_FOLDERS.includes(requestedFolder) ? requestedFolder : "posts";

  if (!hasPageAccess(session, FOLDER_PAGE[folder])) {
    return NextResponse.json({ error: "You don't have access to upload here." }, { status: 403 });
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      {
        error:
          "Image storage isn't set up yet. Add a Vercel Blob store to this project and set BLOB_READ_WRITE_TOKEN — see .env.example.",
      },
      { status: 500 }
    );
  }

  try {
    // Vercel's serverless functions run on a read-only filesystem, so
    // uploads can't be written to disk (public/uploads/...) like a
    // traditional server. Vercel Blob gives every uploaded file a real,
    // persistent, publicly-servable URL instead.
    const filename = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const blob = await put(filename, file, {
      access: "public",
      contentType: file.type,
    });

    return NextResponse.json({ url: blob.url });
  } catch {
    return NextResponse.json({ error: "Failed to save the uploaded file." }, { status: 500 });
  }
}
