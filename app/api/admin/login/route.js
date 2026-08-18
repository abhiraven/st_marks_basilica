import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { sql, ensureSchema } from "@/lib/db";
import { createSessionToken, SESSION_COOKIE_NAME, SESSION_MAX_AGE } from "@/lib/auth";
import { isLoginRateLimited, recordFailedLogin, clearLoginAttempts } from "@/lib/login-rate-limit";

// Verifies a Cloudflare Turnstile token server-side. Never trust a captcha
// "pass" reported by the client alone — the token has to be re-checked
// against Cloudflare's API using the secret key, which stays server-only.
// If TURNSTILE_SECRET_KEY isn't configured, verification is skipped so
// login still works in environments that haven't set up Turnstile yet.
async function verifyTurnstile(token, remoteIp) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  if (!token) return false;

  try {
    const params = new URLSearchParams({ secret, response: token });
    if (remoteIp) params.set("remoteip", remoteIp);

    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params,
    });
    const data = await res.json().catch(() => null);
    return Boolean(data?.success);
  } catch {
    return false;
  }
}

export async function POST(request) {
  const body = await request.json().catch(() => null);
  // Stored usernames/emails are lowercased at creation time (see
  // /api/admin/users POST), so normalize here too or a differently-cased
  // login attempt (e.g. "Name@Gmail.com") would incorrectly fail.
  const username = body?.username?.trim().toLowerCase();
  const password = body?.password;
  const captchaToken = body?.captchaToken;

  if (!username || !password) {
    return NextResponse.json({ error: "Username and password are required." }, { status: 400 });
  }

  const remoteIp = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

  await ensureSchema();

  if (await isLoginRateLimited(username, remoteIp)) {
    return NextResponse.json(
      { error: "Too many failed attempts. Please wait a while before trying again." },
      { status: 429 }
    );
  }

  const captchaOk = await verifyTurnstile(captchaToken, remoteIp);
  if (!captchaOk) {
    await recordFailedLogin(username, remoteIp);
    return NextResponse.json(
      { error: "Verification failed. Please complete the challenge and try again." },
      { status: 400 }
    );
  }

  const rows = await sql`SELECT * FROM admin_users WHERE username = ${username}`;
  const user = rows[0];
  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    await recordFailedLogin(username, remoteIp);
    return NextResponse.json({ error: "Invalid username or password." }, { status: 401 });
  }

  await clearLoginAttempts(username, remoteIp);

  const token = createSessionToken(username);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
  return res;
}
