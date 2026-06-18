# Image source masters (not deployed)

These are the **high-resolution master images** (Trackman photography, the 24/7
Golf logo, mobile-app screenshots, QR codes). They are kept in git as source but
are **excluded from the Netlify deploy** — `netlify.toml` runs
`rm -rf assets/_source` during the build so they're never uploaded to the CDN.

The website serves **web-optimized WebP copies** from
[`../images/web/`](../images/web) instead.

**To add or refresh a served image:** drop the master here, then generate an
optimized WebP into `assets/images/web/` (resize to display size, quality ~80)
and reference that from the page.
