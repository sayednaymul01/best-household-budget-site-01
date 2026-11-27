// main.ts — hand in the Ghorer Hisab household budget site.
// Copies app/ and screenshots/ from this repository into the output
// directory and writes /output/dossier.json with the kit's buildDossier.
// Node 22, standard library only. No network, no installs.
import { cpSync, existsSync, mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildDossier } from "./vendor/makefun-frontend.ts";

// The grader writes to /output; outside it MAKEFUN_OUTPUT_DIR stands in.
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR || "/output";

// Caps from the competition's gate: 4 screenshots at most 256 KiB each,
// app/ at most 993 entries and 16 MiB, dossier text at most 160 KiB.
const DOSSIER_CAPS = {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 16777216,
};

const REPO_ROOT = dirname(fileURLToPath(import.meta.url));

function copyTree(name: string): void {
  const from = join(REPO_ROOT, name);
  const to = join(OUTPUT_DIR, name);
  // Copy in a fixed order so repeated runs write identical bytes.
  const entries = readdirSync(from, { withFileTypes: true })
    .sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
  mkdirSync(to, { recursive: true });
  for (const entry of entries) {
    cpSync(join(from, entry.name), join(to, entry.name), { recursive: true });
  }
}

function main(): void {
  mkdirSync(OUTPUT_DIR, { recursive: true });
  copyTree("app");
  copyTree("screenshots");
  if (!existsSync(join(OUTPUT_DIR, "app", "index.html"))) {
    throw new Error("main.ts: app/index.html missing after copy — refusing to build a dossier");
  }
  // buildDossier reads only the files just copied, so the dossier always
  // describes exactly what this run handed in.
  const dossier = buildDossier(OUTPUT_DIR, DOSSIER_CAPS);
  writeFileSync(join(OUTPUT_DIR, "dossier.json"), dossier);
}

main();
