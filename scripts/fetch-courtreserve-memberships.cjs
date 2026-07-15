#!/usr/bin/env node
/* ============================================================
   24/7 Golf — CourtReserve membership fetcher

   Pulls the LIVE public membership list straight from CourtReserve
   (the same data shown at
   https://app.courtreserve.com/Online/Memberships/Public/<orgId>)
   and prints it as normalized JSON. No login needed.

   How it works (2 requests, both via curl):
     1. GET the public memberships page and extract the anonymous
        short-lived JWT that CourtReserve embeds in the HTML.
     2. GET backend.courtreserve.com/api/membership-member-portal/get-list
        with that JWT as a Bearer token → full membership JSON
        (ids, names, badges, prices, features, effective dates).

   The page is behind Cloudflare, which blocks non-browser TLS
   fingerprints inconsistently — plain curl with default headers is
   accepted; do not add browser-like headers.

   Usage:
     node scripts/fetch-courtreserve-memberships.cjs <orgId> [locationFilter]
     node scripts/fetch-courtreserve-memberships.cjs 10840 Ludington

   Output: JSON to stdout —
     { orgId, orgName, fetchedAt, memberships: [ {
         id, name, location, plan, badges[], effective, prices[],
         priceDisplay, description, features[], signupUrl } ],
       unmatched: [ ...names with no "Location - " prefix... ] }

   Location matching: CourtReserve plan names are prefixed
   "Ludington - Player", "Grand Rapids - Summer Membership", etc.
   Plans without a recognizable prefix land in "unmatched" — never
   guess their location; ask the owner.
   ============================================================ */

const { execFileSync } = require('child_process');

const orgId = process.argv[2];
const locationFilter = (process.argv[3] || '').trim().toLowerCase();
if (!orgId || !/^\d+$/.test(orgId)) {
  console.error('Usage: node scripts/fetch-courtreserve-memberships.cjs <orgId> [locationFilter]');
  process.exit(1);
}

function curl(args) {
  return execFileSync('curl', ['-sS', '--compressed', '--max-time', '60', ...args], {
    timeout: 90000, maxBuffer: 64 * 1024 * 1024,
  }).toString('utf8');
}

// 1) Public page → anonymous JWT
const pageUrl = `https://app.courtreserve.com/Online/Memberships/Public/${orgId}`;
const html = curl([pageUrl]);
const jwtMatch = html.match(/eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/);
if (!jwtMatch) {
  console.error(`Could not find the anonymous token on ${pageUrl} — page layout may have changed, or Cloudflare blocked the request. First 200 chars:\n${html.slice(0, 200)}`);
  process.exit(2);
}

// 2) Membership list API
const apiUrl = `https://backend.courtreserve.com/api/membership-member-portal/get-list?orgId=${orgId}&membershipOfferId=&offeredOnly=false&flowName=memberships`;
const raw = curl(['-H', `Authorization: Bearer ${jwtMatch[0]}`, apiUrl]);
let payload;
try { payload = JSON.parse(raw); }
catch { console.error(`API did not return JSON. First 200 chars:\n${raw.slice(0, 200)}`); process.exit(3); }

const plans = JSON.parse(payload.MembershipDataJson || '[]');
const parseJson = (s) => { try { return JSON.parse(s || '[]'); } catch { return []; } };

const memberships = [];
const unmatched = [];
for (const p of plans) {
  const name = (p.NAME || '').trim();
  // "Ludington - Player" → location "Ludington", plan "Player"
  const m = name.match(/^(.+?)\s+-\s+(.+)$/);
  const prices = parseJson(p.PriceStringJson).map((x) => ({
    display: x.PriceDisplay, frequency: x.FrequencyDisplay,
  }));
  const entry = {
    id: p.Id,
    name,
    location: m ? m[1].trim() : null,
    plan: m ? m[2].trim() : name,
    badges: parseJson(p.BadgesStringJson).map((b) => b.BadgeName),
    effective: p.EffectiveDatesDisplay || null,
    prices,
    priceDisplay: prices.length
      ? prices.map((x) => `${x.display} / ${x.frequency}`).join(' · ')
      : 'Free',
    description: (p.DESCRIPTION || '').replace(/\s+/g, ' ').trim(),
    features: parseJson(p.FeaturesStringJson).map((f) => f.FeatureDescription),
    signupUrl: `https://app.courtreserve.com/Online/Memberships/ViewPublicMembership/${orgId}?membershipId=${p.Id}`,
  };
  if (!entry.location) unmatched.push(entry.name);
  if (locationFilter && (entry.location || '').toLowerCase() !== locationFilter) continue;
  memberships.push(entry);
}

console.log(JSON.stringify({
  orgId: Number(orgId),
  orgName: (payload.OrgName || '').trim(),
  fetchedAt: new Date().toISOString(),
  count: memberships.length,
  memberships,
  unmatched,
}, null, 2));
