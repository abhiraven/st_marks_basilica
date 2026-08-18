// Preload file — pass this to `node --import` before running a script that
// needs to resolve "@/" imports (see scripts/alias-resolver.mjs for why).
import { register } from "node:module";

register("./alias-resolver.mjs", import.meta.url);
