import { sql, ensureSchema } from "@/lib/db";

// Shared read/write helpers for anything stored in the `site_content`
// table (one JSON blob per key). lib/home-content.js predates this file and
// still has its own copy of the same logic — left alone since it already
// works — but every page added after it (About, Contact, ...) should go
// through here instead of re-implementing get/save/deepMerge again.

export function deepMerge(defaults, overrides) {
  if (Array.isArray(defaults)) {
    return Array.isArray(overrides) ? overrides : defaults;
  }
  if (defaults && typeof defaults === "object") {
    if (!overrides || typeof overrides !== "object") return defaults;
    const result = { ...defaults };
    for (const key of Object.keys(defaults)) {
      result[key] = deepMerge(defaults[key], overrides[key]);
    }
    return result;
  }
  return overrides === undefined || overrides === null ? defaults : overrides;
}

export async function getPageContent(key, defaults) {
  try {
    await ensureSchema();
    const rows = await sql`SELECT value FROM site_content WHERE key = ${key}`;
    if (!rows[0]) return defaults;
    const parsed = JSON.parse(rows[0].value);
    return deepMerge(defaults, parsed);
  } catch (err) {
    // Previously silent — a failed read would fall back to defaults with no
    // trace anywhere, indistinguishable from "the save didn't work." Log it.
    console.error(`[getPageContent:${key}] falling back to defaults due to:`, err);
    return defaults;
  }
}

export async function savePageContent(key, content) {
  await ensureSchema();
  const value = JSON.stringify(content);
  await sql`
    INSERT INTO site_content (key, value, updated_at) VALUES (${key}, ${value}, NOW())
    ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()
  `;
}
