#!/usr/bin/env node
/* ============================================================
   24/7 Golf — Location Page Generator
   Builds pages/<slug>.html for every location defined in the
   Location Finder (js/location-finder.js), so all location pages
   share the exact same nav + theme as the landing page.

   - Open locations get a full page: hero, book-a-bay, amenities,
     Trackman blurb, other-locations, footer.
   - "Coming Soon" locations get a lightweight teaser page (same
     nav/theme, no booking).
   - Ludington additionally gets a Memberships section (pulled from
     CourtReserve) and a Gift Cards section (GiftUp checkout embed).

   The home page (pages/index.html) and the nav intentionally do NOT
   reference individual locations — only this generator does.

   Regenerate after editing the LOCATIONS data below:
       node scripts/build-location-pages.cjs
   ============================================================ */

const fs = require('fs');
const path = require('path');

const OUT_DIR = path.join(__dirname, '..', 'pages');

/* ── Location data (kept in sync with js/location-finder.js) ───── */
const LOCATIONS = [
  { slug: 'ludington',    name: 'Ludington',    city: 'Ludington, MI',   address1: '5756 US-10',                 address2: 'Ludington, MI 49431',  placeId: 'ChIJ6Wm_J1oRHIgRGa5HyEVqipo', comingSoon: false, pickleball: true },
  { slug: 'grand-rapids', name: 'Grand Rapids', city: 'Comstock Park, MI',address1: '4255 Alpine Ave NW Ste A',  address2: 'Comstock Park, MI 49321',placeId: 'ChIJ-Qj6VGepGYgRHRaYm_eISdc', comingSoon: false, pickleball: false },
  { slug: 'williamsburg', name: 'Williamsburg', city: 'Williamsburg, MI', address1: '6463 US-31',                 address2: 'Williamsburg, MI 49690', placeId: 'ChIJi2EQLwDRH4gRs54otsYyZhQ', comingSoon: false, pickleball: false },
  { slug: 'dewitt',       name: 'Dewitt',       city: 'DeWitt, MI',      address1: '1161 E Clark Rd Ste 136',    address2: 'DeWitt, MI 48820',     placeId: 'ChIJm2XuCM_tIogRvBZqL_HR0y4', comingSoon: false, pickleball: false },
  { slug: 'haslett',      name: 'Haslett',      city: 'Haslett, MI',     address1: '2121 Haslett Rd',            address2: 'Haslett, MI 48840',    placeId: 'ChIJRWHEm1TnIogR8gS666bcjb8', comingSoon: false, pickleball: false },

  { slug: 'traverse-city',name: 'Traverse City',city: 'Traverse City, MI',address1: '972 W South Airport Rd',    address2: 'Traverse City, MI 49686',placeId: 'ChIJy7XQJy_NH4gRNPIsaWZcppU', comingSoon: true,  pickleball: false },
  { slug: 'standale',     name: 'Standale',     city: 'Grand Rapids, MI',address1: '4030 Lake Michigan Dr NW Ste B',address2: 'Grand Rapids, MI 49534',placeId: 'Ej00MDMwIExha2UgTWljaGlnYW4gRHIgTlcgc3VpdGUgYiwgR3JhbmQgUmFwaWRzLCBNSSA0OTUzNCwgVVNBIiMaIQoWChQKEgkjC25dfaUZiBEj-PvsHu_dZBIHc3VpdGUgYg', comingSoon: true, pickleball: false },
  { slug: 'kentwood',     name: 'Kentwood',     city: 'Grand Rapids, MI',address1: '6070 Kalamazoo Ave SE',      address2: 'Grand Rapids, MI 49508', placeId: 'ChIJkbbgtpi0GYgRwOhdwIVC-pI', comingSoon: true,  pickleball: false },
  { slug: 'rockford',     name: 'Rockford',     city: 'Rockford, MI',    address1: '515 E Division St NE',       address2: 'Rockford, MI 49341',   placeId: 'ChIJgXcLMBr_GIgRlVdml3F5rcc', comingSoon: true,  pickleball: false },
  { slug: 'grand-haven',  name: 'Grand Haven',  city: 'Grand Haven, MI', address1: '1830 172nd Ave Ste A',       address2: 'Grand Haven, MI 49417',  placeId: 'EjAxODMwIDE3Mm5kIEF2ZSBzdGUgYSwgR3JhbmQgSGF2ZW4sIE1JIDQ5NDE3LCBVU0EiIRofChYKFAoSCWNRVEoogRmIET80wZOg0ad3EgVzdGUgYQ', comingSoon: true, pickleball: false },
];

/* ── Ludington memberships (from CourtReserve org 10840) ───────── */
const ORG_ID = 10840;
const LUDINGTON_MEMBERSHIPS = [
  { id: 225646, name: 'Player',                  badge: 'Individual', desc: 'Default account type with Ludington as your preferred location.',
    features: ['Free membership — Home Location: Ludington', 'Golf — pricing is per bay; bring your friends and pay one rate', 'Weekdays before 5pm — $35.00 / hour / bay', 'After 5pm & weekends — $50.00 / hour / bay', 'Additional benefits included'] },
  { id: 250843, name: 'Family Player',           badge: 'Family',     desc: 'Default family membership.',
    features: ['Add existing family members — contact ludington@24-7golf.com', 'Reserve up to 30 days in advance', 'Cancel reservations up to 4 hours in advance without penalty'] },
  { id: 250923, name: 'Summer UNLIMITED PLAY',   badge: 'Individual', eff: 'Effective to 9/30/2026', desc: 'Unlimited free play. Membership cannot be canceled.',
    features: ['Home Location: Ludington', '2025 price lock — lock in 2025 winter pricing', 'Contract runs April 1 – September 30', 'UNLIMITED FREE PLAY (home location), limit 1 open booking, no guest fee', 'Additional benefits included'] },
  { id: 251124, name: 'Summer Membership',       badge: 'Individual', eff: 'Effective to 8/31/2026', desc: 'Summer membership for golf and pickleball.',
    features: ['Home Location: Ludington', '60 minutes per day FREE play (golf or pickleball), limit 2 open bookings', '$5.00 off standard golf & pickleball rates', '$20.00 guest fee — golf', 'Additional benefits included'] },
  { id: 212220, name: 'Pickleball Membership',   badge: 'Individual', desc: 'Deep discounts for year-round indoor pickleball play.',
    features: ['Only valid at our Ludington location', '$20.00 per hour for the court — no charge for additional players', '$10.00 per hour summer rate (Apr 1 – Sep 30)', 'Reserve up to 30 days in advance', 'Cancel up to 4 hours in advance without penalty'] },
  { id: 223201, name: 'Family Annual Membership',badge: 'Family',     desc: 'Annual family membership — Ludington pickleball membership included.',
    features: ['Home Location: Ludington', 'Max 3 members per family', '90 minutes per day FREE play (home location)', '90 minutes per day $25.00 per session at all other locations', 'Additional benefits included'] },
];

/* ── Helpers ───────────────────────────────────────────────────── */
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

function directionsUrl(loc) {
  const dest = encodeURIComponent(`${loc.address1}, ${loc.address2}`);
  let url = `https://www.google.com/maps/dir/?api=1&destination=${dest}`;
  if (loc.placeId) url += `&destination_place_id=${encodeURIComponent(loc.placeId)}`;
  return url;
}

function membershipUrl(id) {
  return `https://app.courtreserve.com/Online/Memberships/ViewPublicMembership/${ORG_ID}?membershipId=${id}`;
}

/* ── Shared fragments ──────────────────────────────────────────── */
const head = (loc) => {
  const title = loc.comingSoon
    ? `${loc.name} (Coming Soon) — 24/7 Golf`
    : `24/7 Golf ${loc.name} — Indoor Golf in ${loc.city}`;
  const desc = loc.comingSoon
    ? `24/7 Golf is coming soon to ${loc.city}. Trackman iO indoor golf bays, open 24 hours. Find another location or get the app.`
    : `Trackman iO indoor golf simulator bays at 24/7 Golf ${loc.name}, ${loc.address1}, ${loc.city}. Open 24 hours — no tee times. Book a bay today.`;
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(desc)}">

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&family=Barlow+Condensed:wght@400;500;600;700;800&display=swap" rel="stylesheet">

  <link rel="stylesheet" href="../css/variables.css">
  <link rel="stylesheet" href="../css/base.css">
  <link rel="stylesheet" href="../css/components.css">

  <style>${pageStyles(loc)}</style>
</head>`;
};

const nav = () => `
  <!-- NAVIGATION (shared — no location-specific links) -->
  <nav class="site-nav">
    <a href="index.html" class="nav-logo">
      <img src="../assets/images/web/logo.webp" alt="24/7 Golf Logo">
      <span class="nav-logo-text"><span class="nav-logo-accent">24/7</span> GOLF</span>
    </a>
    <button class="nav-hamburger" aria-label="Open menu" aria-expanded="false">
      <span></span><span></span><span></span>
    </button>
    <ul class="nav-links">
      <li><a href="locations.html">Locations</a></li>
      <li><a href="index.html#how-it-works">How It Works</a></li>
      <li><a href="index.html#app">Get the App</a></li>
      <li><a href="faq.html">FAQ</a></li>
      <li><a href="index.html#create-account" class="nav-cta">Book Now</a></li>
    </ul>
  </nav>`;

const footer = () => `
  <!-- FOOTER -->
  <footer class="site-footer">
    <div class="footer-grid">
      <div>
        <a href="index.html" class="footer-brand-logo">
          <img src="../assets/images/web/logo.webp" alt="24/7 Golf">
          <span>24/7 GOLF</span>
        </a>
        <p class="footer-tagline">
          Michigan's premier indoor golf experience — powered by Trackman iO technology.
          Open 24 hours. No tee times required.
        </p>
      </div>
      <div>
        <div class="footer-col-title">Explore</div>
        <div class="footer-links">
          <a href="index.html#how-it-works">How It Works</a>
          <a href="index.html#app">Get the App</a>
          <a href="locations.html">Find a Location</a>
          <a href="index.html#create-account">Create Account</a>
          <a href="faq.html">FAQ</a>
        </div>
      </div>
      <div>
        <div class="footer-col-title">Contact</div>
        <div class="footer-links">
          <a href="tel:6163509482">616.350.9482</a>
          <a href="mailto:info@24-7golf.com">info@24-7golf.com</a>
          <a href="index.html#create-account">Book a Bay</a>
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      <p class="footer-copy">&copy; 2026 24/7 Golf. All rights reserved.</p>
      <div class="footer-social">
        <a href="https://www.facebook.com/247GolfGR" class="social-icon" title="Facebook" aria-label="Facebook">f</a>
        <a href="#" class="social-icon" title="Instagram" aria-label="Instagram">in</a>
        <a href="#" class="social-icon" title="TikTok" aria-label="TikTok">tt</a>
      </div>
    </div>
  </footer>`;

const crResizeScript = () => `
  <!-- CourtReserve iframe resize listener -->
  <script>
    (function () {
      var m = window.addEventListener ? 'addEventListener' : 'attachEvent';
      var l = window[m];
      var msg = m === 'attachEvent' ? 'onmessage' : 'message';
      l(msg, function (e) {
        if (!e.data || !e.data.action) return;
        switch (e.data.action) {
          case 'setHeight': {
            var id = e.data.embedCodeId;
            if (id) {
              var els = document.getElementsByClassName('form-iframe-' + id);
              for (var i = 0; i < els.length; i++) els[i].style.height = e.data.height + 'px';
            } else {
              var el = document.getElementById('form-iframe');
              if (el) el.style.height = e.data.height + 'px';
            }
            break;
          }
          case 'redirectAfterLogin':
            setTimeout(function () { window.location.href = e.data.urlToRedirect; }, 100);
            break;
          case 'scrollBottom':
            if (e.data.scrollHeight) window.scrollTo(0, e.data.scrollHeight);
            break;
          case 'scrollTop':
            window.scrollTo(0, 0);
            break;
        }
      }, false);
    })();
  </script>`;

/* ── Section builders ──────────────────────────────────────────── */
function otherLocations(current) {
  const rows = LOCATIONS.filter((l) => l.slug !== current.slug).map((l) => `
        <a href="${l.slug}.html" class="location-row reveal">
          <span class="location-row-name">${esc(l.name)}</span>
          <span class="location-row-city">${esc(l.city)}</span>
          <span class="location-row-tags">
            <span class="tag ${l.comingSoon ? 'tag-gold' : ''}">${l.comingSoon ? 'Coming Soon' : 'Open 24 Hours'}</span>
          </span>
          <span class="location-row-arrow">&rarr;</span>
        </a>`).join('');
  return `
  <!-- OTHER LOCATIONS -->
  <section class="section section-dark">
    <div class="container">
      <div class="section-header center reveal">
        <div class="section-label" style="justify-content:center;">More 24/7 Golf</div>
        <h2 class="loc-h2" style="text-align:center;">Other Locations</h2>
      </div>
      <div class="other-locations">${rows}
      </div>
    </div>
  </section>`;
}

function membershipsSection() {
  const cards = LUDINGTON_MEMBERSHIPS.map((m) => {
    const badge = `<span class="tag ${m.badge === 'Family' ? 'tag-gold' : ''}">${esc(m.badge)}</span>`;
    const eff = m.eff ? `<span class="tag tag-muted">${esc(m.eff)}</span>` : '';
    const feats = m.features.map((f) => `              <li>${esc(f)}</li>`).join('\n');
    return `
        <article class="mem-card reveal">
          <div class="mem-card-badges">${badge}${eff}</div>
          <h3 class="mem-card-title">${esc(m.name)}</h3>
          <p class="mem-card-desc">${esc(m.desc)}</p>
          <ul class="mem-card-features">
${feats}
          </ul>
          <a class="btn btn-primary mem-card-btn" href="${membershipUrl(m.id)}" target="_blank" rel="noopener">Learn More &amp; Join</a>
        </article>`;
  }).join('\n');
  return `
  <!-- MEMBERSHIPS (Ludington) -->
  <section id="memberships" class="section">
    <div class="container">
      <div class="section-header center reveal">
        <div class="section-label" style="justify-content:center;">Ludington Memberships</div>
        <h2 class="loc-h2" style="text-align:center;">Choose Your Membership</h2>
        <p class="loc-lead" style="margin:0 auto;text-align:center;">
          Pick the membership that fits your game. Sign up online in minutes — pricing and
          checkout are handled securely through CourtReserve.
        </p>
      </div>
      <div class="mem-grid">${cards}
      </div>
    </div>
  </section>`;
}

function giftCardsSection() {
  return `
  <!-- GIFT CARDS (Ludington — GiftUp) -->
  <section id="gift-cards" class="section section-dark">
    <div class="container">
      <div class="section-header center reveal">
        <div class="section-label" style="justify-content:center;">The Perfect Gift</div>
        <h2 class="loc-h2" style="text-align:center;">24/7 Golf Ludington Gift Cards</h2>
        <p class="loc-lead" style="margin:0 auto;text-align:center;">
          Give the gift of indoor golf. Buy a gift card for 24/7 Golf Ludington below —
          delivered instantly by email and redeemable for bay time.
        </p>
      </div>
      <div class="giftup-wrapper reveal">
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
  </section>`;
}

function bookSection(loc) {
  const amenities = [
    { icon: '🎯', h: 'Trackman iO Bays', p: 'Tour-grade launch monitors in every bay — ball speed, spin, carry and shot shape on every swing.' },
    { icon: '🕐', h: 'Open 24 Hours', p: 'Book any time, day or night. The 24/7 Golf app unlocks your bay — no staff visit required.' },
    { icon: '⛳', h: '250+ Virtual Courses', p: 'Play Augusta to St. Andrews, run practice ranges, or compete in games and challenges.' },
  ];
  if (loc.pickleball) amenities.push({ icon: '🏓', h: 'Pickleball', p: 'Indoor pickleball courts available at this location — reserve by the hour, year-round.' });
  const amenityCards = amenities.map((a) => `
        <div class="amenity-card reveal">
          <div class="amenity-icon">${a.icon}</div>
          <h3>${esc(a.h)}</h3>
          <p>${esc(a.p)}</p>
        </div>`).join('');

  return `
  <!-- BOOK A BAY -->
  <section id="book" class="section section-dark">
    <div class="container">
      <div class="account-layout">
        <div class="reveal">
          <div class="section-label">Book a Bay</div>
          <h2 class="loc-h2">Reserve Your Tee Time in ${esc(loc.name)}</h2>
          <p class="loc-lead">
            Create your free 24/7 Golf account to book a Trackman iO bay at our ${esc(loc.name)} location.
            Already a member? Open the app to reserve and unlock your bay.
          </p>
          <div class="hero-actions" style="margin-top:var(--space-md);">
            <a href="#book-widget" class="btn btn-primary">Create Free Account</a>
            <a href="${esc(directionsUrl(loc))}" target="_blank" rel="noopener" class="btn btn-outline">Get Directions</a>
          </div>
          <div class="loc-info">
            <div class="loc-info-row"><span class="loc-info-k">Address</span><span>${esc(loc.address1)}, ${esc(loc.address2)}</span></div>
            <div class="loc-info-row"><span class="loc-info-k">Hours</span><span>Open 24 Hours · 7 Days a Week</span></div>
            <div class="loc-info-row"><span class="loc-info-k">Access</span><span>App-unlocked bays — no staff needed</span></div>
          </div>
        </div>

        <div id="book-widget" class="reveal reveal-delay-2">
          <div class="widget-wrapper">
            <div class="widget-header">⛳ Create Your Free Account</div>
            <iframe
              id="form-iframe"
              class="form-iframe-47632"
              src="https://widgets.courtreserve.com/Online/Public/EmbedCode/10840/47632"
              style="margin:0; width:100%; border:none; overflow:hidden;"
              scrolling="no"
              title="Create a free 24/7 Golf account">
            </iframe>
          </div>
        </div>
      </div>

      <div class="amenities-grid">${amenityCards}
      </div>
    </div>
  </section>`;
}

function trackmanSection() {
  return `
  <!-- TRACKMAN iO -->
  <section class="section">
    <div class="container">
      <div class="why-layout">
        <div class="reveal">
          <div class="section-label">Trackman iO</div>
          <h2 class="loc-h2">Tour-Grade Tech in Every Bay</h2>
          <p class="loc-lead">
            Every bay is powered by Trackman iO — the same launch-monitor technology trusted by
            Tour professionals and coaches worldwide. Get instant, accurate data on every shot,
            then play full rounds on 250+ world-famous courses.
          </p>
          <div class="hero-actions" style="margin-top:var(--space-md);">
            <a href="index.html#how-it-works" class="btn btn-outline">How It Works</a>
            <a href="index.html#app" class="btn btn-outline">Get the App</a>
          </div>
        </div>
        <div class="why-image reveal reveal-delay-2">
          <img src="../assets/images/web/feature-sim-bay.webp" alt="Trackman iO simulator bay at 24/7 Golf" loading="lazy">
          <div class="why-image-overlay"></div>
          <div class="why-image-caption"><em>Trackman iO Technology</em>Play Any Course, Any Time</div>
        </div>
      </div>
    </div>
  </section>`;
}

/* ── Page assembly ─────────────────────────────────────────────── */
function fullPage(loc) {
  const isLud = loc.slug === 'ludington';
  return `${head(loc)}
<body>
${nav()}

  <!-- HERO -->
  <section class="hero loc-hero">
    <div class="hero-bg loc-hero-bg"></div>
    <div class="hero-grid-overlay"></div>
    <div class="hero-content">
      <div class="hero-eyebrow">24/7 Golf · ${esc(loc.city)}</div>
      <h1>24/7 Golf<em>${esc(loc.name)}</em></h1>
      <p class="hero-sub">
        Trackman iO indoor golf bays at ${esc(loc.address1)}, ${esc(loc.city)}.
        Open 24 hours a day — book a bay whenever it suits you.
      </p>
      <div class="hero-actions">
        <a href="#book" class="btn btn-primary">Book a Bay</a>
        <a href="${esc(directionsUrl(loc))}" target="_blank" rel="noopener" class="btn btn-outline">Get Directions</a>
      </div>
      <div class="hero-stats">
        <div class="hero-stat"><div class="hero-stat-num">24/7</div><div class="hero-stat-label">Always Open</div></div>
        <div class="hero-stat"><div class="hero-stat-num">250+</div><div class="hero-stat-label">Virtual Courses</div></div>
        <div class="hero-stat"><div class="hero-stat-num">FREE</div><div class="hero-stat-label">To Join</div></div>
      </div>
    </div>
  </section>

${bookSection(loc)}
${trackmanSection()}${isLud ? `\n${membershipsSection()}\n${giftCardsSection()}` : ''}
${otherLocations(loc)}

  <!-- FOOTER CTA -->
  <section class="footer-cta">
    <div class="footer-cta-inner reveal">
      <div class="section-label" style="justify-content:center;">Ready to Play?</div>
      <h2>Play in <em>${esc(loc.name)}</em></h2>
      <p>Create your free account in 60 seconds and book your first bay at 24/7 Golf ${esc(loc.name)}.</p>
      <div class="cta-buttons">
        <a href="#book" class="btn btn-primary">Book a Bay</a>
        <a href="locations.html" class="btn btn-outline">All Locations</a>
      </div>
    </div>
  </section>

${footer()}
${crResizeScript()}
  <script src="../js/main.js"></script>
</body>
</html>
`;
}

function comingSoonPage(loc) {
  return `${head(loc)}
<body>
${nav()}

  <!-- HERO -->
  <section class="hero loc-hero">
    <div class="hero-bg loc-hero-bg"></div>
    <div class="hero-grid-overlay"></div>
    <div class="hero-content">
      <div class="hero-eyebrow" style="color:var(--gold);">Coming Soon · ${esc(loc.city)}</div>
      <h1>24/7 Golf<em>${esc(loc.name)}</em></h1>
      <p class="hero-sub">
        We're bringing Trackman iO indoor golf to ${esc(loc.city)}. A brand-new 24/7 Golf is on
        the way at ${esc(loc.address1)} — open 24 hours, no tee times, year-round play.
      </p>
      <div class="hero-actions">
        <a href="index.html#app" class="btn btn-primary">Get the App</a>
        <a href="${esc(directionsUrl(loc))}" target="_blank" rel="noopener" class="btn btn-outline">View on Map</a>
      </div>
    </div>
  </section>

  <!-- WHAT TO EXPECT -->
  <section class="section section-dark">
    <div class="container">
      <div class="section-header center reveal">
        <div class="section-label" style="justify-content:center;">What to Expect</div>
        <h2 class="loc-h2" style="text-align:center;">Indoor Golf, Coming to ${esc(loc.name)}</h2>
      </div>
      <div class="amenities-grid">
        <div class="amenity-card reveal"><div class="amenity-icon">🎯</div><h3>Trackman iO Bays</h3><p>Tour-grade launch monitors — accurate data on every swing.</p></div>
        <div class="amenity-card reveal"><div class="amenity-icon">🕐</div><h3>Open 24 Hours</h3><p>App-unlocked bays, available any time of day or night.</p></div>
        <div class="amenity-card reveal"><div class="amenity-icon">⛳</div><h3>250+ Courses</h3><p>Play world-famous courses, practice ranges, games and more.</p></div>
      </div>
      <div style="text-align:center;margin-top:var(--space-lg);">
        <a href="index.html#app" class="btn btn-primary">Download the App to Be First In</a>
      </div>
    </div>
  </section>

${otherLocations(loc)}

  <!-- FOOTER CTA -->
  <section class="footer-cta">
    <div class="footer-cta-inner reveal">
      <div class="section-label" style="justify-content:center;">Can't Wait?</div>
      <h2>Play at a Nearby <em>24/7 Golf</em></h2>
      <p>Our other Michigan locations are open right now. Create a free account and book today.</p>
      <div class="cta-buttons">
        <a href="locations.html" class="btn btn-primary">Find a Location</a>
        <a href="index.html#create-account" class="btn btn-outline">Create Account</a>
      </div>
    </div>
  </section>

${footer()}
  <script src="../js/main.js"></script>
</body>
</html>
`;
}

/* ── Page-specific styles ──────────────────────────────────────── */
function pageStyles(loc) {
  const isLud = loc.slug === 'ludington';
  const base = `
    .loc-hero { min-height: 78vh; }
    .loc-hero-bg {
      background-image:
        linear-gradient(160deg, rgba(10,10,10,0.92) 0%, rgba(10,10,10,0.55) 60%, rgba(10,10,10,0.9) 100%),
        url('../assets/images/web/hero-swing-dark.webp');
    }
    .hero-grid-overlay {
      position:absolute; inset:0; z-index:1;
      background-image:
        linear-gradient(rgba(46,204,113,0.04) 1px, transparent 1px),
        linear-gradient(90deg, rgba(46,204,113,0.04) 1px, transparent 1px);
      background-size:60px 60px;
    }
    .hero-eyebrow { display:inline-flex; align-items:center; gap:10px; font-family:var(--font-condensed); font-size:0.85rem; font-weight:700; letter-spacing:3px; text-transform:uppercase; color:var(--green); margin-bottom:20px; }
    .hero-eyebrow::before { content:''; display:block; width:36px; height:2px; background:currentColor; }
    .hero h1 { font-size:clamp(3rem,8vw,7rem); line-height:0.92; margin-bottom:8px; }
    .hero h1 em { font-style:normal; color:var(--green); display:block; }
    .hero-sub { font-size:clamp(1rem,2vw,1.2rem); font-weight:300; color:rgba(255,255,255,0.75); max-width:560px; margin:18px 0 32px; line-height:1.65; }
    .hero-actions { display:flex; gap:16px; flex-wrap:wrap; }
    .hero-stats { display:flex; flex-wrap:wrap; gap:24px 44px; margin-top:var(--space-lg); padding-top:var(--space-md); border-top:1px solid var(--border); max-width:600px; }
    .hero-stat-num { font-family:var(--font-display); font-size:2.4rem; color:var(--green); line-height:1; }
    .hero-stat-label { font-family:var(--font-condensed); font-size:0.8rem; letter-spacing:2px; text-transform:uppercase; color:var(--muted); margin-top:2px; }

    .section-label { display:inline-flex; align-items:center; gap:10px; font-family:var(--font-condensed); font-size:0.8rem; font-weight:700; letter-spacing:3px; text-transform:uppercase; color:var(--green); margin-bottom:14px; }
    .section-label::before { content:''; display:block; width:28px; height:2px; background:currentColor; }
    .loc-h2 { font-family:var(--font-display); font-size:clamp(2.4rem,5vw,4.2rem); letter-spacing:2px; line-height:1; margin-bottom:16px; }
    .loc-lead { font-size:1.05rem; font-weight:300; color:rgba(255,255,255,0.65); max-width:540px; line-height:1.7; }

    /* Book layout (reuses landing-page account styles) */
    .account-layout { display:grid; grid-template-columns:1fr 1fr; gap:var(--space-xl); align-items:start; }
    .loc-info { margin-top:var(--space-md); display:flex; flex-direction:column; gap:10px; }
    .loc-info-row { display:flex; gap:14px; padding:12px 16px; background:rgba(255,255,255,0.02); border-left:3px solid var(--green); border-radius:var(--radius-sm); font-size:0.92rem; color:rgba(255,255,255,0.8); }
    .loc-info-k { font-family:var(--font-condensed); font-weight:700; letter-spacing:1px; text-transform:uppercase; color:var(--green); min-width:80px; }
    .widget-wrapper { background:rgba(255,255,255,0.97); border-radius:var(--radius-lg); overflow:hidden; box-shadow:0 24px 60px rgba(0,0,0,0.5); }
    .widget-header { background:var(--green); padding:18px 24px; font-family:var(--font-display); font-size:1.4rem; letter-spacing:2px; color:var(--black); display:flex; align-items:center; gap:10px; }
    @media (max-width:1024px){ .account-layout{ grid-template-columns:1fr; } }

    /* Amenities */
    .amenities-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); gap:18px; margin-top:var(--space-xl); }
    .amenity-card { background:var(--card); border:1px solid var(--border); border-radius:var(--radius-md); padding:var(--space-md); transition:border-color var(--transition-base), transform var(--transition-base); }
    .amenity-card:hover { border-color:var(--border-hover); transform:translateY(-3px); }
    .amenity-icon { font-size:1.6rem; margin-bottom:10px; }
    .amenity-card h3 { font-family:var(--font-condensed); font-size:1.05rem; font-weight:700; letter-spacing:1px; text-transform:uppercase; margin-bottom:6px; }
    .amenity-card p { font-size:0.9rem; font-weight:300; color:rgba(255,255,255,0.6); line-height:1.6; }

    /* Why/Trackman layout */
    .why-layout { display:grid; grid-template-columns:1fr 1fr; gap:var(--space-xl); align-items:center; }
    .why-image { border-radius:var(--radius-lg); overflow:hidden; aspect-ratio:4/5; position:relative; background:linear-gradient(160deg,#0d200f,#0a1510,#0e1a12); }
    .why-image img { width:100%; height:100%; object-fit:cover; display:block; }
    .why-image-overlay { position:absolute; inset:0; background:linear-gradient(180deg, transparent 60%, rgba(10,10,10,0.85) 100%); }
    .why-image-caption { position:absolute; bottom:24px; left:24px; right:24px; font-family:var(--font-display); font-size:1.5rem; letter-spacing:2px; }
    .why-image-caption em { font-style:normal; color:var(--green); display:block; font-family:var(--font-condensed); font-size:0.95rem; font-weight:600; letter-spacing:2px; text-transform:uppercase; margin-bottom:4px; }
    @media (max-width:1024px){ .why-layout{ grid-template-columns:1fr; } .why-image{ aspect-ratio:16/9; } }

    /* Other locations */
    .other-locations { display:flex; flex-direction:column; gap:12px; max-width:820px; margin:0 auto; }

    /* Footer CTA */
    .footer-cta { background:linear-gradient(135deg,#0d200f 0%, #0a0a0a 100%); text-align:center; padding:clamp(64px,10vw,100px) 5vw; position:relative; overflow:hidden; }
    .footer-cta::before { content:''; position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); width:700px; height:700px; border-radius:50%; background:radial-gradient(circle, rgba(46,204,113,0.08) 0%, transparent 65%); pointer-events:none; }
    .footer-cta-inner { position:relative; z-index:2; }
    .footer-cta h2 { font-family:var(--font-display); font-size:clamp(2.5rem,6vw,5rem); letter-spacing:3px; line-height:1; margin-bottom:18px; }
    .footer-cta h2 em { font-style:normal; color:var(--green); }
    .footer-cta p { font-size:1.05rem; font-weight:300; color:rgba(255,255,255,0.6); max-width:480px; margin:0 auto 32px; line-height:1.7; }
    .cta-buttons { display:flex; gap:16px; justify-content:center; flex-wrap:wrap; }`;

  if (!isLud) return base;

  const lud = `

    /* Memberships */
    .mem-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(290px,1fr)); gap:20px; margin-top:var(--space-lg); align-items:stretch; }
    .mem-card { display:flex; flex-direction:column; background:var(--card); border:1px solid var(--border); border-radius:var(--radius-md); padding:var(--space-md); transition:border-color var(--transition-base), transform var(--transition-base), box-shadow var(--transition-base); }
    .mem-card:hover { border-color:var(--border-hover); transform:translateY(-4px); box-shadow:var(--shadow-card); }
    .mem-card-badges { display:flex; flex-wrap:wrap; gap:8px; margin-bottom:14px; }
    .mem-card-title { font-family:var(--font-condensed); font-size:1.3rem; font-weight:700; letter-spacing:0.5px; text-transform:uppercase; margin-bottom:8px; }
    .mem-card-desc { font-size:0.9rem; font-weight:300; color:rgba(255,255,255,0.6); line-height:1.55; margin-bottom:18px; }
    .mem-card-features { list-style:none; padding:0; margin:0 0 22px; flex:1 1 auto; }
    .mem-card-features li { position:relative; padding:0 0 0 26px; margin-bottom:11px; font-size:0.9rem; color:rgba(255,255,255,0.78); line-height:1.45; }
    .mem-card-features li::before { content:''; position:absolute; left:0; top:3px; width:16px; height:16px; border-radius:50%; background:var(--green);
      -webkit-mask:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path fill='white' d='M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z'/></svg>") center/13px no-repeat;
      mask:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path fill='white' d='M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z'/></svg>") center/13px no-repeat; }
    .mem-card-btn { margin-top:auto; justify-content:center; }

    /* Gift cards (GiftUp) */
    .giftup-wrapper { background:rgba(255,255,255,0.97); border-radius:var(--radius-lg); padding:clamp(18px,3vw,32px); box-shadow:0 24px 60px rgba(0,0,0,0.5); margin-top:var(--space-lg); min-height:320px; }`;

  return base + lud;
}

/* ── Run ───────────────────────────────────────────────────────── */
let count = 0;
for (const loc of LOCATIONS) {
  const html = loc.comingSoon ? comingSoonPage(loc) : fullPage(loc);
  fs.writeFileSync(path.join(OUT_DIR, `${loc.slug}.html`), html);
  count++;
  console.log(`  ${loc.comingSoon ? 'soon ' : 'full '} pages/${loc.slug}.html`);
}
console.log(`\nGenerated ${count} location pages.`);
