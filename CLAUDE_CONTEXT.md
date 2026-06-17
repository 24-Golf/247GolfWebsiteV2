# Claude Context — 24/7 Golf Website Redesign

Paste this entire file at the start of any Claude session to give it full project context instantly.

---

## Project Overview

We are redesigning the website for **24/7 Golf** — Michigan's premier indoor golf business.

- **Live site:** www.24-7golf.com (current WordPress/Elementor site)
- **V2 staging build:** https://mzhprabe.elementor.cloud/ (new site in progress, Elementor One)
- **Business:** Indoor golf simulator bays, powered by Trackman iO technology
- **Booking platform:** CourtReserve (embed widgets for booking and account creation)
- **Mobile app:** 24/7 Golf app available on Apple App Store and Google Play
- **Expanding:** Currently 5 Michigan locations, growing to 10–12

---

## Current Locations

| Location | Notes |
|----------|-------|
| Dewitt, MI | Original location |
| Grand Rapids, MI | |
| Haslett, MI | |
| Ludington, MI | |
| Traverse City, MI | |

Some locations also offer **pickleball**.

---

## Design System (Summary)

**Color palette (CSS vars):**
- `--black: #0a0a0a` — page background
- `--dark: #111317` — secondary bg
- `--card: #161a20` — card bg
- `--green: #2ecc71` — primary CTA / accent
- `--green-dim: #1a9e50` — hover green
- `--green-glow: rgba(46,204,113,0.18)` — glow effect
- `--white: #f5f7f2` — body text
- `--muted: #8a9080` — secondary text
- `--gold: #c9a84c` — Trackman / premium accents
- `--border: rgba(255,255,255,0.07)` — card borders

**Fonts (Google Fonts):**
- **Bebas Neue** → Hero headlines, section titles
- **Barlow Condensed** → Nav, labels, stats, badges
- **Barlow** → Body copy, descriptions

**Google Fonts link:**
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&family=Barlow+Condensed:wght@400;500;600;700;800&display=swap" rel="stylesheet">
```

**Visual style:** Dark/moody premium sports aesthetic. Green CTAs. Scroll-triggered fade-up animations (`.reveal` class). All pages must be fully responsive (laptop, tablet, phone).

---

## File Structure

```
pages/index.html          ← Landing page (Eric)
pages/locations.html      ← Location finder (Google Maps Locator Plus)
pages/faq.html            ← FAQ page (Eric)
pages/dewitt.html         ← Dewitt location (Colleague)
pages/grand-rapids.html   ← Grand Rapids location (Colleague)
pages/haslett.html        ← Haslett location (Colleague)
pages/ludington.html      ← Ludington location (Colleague)
pages/traverse-city.html  ← Traverse City location (Colleague)
css/variables.css         ← CSS custom properties
css/base.css              ← Reset + typography
css/components.css        ← Reusable components
js/main.js                ← Scroll reveal, mobile nav
js/location-finder.js     ← Hard-coded locations + map locator init
components/nav.html       ← Shared nav snippet
components/footer.html    ← Shared footer snippet
LocationFinder/           ← Raw Google Maps Quick Builder export
docs/location-finder-wordpress.md ← Put the finder on the WP page
```

> **Location finder:** `pages/locations.html` embeds Google's
> `<gmpx-store-locator>` (Quick Builder / Locator Plus); locations are
> hard-coded in `js/location-finder.js`. See `docs/location-finder-wordpress.md`
> to put it on WordPress. Before launch, swap the demo API key for a restricted
> production key and replace `DEMO_MAP_ID` with a real Map ID.

---

## Key Embed Code — CourtReserve Create Account Widget

```html
<iframe id="form-iframe" class="form-iframe-47632"
  src="https://widgets.courtreserve.com/Online/Public/EmbedCode/10840/47632"
  style="margin:0; width:100%; border:none; overflow:hidden;" scrolling="no">
</iframe>
<script type="text/javascript">
  var myEventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
  var myEventListener = window[myEventMethod];
  var myEventMessage = myEventMethod == "attachEvent" ? "onmessage" : "message";
  myEventListener(myEventMessage, function(e) {
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
        var url = e.data.urlToRedirect;
        setTimeout(() => { window.location.href = url; }, 100);
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

---

## Landing Page Sections (index.html) — Already Built

The landing page was designed in a prior Claude session and includes:
1. Fixed nav (logo, links, Book Now CTA)
2. Full-screen hero with dark background, headline, animated stats
3. Trackman trust bar (key features)
4. Why 24/7 Golf — features section
5. Photo gallery / masonry grid
6. Get the App section (iOS + Google Play buttons, QR codes)
7. Create Free Account (CourtReserve embed widget)
8. Locations — compact row tiles, one per location
9. Testimonials
10. Footer CTA + full footer

---

## Location Page Template

Each location page should follow this structure:
1. **Nav** (same as all pages)
2. **Location Hero** — location name, city, hero image of bays
3. **Book a Bay** — CourtReserve booking embed for that location
4. **Amenities** — what's available (# of bays, pickleball if applicable, hours)
5. **Trackman iO section** — brief blurb + feature highlights
6. **Get Started** — link to create free account or download app
7. **Other Locations** — compact links to other location pages
8. **Footer** (same as all pages)

---

## Navigation Links

```
Logo | Locations | How It Works | Trackman iO | Get the App | [Book Now]
```

---

## Instructions for Claude

- Always use the color tokens above — never hardcode hex values in page styles
- Always use Bebas Neue for headlines, Barlow for body, Barlow Condensed for nav/labels
- All new sections should have `class="reveal"` for scroll animation
- Keep the aesthetic dark, premium, and sports-focused
- Location pages should feel like they share a brand with the landing page
- Buttons: `.btn.btn-primary` (green) or `.btn.btn-outline` (transparent border)
- Cards use `--card` background with `--border` border and hover lift effect
- Section padding: `padding: 80px 5vw` desktop, `padding: 48px 5vw` mobile
- Always output complete, self-contained HTML that can be previewed immediately
