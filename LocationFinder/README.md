# LocationFinder — raw Quick Builder export

These three files are the original location finder built with Google Maps
**Quick Builder** and refined in JSFiddle:

- `LocationFinder.html` — loads the Extended Component Library and the
  `<gmpx-api-loader>` + `<gmpx-store-locator>` tags.
- `LocationFinder.css` — sizes and themes the Locator Plus component.
- `LocationFinder.js` — the hard-coded `CONFIGURATION` (locations) + init call.

This folder is kept as the **source of truth from the design tool**. The version
wired into the static site (design system, nav, footer) lives at:

- [`/pages/locations.html`](../pages/locations.html) — the page
- [`/js/location-finder.js`](../js/location-finder.js) — the maintained locations list

**To put this on the WordPress site,** follow
[`/docs/location-finder-wordpress.md`](../docs/location-finder-wordpress.md).

> Note: this export uses the Quick Builder **demo API key** and `DEMO_MAP_ID`.
> Swap in a restricted production key and a real Map ID before going live — see
> the WordPress doc for details.
