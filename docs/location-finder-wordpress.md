# Putting the Location Finder on the WordPress site

This is the **interim, hard-coded** location finder you built with Google Maps
**Quick Builder** and refined in JSFiddle. It uses Google's
[Extended Component Library](https://github.com/googlemaps/extended-component-library)
`<gmpx-store-locator>` ("Locator Plus") component — three small pieces of code:
an HTML snippet, a CSS block, and a JavaScript config that holds the locations.

> **How this fits the roadmap.** This gets a working finder live *now* with the
> locations typed straight into the code. The longer-term plan (see
> [ROADMAP.md §3–4](../ROADMAP.md)) replaces the hard-coded list with a
> data-driven store-locator plugin that reads from the Locations CPT. Treat this
> as the bridge to that — same page, swappable engine.

The source files live in [`/LocationFinder`](../LocationFinder) (raw Quick Builder
export). **The static-site version is no longer the `<gmpx-store-locator>` widget**
— see the note below.

> ⚠️ **Known bug with `<gmpx-store-locator>` and 24-hour businesses.** The widget
> renders its open/closed badge with the Maps JS `isOpen()` method, which
> mis-handles "open 24 hours" places (an open period with no closing time) and
> shows every 24/7 location as **"Closed"** — even though the Places API reports
> `open_now: true`. Upgrading the library (0.6.11 → 0.6.15) did not fix it.
> Because of this, the static prototype at
> [`/pages/locations.html`](../pages/locations.html) +
> [`/js/location-finder.js`](../js/location-finder.js) now uses a **custom finder**
> (list + map + markers) that renders the open status directly ("Open 24 Hours").
> If you embed the Quick Builder widget on WordPress you'll hit the same "Closed"
> bug; to avoid it, port the custom finder instead (it's plain HTML/CSS/JS — drop
> the markup in an HTML block and the JS via WPCode/Code Snippets).

---

## What the three pieces do

| Piece | File | Purpose |
|-------|------|---------|
| **HTML** | `LocationFinder.html` | Loads the component library and drops in the `<gmpx-api-loader>` + `<gmpx-store-locator>` tags. |
| **CSS** | `LocationFinder.css` | Sizes the map and themes the Locator Plus colors/fonts. |
| **JS** | `LocationFinder.js` | Holds the hard-coded `CONFIGURATION` (your locations) and calls `configureFromQuickBuilder()`. |

You need all three on the page, and they must load in this order: the module
script (loads the components) → the markup → the JS that configures it.

---

## Option A — Paste it into one Custom HTML / Code block (fastest)

Best for getting it live quickly. Works in Elementor, Gutenberg, or any page
builder that has a "Custom HTML" / "HTML" / "Code" widget.

1. In WP Admin, create/edit the page (e.g. **Pages → Add New → "Locations"**).
2. Add a **Custom HTML** block (Gutenberg) or an **HTML widget** (Elementor:
   search "HTML" in the widget panel and drag it onto the page).
3. Paste the block below into it and **Publish**.

```html
<!-- 1) Load the Google Maps Extended Component Library -->
<script type="module"
  src="https://ajax.googleapis.com/ajax/libs/@googlemaps/extended-component-library/0.6.15/index.min.js"></script>

<!-- 2) Styles for the locator -->
<style>
  #locator-shell { width: 100%; height: 78vh; min-height: 560px; }
  #locator-shell gmpx-store-locator {
    width: 100%; height: 100%;
    --gmpx-color-surface: #fff;
    --gmpx-color-on-surface: #212121;
    --gmpx-color-on-surface-variant: #757575;
    --gmpx-color-primary: #1a9e50;            /* 24/7 Golf green */
    --gmpx-color-outline: #e0e0e0;
    --gmpx-fixed-panel-width-row-layout: 28.5em;
    --gmpx-fixed-panel-height-column-layout: 65%;
    --gmpx-font-family-base: "Barlow", "Roboto", sans-serif;
    --gmpx-font-family-headings: "Barlow Condensed", "Roboto", sans-serif;
    --gmpx-font-size-base: 0.875rem;
    --gmpx-hours-color-open: #188038;
    --gmpx-hours-color-closed: #d50000;
    --gmpx-rating-color: #ffb300;
    --gmpx-rating-color-empty: #e0e0e0;
  }
</style>

<!-- 3) The locator markup -->
<div id="locator-shell">
  <gmpx-api-loader
    key="YOUR_GOOGLE_MAPS_API_KEY"
    solution-channel="GMP_QB_locatorplus_v11_cABCDEF"></gmpx-api-loader>
  <gmpx-store-locator map-id="DEMO_MAP_ID"></gmpx-store-locator>
</div>

<!-- 4) Locations + init (this is your LocationFinder.js content) -->
<script>
  const CONFIGURATION = {
    /* paste the CONFIGURATION object from js/location-finder.js here */
  };
  document.addEventListener('DOMContentLoaded', async () => {
    await customElements.whenDefined('gmpx-store-locator');
    const locator = document.querySelector('gmpx-store-locator');
    if (locator) locator.configureFromQuickBuilder(CONFIGURATION);
  });
</script>
```

Copy the `CONFIGURATION = { ... }` object straight out of
[`js/location-finder.js`](../js/location-finder.js) — that's the maintained,
de-duplicated copy of your locations (and it has the "Grand Haven" typo fixed).

> **To add or change a location later:** edit the `locations` array in that one
> `CONFIGURATION` block. Each entry needs `title`, `address1`, `address2`,
> `coords` (lat/lng), and `placeId`; add an `actions` array for a "Book"
> button. Quick Builder generates these for you if you'd rather not hand-edit.

---

## Option B — Keep the files separate (cleaner, recommended)

Instead of one giant block, host the CSS/JS as files and reference them. This
keeps the page light and lets you update locations without touching the page.

1. Upload `location-finder.js` (and optionally a CSS file) to the site — via the
   Media Library, an FTP/host file manager into the theme/uploads, or a
   "custom code" plugin like **WPCode** or **Code Snippets**.
2. On the page, add a small Custom HTML block with just the loader, markup, and
   `<script src="...">` references:

```html
<script type="module"
  src="https://ajax.googleapis.com/ajax/libs/@googlemaps/extended-component-library/0.6.15/index.min.js"></script>
<div id="locator-shell">
  <gmpx-api-loader key="YOUR_GOOGLE_MAPS_API_KEY"
    solution-channel="GMP_QB_locatorplus_v11_cABCDEF"></gmpx-api-loader>
  <gmpx-store-locator map-id="DEMO_MAP_ID"></gmpx-store-locator>
</div>
<script src="/wp-content/uploads/location-finder.js"></script>
```

(Adjust the `src` path to wherever you uploaded the file. Put the CSS in
**Appearance → Customize → Additional CSS**, or in your theme/child-theme
stylesheet.)

> **Elementor note:** some setups strip `<script>` tags from the HTML widget.
> If the map doesn't render, use the **WPCode**/**Code Snippets** plugin (set the
> snippet to run in the page **footer**) for the script parts, and keep only the
> `<div>` markup in the HTML widget. Or add a header/footer-scripts plugin.

---

## Before it goes live — three things to fix

These are placeholders in the Quick Builder export and **must** be set for a
clean production page:

1. **Use your own Google Maps API key.** The key currently in the code
   (`AIzaSy…`) is the Quick Builder demo key. Create a key in the
   [Google Cloud Console](https://console.cloud.google.com/google/maps-apis),
   enable **Maps JavaScript API**, **Places API**, and (for ZIP/address search)
   **Geocoding API**, then **restrict the key** to your domain (HTTP referrer
   restriction, e.g. `https://www.24-7golf.com/*`). An unrestricted key on a
   public page can be abused and run up billing. Set up a billing account —
   usage is small but Maps requires one.
2. **Create a real Map ID.** `DEMO_MAP_ID` is a sample. Make a Map ID under
   **Map Management** in the Cloud Console and use it in
   `<gmpx-store-locator map-id="...">`. This also lets you style the map
   (e.g. a dark theme to match the site) via cloud-based map styling.
3. **Confirm the "Book" links.** The Quick Builder `actions` point at
   `http://24-7golf.com/booking`. Point these at the right CourtReserve booking
   URL per location (or the site's booking page) and use `https`.

---

## How to preview locally / in this repo

The integrated static version is at [`pages/locations.html`](../pages/locations.html).
Because it loads the Google library from a CDN, open it through a local web
server (not a `file://` path) so the module script and the API can load:

```bash
# from the repo root
python3 -m http.server 8000
# then visit http://localhost:8000/pages/locations.html
```

---

## References

- [Extended Component Library — Store Locator](https://github.com/googlemaps/extended-component-library/blob/main/src/store_locator/README.md)
- [Google Maps Platform — Locator Plus / Quick Builder](https://developers.google.com/maps/architecture/store-locator)
- [API key best practices (restrictions)](https://developers.google.com/maps/api-security-best-practices)
- [ROADMAP.md §3 — the data-driven finder this evolves into](../ROADMAP.md)
