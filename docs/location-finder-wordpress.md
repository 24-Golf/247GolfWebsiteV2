# Putting the Location Finder on the WordPress site

The location finder is a **custom, self-contained widget**: a list of locations +
a Google map with markers, info windows, a text filter, and a "use my location"
distance sort. Locations are **hard-coded** in the JavaScript for now.

> **Why custom (not Google's Quick Builder `<gmpx-store-locator>`)?** That widget
> renders its open/closed badge with the Maps JS `isOpen()` method, which
> mis-handles "open 24 hours" places and labels every 24/7 location **"Closed"**
> even though the Places API reports `open_now: true`. Upgrading the library did
> not fix it, so we render the open status ourselves. **Do not** paste the old
> store-locator embed — use the file below.

> **How this fits the roadmap.** This gets a working finder live *now* with the
> locations typed into the code. The longer-term plan
> ([ROADMAP.md §3–4](../ROADMAP.md)) replaces the hard-coded list with a
> data-driven store-locator that reads from a Locations custom post type.

**What to paste:** the single ready-made file
[`/LocationFinder/wordpress-embed.html`](../LocationFinder/wordpress-embed.html).
It contains everything — the Google library loader, the styles (namespaced under
`#tfgolf-finder` so they can't clash with your theme), the markup, and the
locations + logic. No other files from this repo are needed.

---

## Before you paste — set two values

Open `LocationFinder/wordpress-embed.html` and replace these placeholders:

1. **`YOUR_GOOGLE_MAPS_API_KEY`** — in the `<gmpx-api-loader>` tag.
2. **`YOUR_MAP_ID`** — in `CONFIGURATION.mapOptions.mapId` (near the bottom).

Both come from the [Google Cloud Console](https://console.cloud.google.com/google/maps-apis):

- **API key:** enable **Maps JavaScript API** and **Places API**, then **restrict
  the key** by HTTP referrer to your domains (e.g. `https://www.24-7golf.com/*`
  and `https://*.elementor.cloud/*` if you're testing on staging). An unrestricted
  key on a public page can be abused and run up billing. A billing account is
  required (usage here is small).
- **Map ID:** create one under **Map Management**. A Map ID is **required** — the
  map uses Advanced Markers, which won't render without it. (You can also use the
  Map ID to apply a dark map style that matches the site.)

> The booking buttons already point at each location's page
> (`https://24-7golf.com/ludington`, `/grand-rapids`, `/lansing`, `/haslett`,
> and Williamsburg → `/traverse-city`). Update them in the `actions` of the
> `CONFIGURATION` list if any change.

---

## Paste it into the page

Works in Elementor, Gutenberg, or any builder with a "Custom HTML" / "HTML" /
"Code" widget.

1. In WP Admin, edit your Locations page.
2. Add a **Custom HTML** block (Gutenberg) or an **HTML** widget (Elementor —
   search "HTML" and drag it in). Give it the full page width for the best layout.
3. Paste the **entire** contents of `wordpress-embed.html` and **Publish**.

That's it — the finder fills its container (it's `78vh` tall on desktop, and
stacks list-over-map under 900px wide).

> **Elementor note:** some setups strip `<script>` tags from the HTML widget. If
> the map doesn't appear, install **WPCode** (or **Code Snippets**), paste the
> two `<script>` blocks there set to run in the page **footer**, and keep only the
> `<style>` + `<div id="tfgolf-finder">…</div>` markup in the HTML widget. A
> header/footer-scripts plugin works too.

---

## Adding or changing a location

Edit the `CONFIGURATION.locations` array in the pasted block. Each entry needs:

```js
{
  "title": "24/7 Golf - City",          // "(COMING SOON)" in the title = no Book button
  "address1": "123 Main St",
  "address2": "City, MI 49000, USA",
  "coords": { "lat": 43.0, "lng": -85.0 },
  "placeId": "ChIJ...",                  // optional; used for the Directions link
  "actions": [{ "label": "Book", "defaultUrl": "https://24-7golf.com/city" }]
}
```

Locations with no `actions` (or `(COMING SOON)` in the title) show a gold
"Coming Soon" pill and no Book button. Keep this list in sync with the static
prototype's [`/js/location-finder.js`](../js/location-finder.js).

---

## Preview locally (in this repo)

The same finder runs at [`pages/locations.html`](../pages/locations.html). Because
it loads the Google library from a CDN, serve it over HTTP (not `file://`):

```bash
# from the repo root
python3 -m http.server 8000
# then visit http://localhost:8000/pages/locations.html
```

---

## References

- [Maps JS — Advanced Markers (needs a Map ID)](https://developers.google.com/maps/documentation/javascript/advanced-markers/overview)
- [Extended Component Library — API loader](https://github.com/googlemaps/extended-component-library/blob/main/src/api_loader/README.md)
- [API key best practices (restrictions)](https://developers.google.com/maps/api-security-best-practices)
- [ROADMAP.md §3 — the data-driven finder this evolves into](../ROADMAP.md)
