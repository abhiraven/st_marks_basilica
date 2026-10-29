import { revalidatePath } from "next/cache";

// Wraps an admin write handler (POST/PUT/PATCH/DELETE) so that, after a
// successful response, the whole site's cached pages and cached DB reads are
// purged. Public pages are cached (ISR) to keep the Neon database asleep
// between edits; this is what makes admin edits still show up instantly.
export function withRevalidate(handler) {
  return async (...args) => {
    const res = await handler(...args);
    if (res && res.status < 400) {
      try {
        revalidatePath("/", "layout");
      } catch (err) {
        console.error("[revalidate] revalidatePath failed:", err);
      }
    }
    return res;
  };
}
