# LocationFinder

## Deploy to WordPress → use `wordpress-embed.html`

**[`wordpress-embed.html`](wordpress-embed.html)** is the ready-to-paste,
self-contained location finder for WordPress: a location list + Google map with
markers, info windows, a text filter, and a "use my location" distance sort.
Everything (loader, scoped CSS, markup, locations, logic) is in that one file.

**Steps:** set `YOUR_GOOGLE_MAPS_API_KEY` and `YOUR_MAP_ID` in the file, then
paste the whole thing into a WordPress "Custom HTML" block / Elementor "HTML"
widget. Full walkthrough: **[`/docs/location-finder-wordpress.md`](../docs/location-finder-wordpress.md)**.

This matches what runs on the static prototype at
[`/pages/locations.html`](../pages/locations.html) +
[`/js/location-finder.js`](../js/location-finder.js) — keep the location lists in
those two places in sync.

## Why it's custom (not the Quick Builder widget)

The original mockup used Google's Quick Builder `<gmpx-store-locator>` ("Locator
Plus") component — that's the raw export still kept here for reference:

- `LocationFinder.html` — loads the Extended Component Library + `<gmpx-*>` tags.
- `LocationFinder.css` — sizes/themes the Locator Plus component.
- `LocationFinder.js` — the `CONFIGURATION` (locations) + `configureFromQuickBuilder()`.

**That widget shows every 24/7 location as "Closed"** because its `isOpen()` logic
mis-handles "open 24 hours" hours (an open period with no closing time), even
though the Places API reports `open_now: true`. Upgrading the library didn't fix
it, so the finder was rebuilt to render the open status directly. Use
`wordpress-embed.html`, **not** these three raw files, for the live site.

## Before going live

- Swap the demo API key for a **restricted** production key.
- Set a real **Map ID** (Advanced Markers require one).
- Confirm the per-location **Book** URLs in the `CONFIGURATION` list.
