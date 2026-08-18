import { sql } from "@/lib/db";

// Simple DB-backed brute-force guard for /api/admin/login. Cloudflare
// Turnstile is the primary defense, but it's optional (skipped entirely if
// TURNSTILE_SECRET_KEY isn't set), so a fresh/default deployment would
// otherwise have zero protection against password guessing. This locks out
// a given username+IP pair after too many wrong passwords in a short
// window, independent of whether Turnstile is configured.
const WINDOW_MINUTES = 15;
const MAX_ATTEMPTS = 5;

// Returns true if this username+IP pair has hit the failed-attempt limit
// within the last WINDOW_MINUTES. Also opportunistically prunes attempts
// older than a day so the table doesn't grow unbounded without needing a
// separate cron job.
export async function isLoginRateLimited(username, ip) {
  await sql`DELETE FROM login_attempts WHERE created_at < NOW() - INTERVAL '1 day'`;

  // Computed in JS and passed as a plain timestamp parameter rather than
  // interpolated into a Postgres INTERVAL expression — simpler than getting
  // numeric-to-interval casting right, and just as accurate.
  const cutoff = new Date(Date.now() - WINDOW_MINUTES * 60 * 1000);
  const rows = await sql`
    SELECT COUNT(*) AS c FROM login_attempts
    WHERE username = ${username} AND ip = ${ip} AND created_at > ${cutoff}
  `;
  return Number(rows[0]?.c || 0) >= MAX_ATTEMPTS;
}

export async function recordFailedLogin(username, ip) {
  await sql`INSERT INTO login_attempts (username, ip) VALUES (${username}, ${ip})`;
}

export async function clearLoginAttempts(username, ip) {
  await sql`DELETE FROM login_attempts WHERE username = ${username} AND ip = ${ip}`;
}
