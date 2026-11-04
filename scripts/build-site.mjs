#!/usr/bin/env node
// Builds what GitHub Pages publishes into _site/ (the workflow .github/workflows/pages.yml runs it): every page and asset
// as it is, without what belongs to the repository and not the site — the build itself, the licence text and the
// editors' settings (EXCLUDE). Usage: node scripts/build-site.mjs [outDir]
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const OUT = path.resolve(process.argv[2] || path.join(ROOT, '_site'));
const EXCLUDE = new Set(['.git', '.github', '.claude', '.hintrc', 'scripts', '_site', 'node_modules', 'LICENSE.md', 'README.md']);

function copy(rel = '') {
  for (const e of fs.readdirSync(path.join(ROOT, rel), { withFileTypes: true })) {
    const r = rel ? `${rel}/${e.name}` : e.name;
    if (EXCLUDE.has(r)) continue;
    if (e.isDirectory()) { fs.mkdirSync(path.join(OUT, r), { recursive: true }); copy(r); }
    else fs.copyFileSync(path.join(ROOT, r), path.join(OUT, r));
  }
}

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });
copy();
console.log(`build: ${OUT} ready`);
