# 24/7 Golf Website Redesign

Michigan's premier indoor golf experience — website redesign project.

**Live site target:** [www.24-7golf.com](https://www.24-7golf.com)  
**Tech stack:** HTML / CSS / JavaScript → WordPress (final deployment)  
**Booking platform:** CourtReserve  
**Simulator technology:** Trackman iO

---

## Project Structure

```
247golf-website/
├── README.md                   ← You are here
├── DESIGN_SYSTEM.md            ← Colors, fonts, spacing — read before building anything
├── CLAUDE_CONTEXT.md           ← Paste into Claude at start of any session
├── css/
│   ├── variables.css           ← All CSS custom properties (single source of truth)
│   ├── base.css                ← Reset, typography, utility classes
│   └── components.css          ← Reusable components (cards, buttons, nav, footer)
├── js/
│   └── main.js                 ← Shared JS (scroll reveal, nav behavior, mobile menu)
├── pages/
│   ├── index.html              ← Landing page (Eric)
│   ├── faq.html                ← FAQ page (Eric)
│   ├── dewitt.html             ← Dewitt location page (Colleague)
│   ├── grand-rapids.html       ← Grand Rapids location page (Colleague)
│   ├── haslett.html            ← Haslett location page (Colleague)
│   ├── ludington.html          ← Ludington location page (Colleague)
│   └── traverse-city.html      ← Traverse City location page (Colleague)
├── components/
│   ├── nav.html                ← Shared navigation snippet
│   ├── footer.html             ← Shared footer snippet
│   └── location-card.html      ← Location card template
└── assets/
    └── images/
        └── logo.png            ← 24/7 Golf logo
```

---

## Page Ownership

| Page | Owner | Status |
|------|-------|--------|
| `index.html` — Landing Page | Eric | 🟡 In Progress |
| `faq.html` — FAQ | Eric | ⬜ Not Started |
| `dewitt.html` — Dewitt | Colleague | ⬜ Not Started |
| `grand-rapids.html` — Grand Rapids | Colleague | ⬜ Not Started |
| `haslett.html` — Haslett | Colleague | ⬜ Not Started |
| `ludington.html` — Ludington | Colleague | ⬜ Not Started |
| `traverse-city.html` — Traverse City | Colleague | ⬜ Not Started |

Update status to 🟡 In Progress / ✅ Done as you work.

---

## Locations

| Location | Address | Phone | CourtReserve Org ID |
|----------|---------|-------|---------------------|
| Dewitt | TBD | TBD | 10840 |
| Grand Rapids | TBD | TBD | TBD |
| Haslett | TBD | TBD | TBD |
| Ludington | TBD | TBD | TBD |
| Traverse City | TBD | TBD | TBD |

---

## Key Embed Codes

### CourtReserve — Create Free Account Widget
```html
<iframe id="form-iframe" class="form-iframe-47632"
  src="https://widgets.courtreserve.com/Online/Public/EmbedCode/10840/47632"
  style="margin:0; width:100%; border:none; overflow:hidden;"
  scrolling="no">
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
        if (1 == 1) window.scrollTo(0, 0);
        break;
      }
    }
  }, false);
</script>
```

### CourtReserve — Location Booking (replace EMBED_ID per location)
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
| Google Play Store | *(add link)* |

---

## Git Workflow

```bash
# Before starting work each day
git pull origin main

# While working
git add .
git commit -m "feat: add Grand Rapids location page"
git push origin main

# Suggested branch naming (optional)
git checkout -b eric/landing-page
git checkout -b colleague/location-pages
```

**Merge rule:** Always `git pull` before pushing to avoid conflicts. Each person owns their pages — don't edit the other's files without a heads-up.

---

## Working With Claude

See `CLAUDE_CONTEXT.md` — paste the full contents at the start of every Claude session to give it instant context about the project. This eliminates the need to re-explain the design system, locations, and embed codes each time.

Both collaborators have Claude Pro and work independently. Use Claude to:
- Generate new page HTML using the design system
- Iterate on layouts and copy
- Debug CSS issues
- Adapt the location card template for each location
