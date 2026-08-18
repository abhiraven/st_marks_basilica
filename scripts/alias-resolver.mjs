// Node ESM loader hook that teaches plain `node` how to resolve the "@/"
// import alias used throughout the app (configured for Next.js via
// jsconfig.json, which only Next's own bundler understands — not Node).
//
// This lets standalone scripts (like push-content-update.js) `import()`
// app modules such as lib/home-content.js without Next.js in the loop,
// while keeping "@/lib/..." imports in the actual source files untouched.
//
// Registered via scripts/register-aliases.mjs — see that file for usage.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const projectRoot = path.resolve(fileURLToPath(new URL(".", import.meta.url)), "..");

function resolveAliasPath(specifier) {
  let target = path.join(projectRoot, specifier.slice(2));
  if (fs.existsSync(target) && fs.statSync(target).isFile()) return target;
  if (fs.existsSync(`${target}.js`)) return `${target}.js`;
  if (fs.existsSync(path.join(target, "index.js"))) return path.join(target, "index.js");
  return target; // let Node's own resolver produce the real error if nothing matched
}

export async function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith("@/")) {
    const target = resolveAliasPath(specifier);
    return nextResolve(pathToFileURL(target).href, context);
  }
  return nextResolve(specifier, context);
}
