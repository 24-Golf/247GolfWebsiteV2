<!-- markdownlint-disable MD033 MD041 -->
# WordPress / Elementor Deployment Guide

This guide explains how to take individual **sections** from the static
location pages in this repo (`pages/*.html`) and drop them into **Elementor
HTML widgets** on the matching page of the live WordPress site
(www.24-7golf.com).

Each snippet below is **self-contained**: it carries its own styles and fonts
and needs **no theme CSS and no JavaScript**. You can paste it into an Elementor
**HTML** widget and it will render exactly as shown, regardless of your theme.

---

## How this works (read once)

The static pages share three external stylesheets (`css/variables.css`,
`base.css`, `components.css`) plus a small `js/main.js` for scroll animations.
**None of that exists inside an Elementor HTML widget**, so a raw copy/paste of a
section would be unstyled (and, because of the `.reveal` animation class, even
invisible).

To avoid that, every snippet in this guide has been **rewritten to be portable**:

| Concern | How the snippet handles it |
|---|---|
| **Theme CSS missing** | All styles are inlined in a `<style>` block inside the snippet. |
| **CSS variables** (`--green`, etc.) | Redefined locally on the snippet's wrapper element. |
| **Class-name collisions** with the theme | Every class is namespaced (`g247-…`) so it can't clash with WordPress/Elementor classes. |
| **Fonts** | The required Google Fonts (`Bebas Neue`, `Barlow`, `Barlow Condensed`) are loaded by a `<link>` in the snippet. |
| **`.reveal` scroll animation needs `main.js`** | Removed — content is visible by default. |
| **Theme shrinks text** | Font sizes are set in **absolute `px`**, not `rem`. Some themes set the root font-size to `62.5%` (10px), which would shrink any `rem`-based text; `px` is immune. |
| **Brand colors** | Hard-coded to the design tokens (green `#2ecc71`, gold `#c9a84c`, etc.). |

> **Editing rule of thumb:** treat the snippets in this file as the source of
> truth for what goes on WordPress. If you change a section in `pages/*.html`,
> re-export the portable snippet here so the two stay in sync.

### Generic Elementor steps (same for every snippet)

1. Edit the target page in **Elementor** (e.g. the Ludington page).
2. Drag in an **HTML** widget where you want the section to appear.
   - The HTML widget is under *General* in the widget panel. (If you use a
     different builder, any "Custom HTML / Code" block works the same way.)
3. **Paste the entire snippet** (including the `<!-- comment -->`, the `<link>`
   tags, the `<style>` block, and the markup) into the widget's content box.
4. Click **Update / Publish**, then **preview the live page** — the Elementor
   editor canvas sometimes strips or restyles `<style>`/`<link>`, so always
   confirm on the published page, not just inside the editor.
5. If the section sits against your own background, you can make it blend by
   editing one line in the snippet — see *Customizing* under each section.

> **Tip:** Put each section in its **own** HTML widget. The fonts `<link>` is
> safe to include in every snippet (the browser de-duplicates identical
> requests), so snippets stay independently copy-pasteable.

---

## Sections

- [Ludington → "Choose Your Membership"](#ludington--choose-your-membership)

---

## Ludington → "Choose Your Membership"

**Source:** `pages/ludington.html` → `#memberships` section
**Target page:** Ludington
**Data source:** CourtReserve org `10840` (24-7 Golf)

A responsive grid of the six Ludington memberships. Each card shows the plan
name, a category badge (Individual / Family) plus any "effective to" date, the
feature list, and a **Learn More & Join** button that deep-links to that exact
membership's public signup page on CourtReserve.

### Preview

A self-contained dark band that sits cleanly inside a normal (even white-themed)
WordPress page:

- **Desktop:** three cards per row (auto-fitting grid)
- **Mobile:** single column, full-width buttons
- Hover lifts each card with a green border glow

### Paste this into an Elementor HTML widget

```html
<!-- ============================================================
     24/7 GOLF — LUDINGTON "CHOOSE YOUR MEMBERSHIP"
     Paste into an Elementor "HTML" widget.
     Self-contained: no theme CSS or JavaScript required.
     Font sizes are in absolute px so a theme's root font-size
     (some themes use 62.5% = 10px) cannot shrink the text.
     Source: pages/ludington.html  (#memberships section)
     ============================================================ -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@300;400;600;700&family=Barlow+Condensed:wght@500;600;700;800&display=swap" rel="stylesheet">

<style>
  .g247-mem{
    --g-green:#2ecc71; --g-green-dim:#1a9e50; --g-gold:#c9a84c;
    --g-card:#161a20; --g-dark:#0a0a0a; --g-border:rgba(255,255,255,.07);
    --g-white:#f5f7f2;
    background:var(--g-dark); color:var(--g-white);
    padding:64px 5vw; font-size:16px;
    font-family:'Barlow',-apple-system,Segoe UI,Roboto,Arial,sans-serif;
  }
  .g247-mem *{ box-sizing:border-box; }
  .g247-mem__inner{ max-width:1200px; margin:0 auto; }
  .g247-mem__head{ text-align:center; margin-bottom:40px; }
  .g247-mem__eyebrow{
    display:inline-flex; align-items:center; gap:10px;
    font-family:'Barlow Condensed',sans-serif; font-size:15px; font-weight:700;
    letter-spacing:3px; text-transform:uppercase; color:var(--g-green); margin-bottom:14px;
  }
  .g247-mem__eyebrow::before{ content:''; width:28px; height:2px; background:var(--g-green); }
  .g247-mem__title{
    font-family:'Bebas Neue',sans-serif; font-size:clamp(40px,5vw,64px);
    letter-spacing:2px; line-height:1; margin:0 0 16px; color:var(--g-white);
  }
  .g247-mem__lead{
    max-width:560px; margin:0 auto; color:rgba(245,247,242,.72);
    font-weight:400; font-size:19px; line-height:1.7;
  }
  .g247-mem__grid{
    display:grid; grid-template-columns:repeat(auto-fit,minmax(300px,1fr));
    gap:20px; align-items:stretch;
  }
  .g247-mem__card{
    display:flex; flex-direction:column; background:var(--g-card);
    border:1px solid var(--g-border); border-radius:8px; padding:26px;
    transition:border-color .25s ease, transform .25s ease, box-shadow .25s ease;
  }
  .g247-mem__card:hover{
    border-color:rgba(46,204,113,.3); transform:translateY(-4px);
    box-shadow:0 4px 24px rgba(0,0,0,.4);
  }
  .g247-mem__badges{ display:flex; flex-wrap:wrap; gap:8px; margin-bottom:14px; }
  .g247-mem__tag{
    display:inline-block; padding:5px 12px; border-radius:20px;
    font-family:'Barlow Condensed',sans-serif; font-size:14px; font-weight:600;
    letter-spacing:1px; text-transform:uppercase;
    background:rgba(46,204,113,.10); border:1px solid rgba(46,204,113,.25); color:var(--g-green);
  }
  .g247-mem__tag--gold{ background:rgba(201,168,76,.15); border-color:rgba(201,168,76,.30); color:var(--g-gold); }
  .g247-mem__tag--muted{ background:rgba(138,144,128,.10); border-color:rgba(138,144,128,.20); color:#a8ad9e; }
  .g247-mem__name{
    font-family:'Barlow Condensed',sans-serif; font-size:24px; font-weight:700;
    letter-spacing:.5px; text-transform:uppercase; margin:0 0 8px; color:var(--g-white);
  }
  .g247-mem__desc{ font-size:17px; font-weight:400; color:rgba(245,247,242,.7); line-height:1.55; margin:0 0 18px; }
  .g247-mem__features{ list-style:none; margin:0 0 24px; padding:0; flex:1 1 auto; }
  .g247-mem__features li{
    position:relative; padding-left:28px; margin-bottom:12px;
    font-size:17px; color:rgba(245,247,242,.85); line-height:1.5;
  }
  .g247-mem__features li::before{
    content:''; position:absolute; left:0; top:4px; width:18px; height:18px; border-radius:50%;
    background:var(--g-green);
    -webkit-mask:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path fill='white' d='M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z'/></svg>") center/15px no-repeat;
    mask:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path fill='white' d='M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z'/></svg>") center/15px no-repeat;
  }
  .g247-mem__btn{
    margin-top:auto; display:inline-flex; align-items:center; justify-content:center; gap:8px;
    padding:14px 28px; border-radius:4px; font-family:'Barlow Condensed',sans-serif;
    font-size:17px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase;
    text-decoration:none; background:var(--g-green); color:#0a0a0a; border:2px solid var(--g-green);
    transition:background .25s ease, border-color .25s ease;
  }
  .g247-mem__btn:hover{ background:var(--g-green-dim); border-color:var(--g-green-dim); color:#0a0a0a; }
  @media (max-width:768px){ .g247-mem{ padding:48px 6vw; } }
</style>

<section class="g247-mem">
  <div class="g247-mem__inner">
    <div class="g247-mem__head">
      <div class="g247-mem__eyebrow">Ludington Memberships</div>
      <h2 class="g247-mem__title">Choose Your Membership</h2>
      <p class="g247-mem__lead">Pick the membership that fits your game. Sign up online in minutes — pricing and checkout are handled securely through CourtReserve.</p>
    </div>

    <div class="g247-mem__grid">
      <article class="g247-mem__card">
        <div class="g247-mem__badges"><span class="g247-mem__tag">Individual</span></div>
        <h3 class="g247-mem__name">Player</h3>
        <p class="g247-mem__desc">Default account type with Ludington as your preferred location.</p>
        <ul class="g247-mem__features">
          <li>Free membership — Home Location: Ludington</li>
          <li>Golf — pricing is per bay; bring your friends and pay one rate</li>
          <li>Weekdays before 5pm — $35.00 / hour / bay</li>
          <li>After 5pm &amp; weekends — $50.00 / hour / bay</li>
          <li>Additional benefits included</li>
        </ul>
        <a class="g247-mem__btn" href="https://app.courtreserve.com/Online/Memberships/ViewPublicMembership/10840?membershipId=225646" target="_blank" rel="noopener">Learn More &amp; Join</a>
      </article>

      <article class="g247-mem__card">
        <div class="g247-mem__badges"><span class="g247-mem__tag g247-mem__tag--gold">Family</span></div>
        <h3 class="g247-mem__name">Family Player</h3>
        <p class="g247-mem__desc">Default family membership.</p>
        <ul class="g247-mem__features">
          <li>Add existing family members — contact ludington@24-7golf.com</li>
          <li>Reserve up to 30 days in advance</li>
          <li>Cancel reservations up to 4 hours in advance without penalty</li>
        </ul>
        <a class="g247-mem__btn" href="https://app.courtreserve.com/Online/Memberships/ViewPublicMembership/10840?membershipId=250843" target="_blank" rel="noopener">Learn More &amp; Join</a>
      </article>

      <article class="g247-mem__card">
        <div class="g247-mem__badges"><span class="g247-mem__tag">Individual</span><span class="g247-mem__tag g247-mem__tag--muted">Effective to 9/30/2026</span></div>
        <h3 class="g247-mem__name">Summer UNLIMITED PLAY</h3>
        <p class="g247-mem__desc">Unlimited free play. Membership cannot be canceled.</p>
        <ul class="g247-mem__features">
          <li>Home Location: Ludington</li>
          <li>2025 price lock — lock in 2025 winter pricing</li>
          <li>Contract runs April 1 – September 30</li>
          <li>UNLIMITED FREE PLAY (home location), limit 1 open booking, no guest fee</li>
          <li>Additional benefits included</li>
        </ul>
        <a class="g247-mem__btn" href="https://app.courtreserve.com/Online/Memberships/ViewPublicMembership/10840?membershipId=250923" target="_blank" rel="noopener">Learn More &amp; Join</a>
      </article>

      <article class="g247-mem__card">
        <div class="g247-mem__badges"><span class="g247-mem__tag">Individual</span><span class="g247-mem__tag g247-mem__tag--muted">Effective to 8/31/2026</span></div>
        <h3 class="g247-mem__name">Summer Membership</h3>
        <p class="g247-mem__desc">Summer membership for golf and pickleball.</p>
        <ul class="g247-mem__features">
          <li>Home Location: Ludington</li>
          <li>60 minutes per day FREE play (golf or pickleball), limit 2 open bookings</li>
          <li>$5.00 off standard golf &amp; pickleball rates</li>
          <li>$20.00 guest fee — golf</li>
          <li>Additional benefits included</li>
        </ul>
        <a class="g247-mem__btn" href="https://app.courtreserve.com/Online/Memberships/ViewPublicMembership/10840?membershipId=251124" target="_blank" rel="noopener">Learn More &amp; Join</a>
      </article>

      <article class="g247-mem__card">
        <div class="g247-mem__badges"><span class="g247-mem__tag">Individual</span></div>
        <h3 class="g247-mem__name">Pickleball Membership</h3>
        <p class="g247-mem__desc">Deep discounts for year-round indoor pickleball play.</p>
        <ul class="g247-mem__features">
          <li>Only valid at our Ludington location</li>
          <li>$20.00 per hour for the court — no charge for additional players</li>
          <li>$10.00 per hour summer rate (Apr 1 – Sep 30)</li>
          <li>Reserve up to 30 days in advance</li>
          <li>Cancel up to 4 hours in advance without penalty</li>
        </ul>
        <a class="g247-mem__btn" href="https://app.courtreserve.com/Online/Memberships/ViewPublicMembership/10840?membershipId=212220" target="_blank" rel="noopener">Learn More &amp; Join</a>
      </article>

      <article class="g247-mem__card">
        <div class="g247-mem__badges"><span class="g247-mem__tag g247-mem__tag--gold">Family</span></div>
        <h3 class="g247-mem__name">Family Annual Membership</h3>
        <p class="g247-mem__desc">Annual family membership — Ludington pickleball membership included.</p>
        <ul class="g247-mem__features">
          <li>Home Location: Ludington</li>
          <li>Max 3 members per family</li>
          <li>90 minutes per day FREE play (home location)</li>
          <li>90 minutes per day $25.00 per session at all other locations</li>
          <li>Additional benefits included</li>
        </ul>
        <a class="g247-mem__btn" href="https://app.courtreserve.com/Online/Memberships/ViewPublicMembership/10840?membershipId=223201" target="_blank" rel="noopener">Learn More &amp; Join</a>
      </article>
    </div>
  </div>
</section>
```

### Customizing

- **Text size:** all copy is in absolute `px`, so it will not be shrunk by your
  theme's root font-size. To scale a piece up/down, edit its `font-size` (e.g.
  `.g247-mem__desc` and `.g247-mem__features li` are `17px`; the heading is
  `.g247-mem__title` `clamp(40px,5vw,64px)`; the button is `.g247-mem__btn`
  `17px`).
- **Blend with your own background:** the snippet ships with a dark band
  (`background:var(--g-dark)` on `.g247-mem`). If your Elementor section already
  has a dark background, set it to `background:transparent;` in the `.g247-mem`
  rule. To reduce/increase the top–bottom spacing, change `padding:64px 5vw;`.
- **Change a plan's signup link / add or remove a plan:** each card's button
  `href` ends in `membershipId=<ID>`. The current IDs are:

  | Membership | `membershipId` |
  |---|---|
  | Player | `225646` |
  | Family Player | `250843` |
  | Summer UNLIMITED PLAY | `250923` |
  | Summer Membership | `251124` |
  | Pickleball Membership | `212220` |
  | Family Annual Membership | `223201` |

  These come from CourtReserve's public membership list for org `10840`
  (`https://app.courtreserve.com/Online/Memberships/Public/10840`). If 24-7 Golf
  adds, renames, or retires a Ludington membership, update the matching
  `<article>` block (name, badge, features, and `membershipId`).
- **Badge colors:** `g247-mem__tag` = green (Individual), add
  `g247-mem__tag--gold` for Family, add `g247-mem__tag--muted` for a date/info
  pill.

### Notes

- **Pricing:** CourtReserve's public feed does not expose a single recurring
  price per plan, so the cards route buyers to CourtReserve for exact dues and
  checkout (some rate details are shown inline in the feature lists). This keeps
  prices from going stale on WordPress.
- **Keep in sync:** this snippet mirrors the `#memberships` section of
  `pages/ludington.html`. If you regenerate the location pages
  (`node scripts/build-location-pages.cjs`) after editing membership data,
  refresh this snippet to match.
