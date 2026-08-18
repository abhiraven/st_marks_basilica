import { getPageContent, savePageContent } from "@/lib/content-store";
import { DEFAULT_SITE_CHROME_CONTENT } from "@/lib/site-chrome-defaults";

// Server-only: reads/writes the admin-editable navbar/footer content (key
// "site-chrome" in the shared site_content table). DEFAULT_SITE_CHROME_CONTENT
// itself lives in ./site-chrome-defaults.js, not here — that file has zero
// imports so it's safe for client components to pull in, whereas this file
// imports lib/content-store.js -> lib/db.js, which opens a real DB
// connection and must never end up in a client bundle. Re-exported here so
// server code (app/layout.js, the admin page, the API route) can still get
// the defaults from the same place as get/save if it wants them.
export { DEFAULT_SITE_CHROME_CONTENT };

export async function getSiteChromeContent() {
  return getPageContent("site-chrome", DEFAULT_SITE_CHROME_CONTENT);
}

export async function saveSiteChromeContent(content) {
  return savePageContent("site-chrome", content);
}
