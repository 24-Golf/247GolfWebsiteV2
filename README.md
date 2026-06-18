# 24/7 Golf — Website V2

Michigan's premier indoor golf experience. This repository holds the design system,
static HTML/CSS/JS prototype, and planning docs for the **24-7golf.com** redesign.

**Live site:** [www.24-7golf.com](https://www.24-7golf.com) (current WordPress/Elementor site)
**🏗️ V2 staging build:** [mzhprabe.elementor.cloud](https://mzhprabe.elementor.cloud/) — the new site in progress (Elementor One)
**Booking platform:** CourtReserve
**Simulator technology:** Trackman iO
**Today:** 5 Michigan locations, scaling toward 20+

---

## 📚 Start Here

| Doc | What it's for |
|-----|---------------|
| **[ROADMAP.md](ROADMAP.md)** | The plan for the new site: platform/tooling decisions, the location-finder, multi-location architecture, and per-location owner editing. **Read this first.** |
| **[DESIGN_SYSTEM.md](DESIGN_SYSTEM.md)** | Colors, fonts, spacing, components. Read before building anything visual. |
| **[CLAUDE_CONTEXT.md](CLAUDE_CONTEXT.md)** | Paste into Claude at the start of a session for instant project context. |
| **[docs/location-finder-wordpress.md](docs/location-finder-wordpress.md)** | How to put the Google Maps location finder on the WordPress page (interim, hard-coded). |
| **[docs/claude-code-wordpress-setup.md](docs/claude-code-wordpress-setup.md)** | Connecting Claude Code to the WordPress site via MCP. |

---

## Project Structure

```
247GolfWebsiteV2/
├── README.md              ← You are here
├── ROADMAP.md             ← Forward plan & platform strategy
├── DESIGN_SYSTEM.md       ← Colors, fonts, spacing, components
├── CLAUDE_CONTEXT.md      ← Session primer for Claude
├── css/
│   ├── variables.css      ← CSS custom properties (single source of truth)
│   ├── base.css           ← Reset, typography, utilities
│   └── components.css      ← Reusable components (cards, buttons, nav, footer)
├── js/
│   ├── main.js            ← Scroll reveal, nav behavior, mobile menu
│   └── location-finder.js ← Hard-coded locations + Google Maps locator init
├── pages/
│   ├── index.html         ← Landing page prototype
│   └── locations.html     ← Location finder (Google Maps Locator Plus)
├── components/
│   ├── nav.html           ← Shared navigation snippet
│   ├── footer.html        ← Shared footer snippet
│   └── location-card.html ← Location card template
├── LocationFinder/        ← Raw Google Maps Quick Builder export (source mockup)
├── docs/
│   ├── location-finder-wordpress.md  ← Put the finder on the WP page
│   └── claude-code-wordpress-setup.md ← Connect Claude Code to WordPress
├── reference/
│   └── 247golf-DOWNLOAD.html  ← Reference export from the current site
└── assets/
    ├── images/web/        ← Web-optimized WebP images the site serves
    └── _source/           ← High-res masters (in git, excluded from deploy)
```

> **Status note:** The static prototype currently contains the landing page
> (`pages/index.html`), the location finder (`pages/locations.html`), and the
> shared component snippets. Individual location pages are being moved to a
> data-driven WordPress model — see **[ROADMAP.md](ROADMAP.md)** rather than
> hand-building one HTML file per location.

---

## Locations

Live locations (data from the location finder — see below):

| Location | CourtReserve Org ID | Pickleball | Status |
|----------|---------------------|------------|--------|
| Dewitt, MI (original) | `10840` | — | Live |
| Grand Rapids, MI | TBD | — | Live |
| Haslett, MI | TBD | — | Live |
| Ludington, MI | TBD | — | Live |
| Williamsburg, MI | TBD | — | Live |

**Coming soon:** Traverse City, Standale, Kentwood, Rockford, Grand Haven.

Some locations also offer pickleball. Address/phone/hours are managed per
location (see the location data model in ROADMAP.md). The authoritative list of
locations and their coordinates currently lives in
[`js/location-finder.js`](js/location-finder.js).

---

## Location Finder

The find-a-location page is a **custom finder** (location list + Google map with
markers, info windows, text filter, and "use my location" distance sort), with
the locations **hard-coded** in JavaScript for now.

- **Static prototype:** [`pages/locations.html`](pages/locations.html) (styled to
  the design system) — markup + styles for the finder.
- **Logic + data:** [`js/location-finder.js`](js/location-finder.js) — the
  hard-coded locations and all finder behavior.
- **Raw export:** [`LocationFinder/`](LocationFinder) (the original Google Maps
  Quick Builder / JSFiddle `<gmpx-store-locator>` mockup).
- **Putting it on WordPress:** [`docs/location-finder-wordpress.md`](docs/location-finder-wordpress.md).

> **Why custom (not Quick Builder's `<gmpx-store-locator>`)?** That widget renders
> its open/closed badge with the Maps JS `isOpen()` method, which mis-handles
> "open 24 hours" places (an open period with no closing time) and labels every
> 24/7 location **"Closed"** — even though the Places API reports `open_now: true`.
> Upgrading the library (0.6.11 → 0.6.15) didn't fix it, so the static prototype
> builds the finder itself and renders the open status directly ("Open 24 Hours").

> ⚠️ Before going live, swap the Quick Builder **demo API key** for a
> **restricted** production key and replace `DEMO_MAP_ID` with a real Map ID
> (`AdvancedMarkerElement` requires a Map ID). Point the "Book" actions at the
> right CourtReserve URLs. Details in the doc above. Longer term this hard-coded
> list is replaced by a data-driven store-locator — see [ROADMAP.md §3](ROADMAP.md).

---

## CourtReserve Embed Codes

### Create Free Account widget

```html
<iframe id="form-iframe" class="form-iframe-47632"
  src="https://widgets.courtreserve.com/Online/Public/EmbedCode/10840/47632"
  style="margin:0; width:100%; border:none; overflow:hidden;" scrolling="no">
</iframe>
<script type="text/javascript">
  var myEventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
  var myEventListener = window[myEventMethod];
  var myEventMessage = myEventMethod == "attachEvent" ? "onmessage" : "message";
  myEventListener(myEventMessage, function (e) {
    switch (e.data.action) {
      case "setHeight": {
        var embedCodeId = e.data.embedCodeId;
        if (embedCodeId != null && embedCodeId != '') {
          var elements = document.getElementsByClassName('form-iframe-' + embedCodeId);
          for (var i = 0; i < elements.length; i++) {
            elements[i].style.height = (e.data.height) + "px";
          }
        } else {
          document.getElementById('form-iframe').height = (e.data.height) + "px";
        }
        break;
      }
      case "redirectAfterLogin": {
        setTimeout(function () { window.location.href = e.data.urlToRedirect; }, 100);
        break;
      }
      case "scrollBottom": {
        if (e.data.scrollHeight) window.scrollTo(0, e.data.scrollHeight);
        break;
      }
      case "scrollTop": {
        window.scrollTo(0, 0);
        break;
      }
    }
  }, false);
</script>
```

### Per-location booking embed

Replace `EMBED_ID` (and the org ID, if different) for each location:

```html
<iframe src="https://widgets.courtreserve.com/Online/Public/EmbedCode/10840/EMBED_ID"
  style="margin:0; width:100%; border:none; overflow:hidden;" scrolling="no">
</iframe>
```

---

## App Store Links

| Platform | Link |
|----------|------|
| Apple App Store | *(add link)* |
| Google Play | *(add link)* |

---

## Deploying the prototype to Netlify (review / testing)

The static prototype can be deployed to Netlify straight from this GitHub repo —
**no build step**. The repo includes a [`netlify.toml`](netlify.toml) that
configures everything, so the deploy is zero-config.

**Why the defaults 404:** Netlify serves the repo **root**, but the landing page
is `pages/index.html` — there's no `index.html` at the root, so `/` returns 404.
`netlify.toml` fixes this by publishing the root and redirecting `/` →
`/pages/index.html` (which keeps the browser under `/pages/` so the relative
`../css`, `../js`, `../assets` paths and page-to-page links all resolve).

**Images:** the site serves web-optimized WebP from `assets/images/web/`. The
high-res masters live in `assets/_source/` and are stripped from the deploy by
the `netlify.toml` build command (`rm -rf assets/_source`) — they stay in git
but are never uploaded to the CDN.

**Set it up:**

1. In Netlify: **Add new site → Import an existing project → GitHub**, and pick
   `24-Golf/247GolfWebsiteV2`.
2. When asked for build settings, leave them empty — `netlify.toml` supplies them:
   - **Build command:** `rm -rf assets/_source` (strips image masters from the deploy)
   - **Publish directory:** `.` (repo root)
3. **Deploy.** Visiting the site root now loads the landing page; the location
   finder is at `/locations` (or `/pages/locations.html`).

> If you'd rather not deploy from `main`, point the Netlify site at a different
> branch under **Site configuration → Build & deploy → Branch to deploy**, and
> use **deploy previews** for pull requests.

---

## Git Workflow

Single maintainer, trunk-based — work directly on `main`:

```bash
# Get the latest
git pull origin main

# Make changes, then commit and push
git add .
git commit -m "feat: short description of the change"
git push origin main
```

No feature branches or pull requests needed for this project. The site itself is
built in Elementor on the staging URL above; this repo tracks the design system,
prototypes, and planning docs.

---

## Working With Claude

Paste **[CLAUDE_CONTEXT.md](CLAUDE_CONTEXT.md)** at the start of any Claude
session so it has the design system, locations, and embed codes immediately.
Use Claude to generate page HTML against the design system, iterate on layout and
copy, debug CSS, and plan the WordPress build described in ROADMAP.md.
