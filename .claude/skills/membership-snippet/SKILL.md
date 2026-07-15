---
name: membership-snippet
description: Build or update a "Choose Your Membership" section for a 24/7 Golf location page. Use when a location owner shares membership details (as a filled-in data file, an email, or a CourtReserve link) or asks to add/change memberships on their page. Produces (1) a clean membership data markdown file the owner can share by email/Google Drive and (2) a paste-ready, brand-styled Elementor HTML snippet.
---

# 24/7 Golf — Membership Snippet Builder

You are helping a 24/7 Golf location owner turn their membership offerings into
two deliverables:

1. **A membership data file** — `memberships/<slug>-memberships.md` — a clean,
   human-readable markdown record the owner can email or drop in Google Drive.
   This is the source of truth for that location's memberships.
2. **A paste-ready Elementor snippet** — the "Choose Your Membership" section
   in the 24/7 Golf house style, generated from that data file using
   `snippet-template.html` in this skill folder.

## Step 1 — Gather the data

Accept input in any form the owner provides:

- A filled-in copy of `membership-data-template.md` (in this skill folder) — the ideal case.
- Freeform text (an email, a list, notes).
- A CourtReserve public memberships URL
  (`https://app.courtreserve.com/Online/Memberships/Public/<orgId>`) or
  individual plan URLs (`...ViewPublicMembership/<orgId>?membershipId=<id>`).

For each membership you need:

| Field | Required | Notes |
|---|---|---|
| Plan name | yes | e.g. "Player", "Summer Membership" |
| CourtReserve membership ID | yes | the `membershipId=` number in the plan's public URL — the Join button deep-links to it |
| Type | yes | `Individual` or `Family` |
| Offer end date | no | e.g. "Effective to 9/30/2026" — shown as a muted date pill |
| One-line description | yes | a single sentence |
| Feature bullets | yes | 3–6 short bullets; include rates only if the owner supplied them |

Also needed once per location: **location name**, **CourtReserve org ID**, and
the **location page URL** on 24-7golf.com.

**If anything required is missing, ask for it — never invent membership names,
prices, dates, or IDs.** Prices especially: only state a price the owner (or
CourtReserve's public page) explicitly provided. When in doubt, leave pricing
to the CourtReserve checkout page and say so in the features
("pricing shown at checkout").

## Step 2 — Write the data file

Write/update `memberships/<slug>-memberships.md` following
`membership-data-template.md` exactly (see `memberships/ludington-memberships.md`
in the repo for a completed example). Keep the owner's wording where it's clear;
fix spelling and normalize capitalization. This file is what gets shared by
email/Drive, so it must read cleanly on its own.

## Step 3 — Generate the snippet

Generate the section from `snippet-template.html` (same folder as this file):

1. Replace `{{LOCATION}}` with the location name and `{{ORG_ID}}` with the
   CourtReserve org ID.
2. For each membership, emit one `<article class="g247-mem__card">` from the
   card block in the template, in the order given in the data file:
   - Badge: `Individual` → `<span class="g247-mem__tag">Individual</span>`;
     `Family` → add class `g247-mem__tag--gold`.
   - Offer end date (if any) → an extra
     `<span class="g247-mem__tag g247-mem__tag--muted">Effective to <date></span>`.
   - Button href:
     `https://app.courtreserve.com/Online/Memberships/ViewPublicMembership/{{ORG_ID}}?membershipId=<id>`
     with `target="_blank" rel="noopener"`.
   - HTML-escape all text content (`&` → `&amp;`, etc.).
3. Do **not** restyle: keep the `<style>` block, class names (`g247-mem__*`),
   fonts `<link>`, and absolute-px font sizes exactly as in the template. That
   is what keeps every location's section on-brand and immune to theme CSS.

Where the snippet goes:

- **Working inside the 247GolfWebsiteV2 repo:** add or refresh a
  `## <Location> → "Choose Your Membership"` section in `WORDPRESSDEPLOYMENT.md`
  (mirror the existing Ludington section's structure: Preview, the snippet,
  Customizing with a membershipId table, Notes).
- **Working standalone (owner's own Claude session):** output the snippet as a
  single fenced code block, plus the data file.

## Step 4 — Deliver with instructions

Always end by giving the owner these steps:

1. Edit your location's page on the site **with Elementor**.
2. Drag in an **HTML widget** (search "HTML" in the widget panel) where the
   membership section should appear.
3. Paste the **entire snippet** (comment header, `<link>` tags, `<style>`
   block, and markup).
4. Click **Update/Publish**, then check the **live page** (not the editor
   canvas — it sometimes strips styles in preview).
5. Click every **Learn More & Join** button and confirm each lands on the
   right CourtReserve plan.

## Validation checklist (run before delivering)

- [ ] Every card has a numeric `membershipId` in its button URL, and the org ID matches the location.
- [ ] Badge colors: Individual = green, Family = gold, date pill = muted.
- [ ] No invented prices, dates, or plan names — everything traces to the data file.
- [ ] All text HTML-escaped; no `rem` units introduced; classes still `g247-mem__*`.
- [ ] The data file and the snippet agree (same plans, same order, same wording).

## Style guardrails

- The section heading is always
  `<Location> Memberships` (eyebrow) / `Choose Your Membership` (title) —
  consistent across locations.
- Tone: confident, welcoming, plain-spoken. No exclamation marks, no hype.
- Checkout, exact dues, and taxes live on CourtReserve — the cards summarize
  and link; they don't replace checkout.
