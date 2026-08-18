import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth-server";
import { hasPageAccess } from "@/lib/admin-pages";
import { saveHomeContent } from "@/lib/home-content";

export async function PUT(request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!hasPageAccess(session, "home")) {
    return NextResponse.json({ error: "You don't have access to the Home Page." }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid content." }, { status: 400 });
  }

  try {
    await saveHomeContent(body);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[PUT /api/admin/home] save failed:", err);
    return NextResponse.json({ error: "Failed to save home content." }, { status: 500 });
  }
}
