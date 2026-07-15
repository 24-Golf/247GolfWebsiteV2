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
- [Ludington → "Gift Cards" (GiftUp)](#ludington--gift-cards-giftup)
- [Any page → "FAQ Accordion"](#any-page--faq-accordion)

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

---

## Ludington → "Gift Cards" (GiftUp)

**Source:** `pages/ludington.html` → `#gift-cards` section
**Target page:** Ludington
**Data source:** GiftUp site `4faecf6d-3505-4dad-9044-482645b4f63e`

A dark section header ("The Perfect Gift / 24/7 Golf Ludington Gift Cards")
above the GiftUp checkout widget in a white rounded panel. Gift cards are
delivered by email and redeemable for bay time.

### Paste this into an Elementor HTML widget

```html
<!-- ============================================================
     24/7 GOLF — LUDINGTON GIFT CARDS (GiftUp checkout)
     Paste into an Elementor "HTML" widget.
     Self-contained styles; the GiftUp <script> loads the widget.
     If your setup strips <script> tags, see the Notes below.
     Source: pages/ludington.html  (#gift-cards section)
     ============================================================ -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@300;400;600;700&family=Barlow+Condensed:wght@500;600;700;800&display=swap" rel="stylesheet">

<style>
  .g247-gift{
    --g-green:#2ecc71; --g-dark:#0a0a0a; --g-white:#f5f7f2;
    background:var(--g-dark); color:var(--g-white);
    padding:64px 5vw; font-size:16px;
    font-family:'Barlow',-apple-system,Segoe UI,Roboto,Arial,sans-serif;
  }
  .g247-gift *{ box-sizing:border-box; }
  .g247-gift__inner{ max-width:1100px; margin:0 auto; }
  .g247-gift__head{ text-align:center; margin-bottom:36px; }
  .g247-gift__eyebrow{
    display:inline-flex; align-items:center; gap:10px;
    font-family:'Barlow Condensed',sans-serif; font-size:15px; font-weight:700;
    letter-spacing:3px; text-transform:uppercase; color:var(--g-green); margin-bottom:14px;
  }
  .g247-gift__eyebrow::before{ content:''; width:28px; height:2px; background:var(--g-green); }
  .g247-gift__title{
    font-family:'Bebas Neue',sans-serif; font-size:clamp(38px,5vw,60px);
    letter-spacing:2px; line-height:1; margin:0 0 16px; color:var(--g-white);
  }
  .g247-gift__lead{
    max-width:560px; margin:0 auto; color:rgba(245,247,242,.72);
    font-weight:400; font-size:19px; line-height:1.7;
  }
  .g247-gift__panel{
    background:rgba(255,255,255,.97); border-radius:12px;
    padding:clamp(18px,3vw,32px); box-shadow:0 24px 60px rgba(0,0,0,.5);
    min-height:320px;
  }
  @media (max-width:768px){ .g247-gift{ padding:48px 6vw; } }
</style>

<section class="g247-gift">
  <div class="g247-gift__inner">
    <div class="g247-gift__head">
      <div class="g247-gift__eyebrow">The Perfect Gift</div>
      <h2 class="g247-gift__title">24/7 Golf Ludington Gift Cards</h2>
      <p class="g247-gift__lead">Give the gift of indoor golf. Buy a gift card for 24/7 Golf Ludington below — delivered instantly by email and redeemable for bay time.</p>
    </div>
    <div class="g247-gift__panel">
      <div class="gift-up-target" data-site-id="4faecf6d-3505-4dad-9044-482645b4f63e" data-platform="Other"></div>
      <script type="text/javascript">
      (function (g, i, f, t, u, p, s) {
          g[u] = g[u] || function() { (g[u].q = g[u].q || []).push(arguments) };
          p = i.createElement(f);
          p.async = 1;
          p.src = t;
          s = i.getElementsByTagName(f)[0];
          s.parentNode.insertBefore(p, s);
      })(window, document, "script", "https://cdn.giftup.app/dist/gift-up.js", "giftup");
      </script>
    </div>
  </div>
</section>
```

### Customizing

- **Blend with your background:** change `background:var(--g-dark)` on
  `.g247-gift` to `background:transparent;` if the Elementor section behind it
  is already dark.
- **Different location / GiftUp site:** replace the `data-site-id` value with
  that location's GiftUp site ID and update the heading text.

### Notes

- **The widget needs its `<script>`.** If the gift card checkout doesn't appear
  on the published page, your setup is stripping script tags from HTML widgets:
  move the `<script>…</script>` block into **WPCode / Code Snippets** (set to
  load in the footer of that page) and keep the rest of the snippet in the HTML
  widget.
- The white panel is intentional — GiftUp's checkout is designed for a light
  background.

---

## Any page → "FAQ Accordion"

**Source:** `pages/faq.html`
**Target page:** FAQ (or any page that needs a Q&A section)

A grouped FAQ accordion (Getting Started / Booking & Access / In the Bay /
Memberships & Gift Cards) using native `<details>` elements — no JavaScript at
all, so nothing can be stripped. Cards match the membership snippet's styling;
open items get a green border and the plus icon rotates to an ×.

### Paste this into an Elementor HTML widget

```html
<!-- ============================================================
     24/7 GOLF — FAQ ACCORDION
     Paste into an Elementor "HTML" widget.
     Self-contained: no theme CSS and NO JavaScript (native <details>).
     Font sizes in absolute px so theme root font-size can't shrink them.
     Source: pages/faq.html
     ============================================================ -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@300;400;600;700&family=Barlow+Condensed:wght@500;600;700;800&display=swap" rel="stylesheet">

<style>
  .g247-faq{
    --g-green:#2ecc71; --g-card:#161a20; --g-dark:#0a0a0a;
    --g-border:rgba(255,255,255,.07); --g-white:#f5f7f2;
    background:var(--g-dark); color:var(--g-white);
    padding:64px 5vw; font-size:16px;
    font-family:'Barlow',-apple-system,Segoe UI,Roboto,Arial,sans-serif;
  }
  .g247-faq *{ box-sizing:border-box; }
  .g247-faq__inner{ max-width:860px; margin:0 auto; }
  .g247-faq__group{ margin-bottom:40px; }
  .g247-faq__group:last-child{ margin-bottom:0; }
  .g247-faq__group-title{
    display:inline-flex; align-items:center; gap:10px;
    font-family:'Barlow Condensed',sans-serif; font-size:15px; font-weight:700;
    letter-spacing:3px; text-transform:uppercase; color:var(--g-green); margin-bottom:16px;
  }
  .g247-faq__group-title::before{ content:''; width:28px; height:2px; background:var(--g-green); }
  .g247-faq__item{
    background:var(--g-card); border:1px solid var(--g-border);
    border-radius:8px; margin-bottom:12px; overflow:hidden;
    transition:border-color .25s ease;
  }
  .g247-faq__item[open]{ border-color:rgba(46,204,113,.3); }
  .g247-faq__item summary{
    list-style:none; cursor:pointer;
    display:flex; align-items:center; justify-content:space-between; gap:16px;
    padding:18px 22px; margin:0;
    font-family:'Barlow Condensed',sans-serif; font-size:19px; font-weight:700;
    letter-spacing:.5px; text-transform:uppercase; color:var(--g-white);
  }
  .g247-faq__item summary::-webkit-details-marker{ display:none; }
  .g247-faq__item summary::after{
    content:'+'; flex:0 0 auto; font-family:'Bebas Neue',sans-serif;
    font-size:26px; line-height:1; color:var(--g-green); transition:transform .25s ease;
  }
  .g247-faq__item[open] summary::after{ transform:rotate(45deg); }
  .g247-faq__item summary:hover{ color:var(--g-green); }
  .g247-faq__a{
    padding:0 22px 20px; font-size:17px; font-weight:400;
    color:rgba(245,247,242,.72); line-height:1.7;
  }
  .g247-faq__a a{ color:var(--g-green); }
  @media (max-width:768px){ .g247-faq{ padding:48px 6vw; } }
</style>

<section class="g247-faq">
  <div class="g247-faq__inner">

    <div class="g247-faq__group">
      <div class="g247-faq__group-title">Getting Started</div>
      <details class="g247-faq__item">
        <summary>What is 24/7 Golf?</summary>
        <div class="g247-faq__a">24/7 Golf is Michigan's premier indoor golf experience. Every location features private simulator bays powered by <strong>Trackman iO</strong> — the same launch-monitor technology trusted by Tour professionals — and every location is open <strong>24 hours a day, 7 days a week</strong>. No tee times, no weather, no waiting for daylight.</div>
      </details>
      <details class="g247-faq__item">
        <summary>Do I need to be a good golfer to play?</summary>
        <div class="g247-faq__a">Not at all. Trackman iO works for every skill level — first-timers can play fun games and challenges while experienced players drill down into ball speed, spin, carry and shot shape on every swing. It's a great outing for families, friends and leagues alike.</div>
      </details>
      <details class="g247-faq__item">
        <summary>How much does it cost?</summary>
        <div class="g247-faq__a">Pricing is <strong>per bay, per hour — not per person</strong>. Bring your friends and split one rate. Rates vary by location and time of day; as an example, Ludington is $35/hour per bay on weekdays before 5pm and $50/hour after 5pm and on weekends. See your location's page for exact rates and membership discounts.</div>
      </details>
      <details class="g247-faq__item">
        <summary>Does it cost anything to join?</summary>
        <div class="g247-faq__a">No — creating a 24/7 Golf account is <strong>free</strong> and takes about a minute. You only pay for the bay time you book. Paid memberships are optional and add discounts or free daily play.</div>
      </details>
    </div>

    <div class="g247-faq__group">
      <div class="g247-faq__group-title">Booking &amp; Access</div>
      <details class="g247-faq__item">
        <summary>How do I book a bay?</summary>
        <div class="g247-faq__a">Create a free account, then book through the <strong>24/7 Golf app</strong> (App Store and Google Play) or online. Booking and payment are handled securely through CourtReserve. Pick your location, pick your bay, pick your time — done.</div>
      </details>
      <details class="g247-faq__item">
        <summary>How do I get in at 2am if nobody works there?</summary>
        <div class="g247-faq__a">The <strong>24/7 Golf app unlocks the door and your bay</strong> during your reservation — no staff visit required. Book any time, day or night, and the app is your key.</div>
      </details>
      <details class="g247-faq__item">
        <summary>How far in advance can I book, and can I cancel?</summary>
        <div class="g247-faq__a">Members can typically reserve up to <strong>30 days in advance</strong> and cancel up to <strong>4 hours before</strong> a reservation without penalty. Exact booking windows depend on your membership — details are shown in CourtReserve when you book.</div>
      </details>
    </div>

    <div class="g247-faq__group">
      <div class="g247-faq__group-title">In the Bay</div>
      <details class="g247-faq__item">
        <summary>What is Trackman iO?</summary>
        <div class="g247-faq__a">Trackman iO is a tour-grade, ceiling-mounted launch monitor that tracks every shot with radar-and-camera precision — ball speed, launch, spin, carry and shot shape. It powers full simulated rounds on <strong>250+ world-famous courses</strong>, practice ranges, skills tests, and party games.</div>
      </details>
      <details class="g247-faq__item">
        <summary>Do you have pickleball?</summary>
        <div class="g247-faq__a">Yes — our Ludington location has indoor pickleball courts you can reserve by the hour, year-round. Pickleball memberships with deep hourly discounts are available.</div>
      </details>
    </div>

    <div class="g247-faq__group">
      <div class="g247-faq__group-title">Memberships &amp; Gift Cards</div>
      <details class="g247-faq__item">
        <summary>Do I need a membership to play?</summary>
        <div class="g247-faq__a">No. The free <strong>Player</strong> account lets you book and play at standard hourly rates. Paid memberships add perks like free daily play, discounted rates and multi-location benefits — see your location's page for what's offered there.</div>
      </details>
      <details class="g247-faq__item">
        <summary>Can I buy a gift card?</summary>
        <div class="g247-faq__a">Yes — 24/7 Golf Ludington gift cards are available on the Ludington page, delivered instantly by email and redeemable for bay time.</div>
      </details>
      <details class="g247-faq__item">
        <summary>I have another question — how do I reach you?</summary>
        <div class="g247-faq__a">Call us at <a href="tel:6163509482">616.350.9482</a> or email <a href="mailto:info@24-7golf.com">info@24-7golf.com</a> and we'll get you sorted out.</div>
      </details>
    </div>

  </div>
</section>
```

### Customizing

- **Add / edit a question:** copy any `<details class="g247-faq__item">…</details>`
  block. The question goes in `<summary>`, the answer in the
  `g247-faq__a` div. Groups are the `g247-faq__group` blocks — add or remove
  whole groups the same way.
- **Blend with your background:** change `background:var(--g-dark)` on
  `.g247-faq` to `background:transparent;` if the section behind it is already
  dark.
- **Links inside answers:** the snippet keeps only site-relative-safe links
  (tel/mailto). If you reference other pages (Ludington, locations), use full
  URLs like `https://www.24-7golf.com/ludington`.

### Notes

- **Zero JavaScript** — the open/close behavior is the browser-native
  `<details>` element, so this snippet can never be broken by script
  stripping, and it's keyboard-accessible out of the box.
- **Keep in sync:** mirrors `pages/faq.html`. Two answers there carry
  `<!-- CONFIRM -->` notes (max players per bay, loaner clubs, gift cards at
  other locations) — those questions are omitted here until confirmed. Add
  them once you've verified the facts.
