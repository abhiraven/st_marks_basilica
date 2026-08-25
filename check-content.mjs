import { neon } from "@neondatabase/serverless";
import fs from "fs";

const envContent = fs.readFileSync(".env.local", "utf-8");
const match = envContent.match(/^DATABASE_URL=(.*)$/m);
const connectionString = match[1].trim();

const sql = neon(connectionString);
const rows = await sql`SELECT value FROM site_content WHERE key = 'home'`;
if (!rows[0]) {
  console.log("NO SAVED CONTENT IN DB - site is using DEFAULT_HOME_CONTENT from lib/home-content.js");
} else {
  const parsed = JSON.parse(rows[0].value);
  console.log("DB HAS SAVED CONTENT. Scanning for icon fields...");
  function walk(obj, path) {
    if (Array.isArray(obj)) {
      obj.forEach((item, i) => walk(item, `${path}[${i}]`));
    } else if (obj && typeof obj === "object") {
      for (const key of Object.keys(obj)) {
        if (key === "icon") {
          console.log(`${path}.icon = ${JSON.stringify(obj[key])}`);
        } else {
          walk(obj[key], `${path}.${key}`);
        }
      }
    }
  }
  walk(parsed, "home");
}
