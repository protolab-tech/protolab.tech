#!/usr/bin/env node
// Builds what GitHub Pages publishes into _site/ (the workflow .github/workflows/pages.yml runs it).
//
// Two modes, chosen by the SITE_MODE environment variable:
//   redirect (the default since 11 Nov 2026): protolab.tech has the same company details as Zetaiti S.r.l.s., no longer
//       invoices and closes by the end of 2026, so every page sends visitors on to zetaiti.com. Each old address keeps
//       a tiny page that goes straight to the matching zetaiti.com page in the visitor's language (the booking page to
//       Contact, the privacy policy to Privacy, everything else to the home page, which picks the language itself).
//       GitHub Pages cannot send a 301, so this is the next best thing: a script, a <noscript> meta refresh, a
//       canonical link and a visible link. Nothing is loaded from other sites and no cookie is set. security.txt names
//       the company's security contact.
//   site: the full site as it was, every page and asset (minus what belongs to the repository: EXCLUDE). Nothing of the
//       old site was deleted; set the repository variable SITE_MODE to "site" to publish it again.
// Usage: node scripts/build-site.mjs [outDir]   (SITE_MODE=site node scripts/build-site.mjs for the full site)
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const OUT = path.resolve(process.argv[2] || path.join(ROOT, '_site'));
const MODE = process.env.SITE_MODE || 'redirect';
const EXCLUDE = new Set(['.git', '.github', '.claude', '.hintrc', 'scripts', '_site', 'node_modules', 'LICENSE.md', 'README.md']);

const ZETAITI = 'https://zetaiti.com';
const LANGS = ['en', 'it', 'de', 'fr', 'zh'];
// Old page -> zetaiti.com page (per language). Anything not listed goes to the home page.
const TARGETS = {
  'service-appointments/index.html': 'contact/',
  'policy.html': 'legal/#privacy',
  'Chosko/policy.html': 'legal/#privacy',
};

function copy(rel = '') {
  for (const e of fs.readdirSync(path.join(ROOT, rel), { withFileTypes: true })) {
    const r = rel ? `${rel}/${e.name}` : e.name;
    if (EXCLUDE.has(r)) continue;
    if (e.isDirectory()) { fs.mkdirSync(path.join(OUT, r), { recursive: true }); copy(r); }
    else fs.copyFileSync(path.join(ROOT, r), path.join(OUT, r));
  }
}

function pages(rel = '') {
  const out = [];
  for (const e of fs.readdirSync(path.join(ROOT, rel), { withFileTypes: true })) {
    const r = rel ? `${rel}/${e.name}` : e.name;
    if (EXCLUDE.has(r) || e.name.startsWith('.') || r === 'assets') continue;
    if (e.isDirectory()) out.push(...pages(r));
    else if (e.name.endsWith('.html')) out.push(r);
  }
  return out;
}

const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

function redirectPage(target) {
  // No target: the home page, whose own language picker sends the visitor on. A target: the same page in the
  // visitor's language (one of the five zetaiti.com has), English otherwise.
  const fallback = target ? `${ZETAITI}/en/${target}` : `${ZETAITI}/`;
  const script = target
    ? `var l=(navigator.languages||[navigator.language||'en']).map(function(x){return String(x).slice(0,2).toLowerCase()}).filter(function(x){return ${JSON.stringify(LANGS)}.indexOf(x)>=0})[0]||'en';location.replace(${JSON.stringify(`${ZETAITI}/`)}+l+${JSON.stringify(`/${target}`)});`
    : `location.replace(${JSON.stringify(`${ZETAITI}/`)});`;
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>protolab.tech is now zetaiti.com</title>
<meta name="robots" content="noindex">
<link rel="canonical" href="${esc(fallback)}">
<script>${script}</script>
<noscript><meta http-equiv="refresh" content="0; url=${esc(fallback)}"></noscript>
<style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#0a0a0a;color:#e8edf2;font:16px/1.6 system-ui,sans-serif;text-align:center;padding:24px}a{color:#57c9c2}</style>
</head>
<body>
<p>protolab.tech is now part of <a href="${esc(fallback)}">zetaiti.com</a>.<br>
<span lang="it">protolab.tech ora è parte di <a href="${esc(fallback)}">zetaiti.com</a>.</span></p>
</body>
</html>
`;
}

const SECURITY_TXT = `# protolab.tech now redirects to zetaiti.com (Zetaiti S.r.l.s.): report vulnerabilities to the company's security contact.
Contact: mailto:security@zetaiti.com
Contact: ${ZETAITI}/en/security/#report
Expires: 2027-10-27T00:00:00Z
Preferred-Languages: en, it
Canonical: https://protolab.tech/.well-known/security.txt
Policy: ${ZETAITI}/en/security/
Policy: ${ZETAITI}/it/security/
`;

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });
if (MODE === 'site') {
  copy();
} else if (MODE === 'redirect') {
  const list = pages();
  for (const rel of list) {
    fs.mkdirSync(path.dirname(path.join(OUT, rel)), { recursive: true });
    fs.writeFileSync(path.join(OUT, rel), redirectPage(TARGETS[rel] || ''));
  }
  if (!list.includes('404.html')) fs.writeFileSync(path.join(OUT, '404.html'), redirectPage(''));
  fs.mkdirSync(path.join(OUT, '.well-known'), { recursive: true });
  fs.writeFileSync(path.join(OUT, '.well-known', 'security.txt'), SECURITY_TXT);
  fs.writeFileSync(path.join(OUT, 'robots.txt'), 'User-agent: *\nAllow: /\n');
  fs.writeFileSync(path.join(OUT, '.nojekyll'), '');
  console.log(`redirect: ${list.length} pages -> ${ZETAITI}`);
} else {
  throw new Error(`SITE_MODE is "redirect" (the default) or "site", not "${MODE}"`);
}
console.log(`build (${MODE}): ${OUT} ready`);
