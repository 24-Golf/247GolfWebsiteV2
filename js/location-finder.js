/* ============================================================
   24/7 Golf — Location Finder
   Custom finder for pages/locations.html.

   Why custom: Google's <gmpx-store-locator> "Locator Plus" widget
   renders the open/closed badge with the Maps JS isOpen() method,
   which mis-evaluates "open 24 hours" places (an open period with no
   close time) and shows them as "Closed" — even though the Places API
   reports open_now: true. We hit that on every 24/7 location, so this
   builds the finder ourselves from the hard-coded data below: a list +
   a map with markers + a details panel, with the open status under our
   control.

   The CONFIGURATION object keeps the Quick Builder shape so the same
   locations can be reused. A self-contained copy of this finder for
   WordPress lives in LocationFinder/wordpress-embed.html (see
   docs/location-finder-wordpress.md) — keep the two location lists in
   sync. When the site moves to the data-driven WordPress model
   (ROADMAP.md §3–4), this list is replaced by the Locations CPT.
   ============================================================ */

const CONFIGURATION = {
  "locations": [
    { "title": "24/7 Golf - Ludington", "address1": "5756 US-10", "address2": "Ludington, MI 49431, USA", "coords": { "lat": 43.957528203572636, "lng": -86.42327952209014 }, "placeId": "ChIJ6Wm_J1oRHIgRGa5HyEVqipo", "actions": [{ "label": "Book", "defaultUrl": "https://24-7golf.com/ludington" }] },
    { "title": "24/7 Golf - Grand Rapids", "address1": "4255 Alpine Ave NW Ste A", "address2": "Comstock Park, MI 49321, USA", "coords": { "lat": 43.041798348646026, "lng": -85.69027300674593 }, "placeId": "ChIJ-Qj6VGepGYgRHRaYm_eISdc", "actions": [{ "label": "Book", "defaultUrl": "https://24-7golf.com/grand-rapids" }] },
    { "title": "24/7 Golf - Williamsburg", "address1": "6463 US-31", "address2": "Williamsburg, MI 49690, USA", "coords": { "lat": 44.77974381100765, "lng": -85.4969684932541 }, "placeId": "ChIJi2EQLwDRH4gRs54otsYyZhQ", "actions": [{ "label": "Book", "defaultUrl": "https://24-7golf.com/traverse-city" }] },
    { "title": "24/7 Golf - Dewitt", "address1": "1161 E Clark Rd Ste 136", "address2": "DeWitt, MI 48820, USA", "coords": { "lat": 42.81466649356487, "lng": -84.54158496441804 }, "placeId": "ChIJm2XuCM_tIogRvBZqL_HR0y4", "actions": [{ "label": "Book", "defaultUrl": "https://24-7golf.com/lansing" }] },
    { "title": "24/7 Golf - Haslett", "address1": "2121 Haslett Rd", "address2": "Haslett, MI 48840, USA", "coords": { "lat": 42.74670035597035, "lng": -84.4270352490738 }, "placeId": "ChIJRWHEm1TnIogR8gS666bcjb8", "actions": [{ "label": "Book", "defaultUrl": "https://24-7golf.com/haslett" }] },
    { "title": "24/7 Golf - Traverse City (COMING SOON)", "address1": "972 W South Airport Rd", "address2": "Traverse City, MI 49686, USA", "coords": { "lat": 44.73375354579127, "lng": -85.59453066441803 }, "placeId": "ChIJy7XQJy_NH4gRNPIsaWZcppU" },
    { "title": "24/7 Golf - Standale (COMING SOON)", "address1": "4030 Lake Michigan Dr NW suite b", "address2": "Grand Rapids, MI 49534, USA", "coords": { "lat": 42.971868303512856, "lng": -85.76721983558198 }, "placeId": "Ej00MDMwIExha2UgTWljaGlnYW4gRHIgTlcgc3VpdGUgYiwgR3JhbmQgUmFwaWRzLCBNSSA0OTUzNCwgVVNBIiMaIQoWChQKEgkjC25dfaUZiBEj-PvsHu_dZBIHc3VpdGUgYg" },
    { "title": "24/7 Golf - Kentwood (COMING SOON)", "address1": "6070 Kalamazoo Ave SE", "address2": "Grand Rapids, MI 49508, USA", "coords": { "lat": 42.853196463356284, "lng": -85.62399916441802 }, "placeId": "ChIJkbbgtpi0GYgRwOhdwIVC-pI" },
    { "title": "24/7 Golf - Rockford (COMING SOON)", "address1": "515 E Division St NE", "address2": "Rockford, MI 49341, USA", "coords": { "lat": 43.11932952057435, "lng": -85.54644584907379 }, "placeId": "ChIJgXcLMBr_GIgRlVdml3F5rcc" },
    { "title": "24/7 Golf - Grand Haven (COMING SOON)", "address1": "1830 172nd Ave ste a", "address2": "Grand Haven, MI 49417, USA", "coords": { "lat": 43.04240748803507, "lng": -86.21402856441803 }, "placeId": "EjAxODMwIDE3Mm5kIEF2ZSBzdGUgYSwgR3JhbmQgSGF2ZW4sIE1JIDQ5NDE3LCBVU0EiIRofChYKFAoSCWNRVEoogRmIET80wZOg0ad3EgVzdGUgYQ" }
  ],
  "mapOptions": { "center": { "lat": 44.3, "lng": -85.6 }, "fullscreenControl": true, "mapTypeControl": false, "streetViewControl": false, "zoom": 7, "zoomControl": true, "maxZoom": 17, "mapId": "DEMO_MAP_ID" },
  "mapsApiKey": "AIzaSyBlnmn-NqT_J77I1MQ_i7IuT9cDsrAQBps",
  "capabilities": { "input": true, "autocomplete": true, "directions": true, "distanceMatrix": true, "details": true, "actions": true }
};

/* ── Brand colors (kept in sync with css/variables.css) ── */
const COLOR_OPEN = '#2ecc71';
const COLOR_SOON = '#c9a84c';

/* ── Helpers ─────────────────────────────────────────────── */

// A location is "coming soon" if its title says so (and it has no booking action).
function isComingSoon(loc) {
  return /coming soon/i.test(loc.title) || !(loc.actions && loc.actions.length);
}

// Strip the "24/7 Golf - " prefix and the "(COMING SOON)" suffix for display.
function shortName(loc) {
  return loc.title
    .replace(/^24\/7 Golf\s*-\s*/i, '')
    .replace(/\s*\(coming soon\)\s*/i, '')
    .trim();
}

function bookingUrl(loc) {
  return loc.actions && loc.actions[0] ? loc.actions[0].defaultUrl : null;
}

function directionsUrl(loc) {
  const dest = encodeURIComponent(`${loc.address1}, ${loc.address2}`);
  let url = `https://www.google.com/maps/dir/?api=1&destination=${dest}`;
  if (loc.placeId) url += `&destination_place_id=${encodeURIComponent(loc.placeId)}`;
  return url;
}

// Great-circle distance in miles (for "nearest" sorting / "X mi away").
function distanceMiles(a, b) {
  const toRad = (d) => (d * Math.PI) / 180;
  const R = 3958.8;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));
}

// Wait until the <gmpx-api-loader> has bootstrapped google.maps.importLibrary.
async function waitForMapsApi() {
  await customElements.whenDefined('gmpx-api-loader');
  const start = Date.now();
  while (!(window.google && google.maps && google.maps.importLibrary)) {
    if (Date.now() - start > 10000) throw new Error('Google Maps API failed to load.');
    await new Promise((r) => setTimeout(r, 50));
  }
}

/* ── Finder ──────────────────────────────────────────────── */

async function initLocationFinder() {
  const listEl = document.getElementById('finder-list');
  const mapEl = document.getElementById('finder-map');
  const searchEl = document.getElementById('finder-search');
  const nearEl = document.getElementById('finder-near');
  if (!listEl || !mapEl) return; // not on the finder page

  const locations = CONFIGURATION.locations.map((loc, i) => ({ ...loc, index: i }));

  await waitForMapsApi();
  const { Map, InfoWindow } = await google.maps.importLibrary('maps');
  const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary('marker');

  const map = new Map(mapEl, {
    center: CONFIGURATION.mapOptions.center,
    zoom: CONFIGURATION.mapOptions.zoom,
    mapId: CONFIGURATION.mapOptions.mapId || 'DEMO_MAP_ID',
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: true,
  });

  const infoWindow = new InfoWindow();
  const markers = {};
  const cards = {};

  function infoContent(loc) {
    const soon = isComingSoon(loc);
    const status = soon ? 'Coming Soon' : 'Open 24 Hours';
    const book = bookingUrl(loc);
    return `
      <div style="font-family:Arial,sans-serif;max-width:240px;color:#212121;">
        <div style="font-weight:700;font-size:15px;margin-bottom:2px;">${esc(shortName(loc))}</div>
        <div style="color:${soon ? COLOR_SOON : COLOR_OPEN};font-size:12px;font-weight:700;margin-bottom:6px;">${status}</div>
        <div style="font-size:13px;line-height:1.4;">${esc(loc.address1)}<br>${esc(loc.address2)}</div>
        <div style="margin-top:8px;display:flex;gap:8px;font-size:13px;">
          <a href="${directionsUrl(loc)}" target="_blank" rel="noopener">Directions</a>
          ${book ? `<a href="${esc(book)}" target="_blank" rel="noopener">Book</a>` : ''}
        </div>
      </div>`;
  }

  function select(loc, { pan = true } = {}) {
    // Highlight the active card.
    Object.values(cards).forEach((c) => c.classList.remove('active'));
    const card = cards[loc.index];
    if (card) {
      card.classList.add('active');
      card.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
    // Open the info window on the marker.
    const marker = markers[loc.index];
    if (marker) {
      infoWindow.setContent(infoContent(loc));
      infoWindow.open({ map, anchor: marker });
      if (pan) {
        map.panTo(loc.coords);
        if (map.getZoom() < 10) map.setZoom(11);
      }
    }
  }

  // Build a marker per location.
  locations.forEach((loc) => {
    const soon = isComingSoon(loc);
    const pin = new PinElement({
      background: soon ? COLOR_SOON : COLOR_OPEN,
      borderColor: '#0a0a0a',
      glyphColor: '#0a0a0a',
    });
    const marker = new AdvancedMarkerElement({
      map,
      position: loc.coords,
      title: shortName(loc),
      content: pin.element,
      gmpClickable: true,
    });
    marker.addListener('gmp-click', () => select(loc, { pan: true }));
    markers[loc.index] = marker;
  });

  // Render the location cards.
  function render(list) {
    listEl.innerHTML = '';
    if (!list.length) {
      listEl.innerHTML = `<div class="finder-empty">No locations match “${esc(searchEl ? searchEl.value : '')}”.</div>`;
      return;
    }
    list.forEach((loc) => {
      const soon = isComingSoon(loc);
      const book = bookingUrl(loc);
      const card = document.createElement('div');
      card.className = 'loc-card';
      card.tabIndex = 0;
      card.innerHTML = `
        <div class="loc-card-head">
          <h3 class="loc-card-name">${esc(shortName(loc))}</h3>
          <span class="loc-pill ${soon ? 'loc-pill-soon' : 'loc-pill-open'}">${soon ? 'Coming Soon' : 'Open 24 Hours'}</span>
        </div>
        <div class="loc-card-addr">${esc(loc.address1)}<br>${esc(loc.address2)}</div>
        ${loc.distance != null ? `<div class="loc-card-dist">${loc.distance.toFixed(1)} mi away</div>` : ''}
        <div class="loc-card-actions">
          <a class="loc-btn loc-btn-outline" href="${directionsUrl(loc)}" target="_blank" rel="noopener">Directions</a>
          ${book ? `<a class="loc-btn loc-btn-primary" href="${esc(book)}" target="_blank" rel="noopener">Book</a>` : ''}
        </div>`;
      const open = () => select(loc);
      card.addEventListener('click', (e) => { if (e.target.tagName !== 'A') open(); });
      card.addEventListener('keydown', (e) => { if (e.key === 'Enter') open(); });
      listEl.appendChild(card);
      cards[loc.index] = card;
    });
  }

  render(locations);

  // Text filter by name / city.
  if (searchEl) {
    searchEl.addEventListener('input', () => {
      const q = searchEl.value.trim().toLowerCase();
      const filtered = locations.filter((loc) =>
        !q || (shortName(loc) + ' ' + loc.address1 + ' ' + loc.address2).toLowerCase().includes(q)
      );
      render(filtered);
    });
  }

  // "Use my location" → sort by distance and show "X mi away".
  if (nearEl) {
    nearEl.addEventListener('click', () => {
      if (!navigator.geolocation) return;
      nearEl.disabled = true;
      nearEl.textContent = 'Locating…';
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const me = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          locations.forEach((loc) => { loc.distance = distanceMiles(me, loc.coords); });
          const sorted = [...locations].sort((a, b) => a.distance - b.distance);
          render(sorted);
          map.panTo(sorted[0].coords);
          map.setZoom(9);
          select(sorted[0], { pan: false });
          nearEl.disabled = false;
          nearEl.textContent = '📍 Use my location';
        },
        () => {
          nearEl.disabled = false;
          nearEl.textContent = '📍 Use my location';
        }
      );
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initLocationFinder().catch((err) => {
    console.error('[location-finder]', err);
    const mapEl = document.getElementById('finder-map');
    if (mapEl) {
      mapEl.innerHTML = '<div class="finder-error">Sorry, the map could not be loaded. Please refresh.</div>';
    }
  });
});
