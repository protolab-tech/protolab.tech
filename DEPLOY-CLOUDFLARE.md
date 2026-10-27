# Putting protolab.tech on Cloudflare

The site is plain files. On Cloudflare it runs as a **Worker with static assets** (Cloudflare's current
recommendation for static sites, in place of Pages): free, no request limit for files, HTTPS included.
Nothing here has been deployed and no DNS has been changed.

| File | What it does |
|---|---|
| `build.js` | `node build.js` copies the published files into `dist/` (no dependencies). It leaves out the repository's own files: dot-folders, `CNAME`, `wrangler.jsonc`, `build.js`, `*.md`, the unused `*.jsx` source. |
| `wrangler.jsonc` | Worker `protolab-tech`, serves `dist/`; a missing page gets `404.html` with status 404; `/Chosko/` serves `Chosko/index.html`; `/policy.html` redirects to `/policy`. |
| `_headers` | `nosniff` and a referrer policy on every response, long caching for `/assets/vendor/` and the font files (their names carry versions), and `noindex` on the `*.workers.dev` address. |

The site loads nothing from other hosts (fonts, three.js, GSAP, Lenis and sql.js are in `assets/`) except
the Google Calendar embedded on `/service-appointments/`, and it sets no cookies, so it needs no cookie banner.

## Steps (in this order, nothing goes offline)

1. **Merge** the `cloudflare` branch into `main` on GitHub. GitHub Pages keeps serving `main` meanwhile, and the
   merged site works there too.
2. **Cloudflare account** (free) → **Workers & Pages** → **Create application** → **Import a repository** →
   GitHub → allow the Cloudflare app on the `protolab-tech` organisation, for this repository only → choose
   `protolab-tech/protolab.tech`.
3. **Build settings**:
   - Worker name: `protolab-tech` (must equal `name` in `wrangler.jsonc`, or the build fails)
   - Production branch: `main`
   - Build command: `node build.js`
   - Deploy command: `npx wrangler@4 deploy`
   - Root directory: `/` (empty)

   **Save and Deploy**. Every push to `main` deploys again; other branches get preview URLs.
4. **Check** `https://protolab-tech.<your-subdomain>.workers.dev`: the home page's 3D field, `/Chosko/`,
   `/Kaolin/`, `/EvoSimGame/`, `/EmojiSpaceInvaders/`, `/service-appointments/`, `/policy.html` (redirects to
   `/policy`), and any made-up address (shows the 404 page).
5. **Move the DNS** to Cloudflare as described in `dns-protolab.tech.md` (the DNS move list prepared with this
   branch): DNSSEC off at Register.it first, add the zone (Free plan), compare the imported records with the
   list, every record **DNS only** (grey) for now, change the nameservers at Register.it, wait until the zone
   shows **Active**. The registration stays at Register.it; GitHub Pages keeps serving the site meanwhile.
6. **Custom domain**: delete the four GitHub Pages `A` records at `protolab.tech` (Cloudflare refuses a custom
   domain on a name that already has records), then Worker → **Settings** → **Domains & Routes** → **Add** →
   **Custom domain** → `protolab.tech`. Cloudflare creates the record and the certificate. Keep the domain in
   the dashboard only: `wrangler.jsonc` has no `routes`, so deploys leave it alone.
7. **www → protolab.tech** (`_redirects` cannot redirect between host names, so this is a zone rule):
   - DNS: replace the `www` CNAME with `AAAA` `www` → `100::`, **Proxied** (orange).
   - **Rules** → **Redirect Rules** → **Create rule** → *Custom filter expression*, edit expression:
     `(http.host eq "www.protolab.tech")` → Then: **Dynamic**,
     `concat("https://protolab.tech", http.request.uri.path)`, status **301**, **Preserve query string** on →
     Deploy. (Cloudflare's "Redirect from WWW to root" template does the same but only for `https://www…`.)
   - Check: `https://protolab.tech/` answers; `http://www.protolab.tech/Chosko/` → 301 →
     `https://protolab.tech/Chosko/`.
8. **GitHub Pages off**: repository → Settings → Pages → remove the custom domain and unpublish. The `CNAME`
   file can then be deleted (the build already leaves it out).
9. **DNSSEC**: Cloudflare → DNS → Settings → **Enable DNSSEC** → copy the DS record into Register.it's panel.

## Visit counts (off; a switch for later)

Nothing in the code counts visits. With the site on Cloudflare, the zone's **Analytics** and the Worker's
**Metrics** already show requests from the server side, with nothing added to the pages. For page views per page,
**Cloudflare Web Analytics** is cookieless: Web Analytics → **Add a site** → choose `protolab.tech` → automatic
setup (Cloudflare adds its script to the pages; it works because these pages have no Content-Security-Policy).
It loads `static.cloudflareinsights.com/beacon.min.js` and reports to `protolab.tech/cdn-cgi/rum`, both
Cloudflare, Inc., which already hosts the site. If it is switched on, the privacy policy should say so.

## Deploying from a computer instead of GitHub

`node build.js && npx wrangler@4 login && npx wrangler@4 deploy` — the same Worker, without Workers Builds.

## Trying it locally

`node build.js && npx wrangler@4 dev --ip 127.0.0.1` serves `dist/` at http://127.0.0.1:8787 with the same
404, trailing-slash and header rules as Cloudflare (`.wrangler/` and `dist/` are ignored by git).
