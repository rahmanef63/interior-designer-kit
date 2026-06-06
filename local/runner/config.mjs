import { readFileSync, existsSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";

// local/.env (BYOK for the local runner). No dependency on dotenv.
const ENV_PATH = new URL("../.env", import.meta.url);

export function loadEnv() {
  const env = { ...process.env };
  if (existsSync(ENV_PATH)) {
    const text = readFileSync(ENV_PATH, "utf8");
    for (const line of text.split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m && !line.trim().startsWith("#")) {
        env[m[1]] = m[2].replace(/^["']|["']$/g, "");
      }
    }
  }
  return env;
}

export const OUTPUT_DIR = fileURLToPath(new URL("../output/", import.meta.url));

export function ensureOutput() {
  if (!existsSync(OUTPUT_DIR)) mkdirSync(OUTPUT_DIR, { recursive: true });
}
