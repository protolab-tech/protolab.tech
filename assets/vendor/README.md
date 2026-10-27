# Third-party code, served from this site

These files used to be loaded from cdn.jsdelivr.net and sql.js.org on every visit. They are
byte-for-byte the same files at the same versions, kept here so a visitor's browser asks no other
server. To update one, download the new version into a new `<name>-<version>/` folder and change
the page that loads it.

| Folder | Was loaded from | Used by | Licence |
|---|---|---|---|
| `three-0.160.0/three.module.js` | `https://cdn.jsdelivr.net/npm/three-0.160.0/build/three.module.js` | `index.html` (import map) | MIT, `three-0.160.0/LICENSE` |
| `lenis-1.1.14/lenis.min.js` (+ its source map) | `https://cdn.jsdelivr.net/npm/lenis-1.1.14/dist/lenis.min.js` | `index.html` | MIT, `lenis-1.1.14/LICENSE` |
| `gsap-3.12.5/gsap.min.js`, `ScrollTrigger.min.js` | `https://cdn.jsdelivr.net/npm/gsap-3.12.5/dist/…` | `index.html` | GSAP Standard License, https://gsap.com/standard-license (named in each file's header) |
| `sql.js-1.15.2/sql-wasm.js`, `sql-wasm.wasm` | `https://sql.js.org/dist/…` (unversioned; it was serving 1.15.2 when copied) | `EvoSimGame/index.html` | MIT, `sql.js-1.15.2/LICENSE` |
