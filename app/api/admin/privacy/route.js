import { withRevalidate } from "@/lib/revalidate";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth-server";
import { hasPageAccess } from "@/lib/admin-pages";
import { savePrivacyContent } from "@/lib/privacy-content";

async function __PUT(request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!hasPageAccess(session, "privacy")) {
    return NextResponse.json({ error: "You don't have access to the Privacy Policy page." }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid content." }, { status: 400 });
  }

  try {
    await savePrivacyContent(body);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to save Privacy Policy content." }, { status: 500 });
  }
}

export const PUT = withRevalidate(__PUT);
