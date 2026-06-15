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
│   └── main.js            ← Scroll reveal, nav behavior, mobile menu
├── pages/
│   └── index.html         ← Landing page prototype
├── components/
│   ├── nav.html           ← Shared navigation snippet
│   ├── footer.html        ← Shared footer snippet
│   └── location-card.html ← Location card template
├── reference/
│   └── 247golf-DOWNLOAD.html  ← Reference export from the current site
└── assets/
    └── images/            ← Logos, photos
```

> **Status note:** The static prototype currently contains the landing page
> (`pages/index.html`) and the shared component snippets. Location pages are
> being moved to a data-driven WordPress model — see **[ROADMAP.md](ROADMAP.md)**
> rather than hand-building one HTML file per location.

---

## Locations

| Location | CourtReserve Org ID | Pickleball | Status |
|----------|---------------------|------------|--------|
| Dewitt, MI (original) | `10840` | — | Live |
| Grand Rapids, MI | TBD | — | Live |
| Haslett, MI | TBD | — | Live |
| Ludington, MI | TBD | — | Live |
| Traverse City, MI | TBD | — | Live |

Some locations also offer pickleball. Address/phone/hours are managed per
location (see the location data model in ROADMAP.md).

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
