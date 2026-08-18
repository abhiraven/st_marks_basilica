import { cookies } from "next/headers";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth";
import { sql, ensureSchema } from "@/lib/db";

// Read the session cookie in a Server Component / Route Handler and
// return the decoded session, or null if missing/invalid/expired.
// Looks up the current role/id/email from the database on every call
// (rather than trusting the signed cookie) so that a role change or an
// account deletion takes effect immediately instead of waiting out the
// session's lifetime.
export async function getSession() {
  const token = cookies().get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  const decoded = verifySessionToken(token);
  if (!decoded) return null;

  await ensureSchema();
  const rows = await sql`
    SELECT id, username, email, role, permissions FROM admin_users WHERE username = ${decoded.username}
  `;
  const user = rows[0];
  if (!user) return null;

  let permissions = [];
  try {
    permissions = user.permissions ? JSON.parse(user.permissions) : [];
    if (!Array.isArray(permissions)) permissions = [];
  } catch {
    permissions = [];
  }

  return {
    username: user.username,
    id: user.id,
    email: user.email,
    role: user.role || "editor",
    permissions,
  };
}
