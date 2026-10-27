#!/usr/bin/env node
'use strict';
// Copies the files the site publishes into dist/, which Cloudflare serves (wrangler.jsonc → assets.directory).
// The site itself needs no build; this only keeps the repository's own files (git and editor folders,
// deploy notes, the GitHub Pages CNAME, sources no page loads) off the web. No dependencies: `node build.js`.
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const DIST = path.join(ROOT, 'dist');

// Never published. Names starting with a dot (.git, .claude, .wrangler, .nojekyll, .hintrc, .gitignore) are
// skipped everywhere; these are skipped too, wherever they are.
const SKIP_NAMES = new Set(['dist', 'node_modules', 'build.js', 'wrangler.jsonc', 'wrangler.json', 'wrangler.toml', 'CNAME']);
const SKIP_EXT = new Set(['.md', '.jsx']);

let files = 0;
let bytes = 0;
function copy(from, to) {
  for (const e of fs.readdirSync(from, { withFileTypes: true })) {
    if (e.name.startsWith('.') || SKIP_NAMES.has(e.name)) continue;
    const a = path.join(from, e.name);
    const b = path.join(to, e.name);
    if (e.isDirectory()) {
      copy(a, b);
    } else if (e.isFile() && !SKIP_EXT.has(path.extname(e.name).toLowerCase())) {
      fs.mkdirSync(to, { recursive: true });
      fs.copyFileSync(a, b);
      files += 1;
      bytes += fs.statSync(a).size;
    }
  }
}

fs.rmSync(DIST, { recursive: true, force: true });
copy(ROOT, DIST);
for (const must of ['index.html', '404.html', '_headers']) {
  if (!fs.existsSync(path.join(DIST, must))) {
    console.error(`dist/${must} is missing`);
    process.exit(1);
  }
}
console.log(`dist/: ${files} files, ${(bytes / 1048576).toFixed(1)} MB`);
