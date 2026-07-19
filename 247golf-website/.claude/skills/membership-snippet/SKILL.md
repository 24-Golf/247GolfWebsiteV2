---
name: membership-snippet
description: Build or update a "Choose Your Membership" section for a 24/7 Golf location page directly from CourtReserve's live public membership list. Use when anyone asks to create/refresh membership content for a location — all that's needed is the CourtReserve public memberships URL (or org ID) and the location name. Produces (1) a membership data markdown file and (2) a paste-ready, brand-styled Elementor HTML snippet with live prices and correct signup deep-links.
---

# 24/7 Golf — Membership Snippet Builder

Turn a location's **live CourtReserve membership list** into two deliverables:

1. **A membership data file** — `memberships/<slug>-memberships.md` — a clean,
   human-readable markdown record (shareable by email / Google Drive).
2. **A paste-ready Elementor snippet** — the "Choose Your Membership" section
   in the 24/7 Golf house style, generated from `snippet-template.html` in this
   skill folder.

## Step 1 — Fetch the live data (preferred; no forms to fill)

All you need from the owner is the **org ID** (from the CourtReserve public URL,
e.g. `.../Online/Memberships/Public/10840` → `10840`) and the **location name**.

Run the repo's fetch script:

```bash
node scripts/fetch-courtreserve-memberships.cjs <orgId> "<Location>"
# e.g. node scripts/fetch-courtreserve-memberships.cjs 10840 Ludington
```

It pulls the same data the public page shows (the page is a React app — plain
HTML fetches show nothing, which is why the script exists; see its header
comment for how it works) and prints normalized JSON per plan: `id`, `plan`
name, `location`, `badges` (Individual/Family), `effective` date, `prices`
(live, e.g. `$95 / Monthly`), `description`, `features`, and the exact
`signupUrl` the page's own **Learn More** button opens.

**Location identification:** CourtReserve plan names are prefixed
`"<Location> - <Plan>"` — the script matches on that prefix. Plans it can't
match land in the JSON's `unmatched` list. **Show unmatched names to the user
and ask which location they belong to (or whether to skip them) — never guess.**

**Fallbacks** if the script fails or there's no CourtReserve listing:
- the owner fills in `membership-data-template.md` (this folder), or
- the owner pastes details as freeform text/email.
In those cases, never invent names, prices, dates, or IDs — ask for anything
missing. Only state prices that came from CourtReserve or the owner.

## Step 2 — Write the data file

Write/update `memberships/<slug>-memberships.md` following
`membership-data-template.md` (see `memberships/ludington-memberships.md` for a
completed example). Include per plan: CourtReserve membership ID, type
(Individual/Family), **price** (from `priceDisplay`; "Free" when there's none),
optional effective date, one-line description, and the feature bullets.
Record the fetch date in the file header. Normalize obvious typos and
SHOUTING in descriptions/features, but keep the meaning exact.

## Step 3 — Generate the snippet

Generate the section from `snippet-template.html` (same folder):

1. Replace `{{LOCATION}}` with the location name, `{{SLUG}}` with the
   lowercase-hyphen slug, and `{{ORG_ID}}` with the org ID.
2. Emit one `<article class="g247-mem__card">` per plan, in the API's order:
   - Badges: `Individual` → `<span class="g247-mem__tag">Individual</span>`;
     `Family` → add class `g247-mem__tag--gold`; effective date → an extra
     `<span class="g247-mem__tag g247-mem__tag--muted">Effective to <date></span>`.
   - Price: paid → `<div class="g247-mem__price">$95<span> / Monthly</span></div>`;
     free → `<div class="g247-mem__price g247-mem__price--free">Free</div>`;
     multiple options → join with `·` inside the span.
   - Button `href` = the plan's `signupUrl`, with `target="_blank" rel="noopener"`.
   - HTML-escape all text (`&` → `&amp;`, etc.).
3. Do **not** restyle: keep the `<style>` block, `g247-mem__*` class names,
   the fonts `<link>`, and absolute-px font sizes exactly as in the template —
   that's what keeps every location on-brand and immune to theme CSS.

Where the snippet goes:

- **Inside the 247GolfWebsiteV2 repo:** add/refresh the
  `## <Location> → "Choose Your Membership"` section in `WORDPRESSDEPLOYMENT.md`
  (Preview / snippet / Customizing with a membershipId table / Notes), and keep
  `scripts/build-location-pages.cjs` membership data + the generated
  `pages/<slug>.html` in sync.
- **Standalone (owner's own Claude session):** output the snippet as one fenced
  code block plus the data file.

## Step 4 — Deliver with instructions

End by giving the owner these steps:

1. Edit your location's page on the site **with Elementor**.
2. Drag in an **HTML widget** where the membership section should appear.
3. Paste the **entire snippet** (comment header, `<link>` tags, `<style>`, markup).
4. **Update/Publish**, then check the **live page** (the editor canvas can
   strip styles in preview).
5. Click every **Learn More & Join** button and confirm each lands on the right
   CourtReserve plan.

Suggest re-running the skill whenever memberships or prices change — the fetch
script always returns the current list, so refreshes are one command.

## Validation checklist (before delivering)

- [ ] Every card's button URL has a numeric `membershipId`, and the org ID matches.
- [ ] Badges: Individual = green, Family = gold, date pill = muted.
- [ ] Prices match the fetch output exactly; free plans say "Free".
- [ ] No invented facts — every card traces to the fetch output (or the owner's words).
- [ ] All text HTML-escaped; no `rem` units; classes still `g247-mem__*`.
- [ ] Data file and snippet agree (same plans, same order, same wording).
- [ ] Unmatched plans were raised with the user, not silently dropped or guessed.

## Style guardrails

- Section heading is always `<Location> Memberships` (eyebrow) /
  `Choose Your Membership` (title).
- Tone: confident, welcoming, plain-spoken. No exclamation marks, no hype.
- The cards summarize and deep-link; checkout, exact dues, and taxes stay on
  CourtReserve.
