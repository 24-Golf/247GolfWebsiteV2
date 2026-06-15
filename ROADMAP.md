# 24/7 Golf — Website V2 Roadmap

A plan for rebuilding **24-7golf.com** into a professional, scalable WordPress site
that grows cleanly to **20+ locations**, ships a best-in-class **"find a location
near me"** experience, and lets **each location owner safely edit their own page**.

> **🏗️ Build in progress:** The new site is being built on Elementor One at
> **[mzhprabe.elementor.cloud](https://mzhprabe.elementor.cloud/)** — follow along there.

> TL;DR recommendation:
> 1. Build on **WordPress + Elementor**, and upgrade to **Elementor One** (one
>    subscription that bundles the Pro editor + optimization/management tools).
> 2. Treat locations as **data, not hand-built pages** — one "Locations" content
>    type powering both the location pages and the finder.
> 3. Use a **dedicated store-locator plugin** for the find-a-location page.
> 4. Give each owner a **restricted role** so they can edit only their location.

---

## 1. Elementor Pro vs. Elementor One — what's the difference?

Both are paid Elementor products. The short version:

| | **Elementor Pro** | **Elementor One** |
|---|---|---|
| What it is | The page-builder upgrade: the **Pro editor**, 80+ premium widgets, **Theme Builder** (custom headers/footers/templates), popups, forms, WooCommerce widgets, dynamic content. | An **all-in-one subscription** that *includes the Pro editor* **plus** a suite of site tools in one bill. |
| Bundled extras | None beyond the editor | Image optimization, web-accessibility tools, email deliverability, cookie consent, a site-management dashboard, and a monthly pool of **AI credits** (Angie AI copilot, AI image generation). |
| Pricing model | Tiered by number of sites (Essential = 1 site → Agency = ~1,000 sites). Roughly **$59–$399/yr** depending on tier. | Sold as **One** (single site, ~25,000 monthly credits) and **One Agency** (many sites, larger credit pool). Roughly **$168+/yr**. |
| Best for | A single site where you just need the builder. | A business that also wants performance, accessibility, consent, and AI tooling without buying/managing them separately. |

**Do you need both? No.** Elementor One *contains* Elementor Pro — it is the
superset, not an add-on. You would never subscribe to both; you pick the tier.

**Recommendation for 24/7 Golf:**
- If budget is tight and you only want the builder → **Elementor Pro Advanced**
  (covers up to 3 sites and unlocks all Pro widgets + Theme Builder).
- **Recommended:** **Elementor One** — accessibility compliance (ADA/WCAG matters
  for a multi-location consumer business), image optimization (your site is
  photo-heavy), and cookie consent are real needs you'd otherwise bolt on with
  separate plugins/subscriptions. One folds them into a single renewal.
- As you cross ~3 sites or want a multi-site agency setup, look at **One Agency**
  or the **Expert/Agency** Pro tiers.

> ⚠️ Pricing and packaging change frequently. Confirm the current numbers and
> what's bundled on the official pages before purchasing:
> [Elementor pricing](https://elementor.com/pricing/) ·
> [Pro plans](https://elementor.com/pro/) ·
> [Upgrade Pro → One](https://elementor.com/help/upgrade-from-elementor-pro-to-elementor-one/)

---

## 2. The supporting toolkit (plugins worth running)

Elementor builds the look. These give you the *professional, scalable* foundation.
Keep the plugin list lean — every plugin is a maintenance/security cost.

**Core foundation**
- **Theme:** **Hello Elementor** (Elementor's own lightweight theme) or **Astra** /
  **GeneratePress** — all fast and built to pair with Elementor.
- **Custom fields / content modeling:** **ACF (Advanced Custom Fields)** — defines
  the structured "Location" record (address, hours, bay count, memberships,
  CourtReserve IDs, photos). This is the backbone of scaling to 20+ locations.
- **Performance:** caching + optimization (e.g. **WP Rocket**, or your host's
  caching). Image optimization comes with Elementor One.

**Location finder**
- A dedicated **store-locator plugin** (see §3).

**Per-location editing & permissions**
- A **role manager** — **Members** (free) or **User Role Editor** — to create a
  "Location Owner" role.
- To restrict each owner to *their own* location only, a capability/ownership
  plugin or light custom code (see §4).

**Trust, compliance & growth**
- **SEO:** **Rank Math** or **Yoast** — critical for "indoor golf near me" search
  traffic and **local SEO** (per-location landing pages + LocalBusiness schema).
- **Forms:** Elementor Pro Forms (you already have Jotform available too).
- **Security/backup:** **Wordfence** + **UpdraftPlus** (or host-level backups).
- **Accessibility & cookie consent:** included with Elementor One.

> Recommendation: ACF + a good store-locator plugin + Rank Math are the three
> highest-leverage additions on top of Elementor.

---

## 3. The location finder — the most important page

The competitor reference ([thebackninegolf.com/local](https://thebackninegolf.com/local/))
is a dynamic, JavaScript-driven finder. Here's what a best-in-class version looks
like and how to build it.

### Target experience
- **Auto-detect + manual search.** On load, ask for browser geolocation; also let
  users type a **ZIP / city / address** with a search radius.
- **Map + list, side by side.** Interactive map (pins) next to a results list that
  **sorts by distance** ("3.2 mi away").
- **Rich result cards.** Each card shows photo, address, hours, "X bays",
  pickleball badge if applicable, phone, **"Book a bay"** (CourtReserve), and
  **"View location"**.
- **Fast and mobile-first.** Most users are on a phone looking for the closest bay.
- **Graceful empty state.** "No locations within 50 mi — see all locations" +
  a "we're expanding, get notified" capture.

### How to build it
**Recommended: data-driven via a store-locator plugin.** Because every location
is an ACF "Location" record (§4), the finder reads from that same data — add a new
location once and it appears on the map, the finder, and its own page
automatically. Options to evaluate:

- **WP Store Locator** (free, mature, Google Maps + radius search + directions)
- **Agile Store Locator** (polished UI, categories, live search)
- **Locatoraid** (lightweight, auto-geocoding)
- **Multiple Locations by CreativeMinds** (ZIP/radius search, browser geolocation)

Pick based on how closely the styling can match the dark/premium design system and
whether it can pull from your existing location data rather than a separate list.

> You'll need a **Google Maps Platform API key** (Maps + Geocoding) for map display
> and ZIP-to-coordinates lookup. Budget for the (usually small) monthly usage.

**Local SEO bonus:** also publish a **per-location page** for every site with
**LocalBusiness structured data**. The finder helps existing visitors; the indexed
location pages win "indoor golf near me" searches.

---

## 4. Scaling to 20+ locations — the architecture

The current prototype hand-builds one HTML file per location. **That does not scale
to 20+** and makes per-owner editing impossible. The fix:

### Locations as a content type ("Locations" CPT)
Model a location **once** as structured data with ACF fields, e.g.:

```
Location (custom post type)
├─ Name, city, state                 ├─ Hours (per day)
├─ Address + lat/long (geocoded)     ├─ Number of bays
├─ Phone, email                      ├─ Pickleball? (yes/no)
├─ CourtReserve org ID + embed IDs   ├─ Memberships offered  ← owner-editable
├─ Hero image + photo gallery        ├─ Amenities / features
└─ Owner (assigned WP user)          └─ Status (open / coming soon)
```

### One template renders them all
Build a **single Elementor Theme Builder template** for the "Location" type that
pulls these fields dynamically. Add the 21st location → fill in the fields → its
page, its finder pin, and its booking embed all generate from one source. No new
HTML, no copy-paste drift, consistent branding everywhere.

**Benefits**
- Add/edit a location in minutes, not by cloning a page.
- The finder, the location pages, and any "all locations" list stay in sync.
- Consistent, professional design enforced by the shared template.
- Clean data for SEO schema and future use (e.g. the mobile app).

---

## 5. Letting each location owner edit their own page

Goal: an owner can update **their** location (especially **memberships offered**,
hours, photos) — and **nothing else**.

**Approach**
1. Create a **"Location Owner"** role (Members / User Role Editor) that can edit
   Locations but **cannot** touch global site settings, plugins, theme, or other
   locations' pages.
2. **Assign each owner** to their Location record (the "Owner" field above).
3. **Scope editing to their own location** so Owner A can't edit Location B —
   enforced with an ownership plugin or a small custom capability filter
   (`map_meta_cap` restricting edit to posts where author/owner = current user).
4. **Limit which fields they see.** Use ACF (or an Elementor template region) to
   expose only the safe, owner-editable fields — memberships, hours, photos,
   promos — while addresses, embed IDs, and layout stay locked to admins.
5. Optional: route owner edits through **draft → admin approval** so HQ keeps
   brand control as the team grows.

This gives owners real autonomy over the parts that change often (memberships,
hours, promos) without risking the rest of the site.

---

## 6. Phased rollout

**Phase 0 — Decisions & accounts (week 1)** ✅ *in progress*
- ✅ **Elementor One** purchased; staging site live at
  [mzhprabe.elementor.cloud](https://mzhprabe.elementor.cloud/).
- Choose theme (Hello/Astra), store-locator plugin, and get a **Google Maps API key**.
- Lock the design system (already in `DESIGN_SYSTEM.md`).

**Phase 1 — Foundation (weeks 1–2)**
- Stand up WordPress (staging first), install the lean plugin stack.
- Build the **Locations CPT + ACF fields**.
- Recreate the landing page (`pages/index.html`) in Elementor against the design system.

**Phase 2 — Locations at scale (weeks 2–4)**
- Build the **single Location template** in Theme Builder.
- Enter the 5 current locations as data; verify booking embeds.
- Build the **location finder** page; confirm geolocation + ZIP search + distance sort.

**Phase 3 — Owner editing & polish (weeks 4–5)**
- Create the **Location Owner role**, ownership scoping, and limited field set.
- Onboard one pilot owner; refine the editing experience.
- Local SEO: LocalBusiness schema, per-location titles/meta, sitemap.

**Phase 4 — Launch (week 5+)**
- Accessibility + performance pass, cross-device QA, redirects from old URLs.
- Cut over DNS; monitor.
- Document "how to add a new location" and "owner editing" for the team.

---

## 7. Open questions to resolve

- [x] Final call: **Elementor One** vs **Pro Advanced**? → **Elementor One** ✅
- [x] Who hosts WordPress, and is there a staging environment? → **Elementor Cloud**, staging at [mzhprabe.elementor.cloud](https://mzhprabe.elementor.cloud/) ✅
- [ ] Confirm address / phone / hours / bay counts / CourtReserve embed IDs for all 5 locations.
- [ ] Which store-locator plugin best matches the dark/premium look?
- [ ] Should owner edits be **live** or **approval-gated**?
- [ ] App Store / Google Play links for the 24/7 Golf app.

---

## 8. AI build tooling (Claude Code + WordPress)

We use **Claude Code** to help build and manage the WordPress site. This works by
installing an **MCP server** plugin on WordPress, which exposes the site's
capabilities as tools Claude Code can call over natural language.

**Two complementary approaches we're trialing on staging:**

1. **Royal MCP** (vendor plugin) — free, ~67 core tools (posts, pages, media,
   menus, users, settings) and auto-unlocks **Elementor / WooCommerce / ACF**
   tools when active. The fastest way to start; Elementor-aware.
2. **Abilities API + MCP Adapter** (official/WordPress.org) — the canonical,
   future-proof path. The **Abilities API** shipped in WordPress **6.9** core;
   the **MCP Adapter** plugin bridges those abilities to MCP. Fewer tools today,
   but this is the standard plugin/theme makers (incl. Elementor) are adopting.

**Division of labor:** Claude Code is best for **content and structure at scale** —
bulk-managing the 20+ Locations records, ACF fields, SEO meta, menus. **Visual
Elementor layout** is still done in the Elementor editor and with Elementor's own
AI (**Angie**, included with Elementor One). Think: *Claude Code for the plumbing,
Elementor for the look.*

**Guardrails (important):**
- Trial on **staging** ([mzhprabe.elementor.cloud](https://mzhprabe.elementor.cloud/)) only — never point an AI at the live site first.
- Use a dedicated **Application Password / API token**; never commit it to this repo.
- Enable the plugin's **activity logging** and keep backups.
- Revoke tokens when not actively building.

> Setup steps (Application Password, MCP Adapter install, and the `claude mcp add`
> commands for both Royal MCP and the Abilities API) live in **[docs/claude-code-wordpress-setup.md](docs/claude-code-wordpress-setup.md)**.

---

### Sources
- [Elementor pricing](https://elementor.com/pricing/) ·
  [Elementor Pro plans](https://elementor.com/pro/) ·
  [Upgrade Pro → One](https://elementor.com/help/upgrade-from-elementor-pro-to-elementor-one/)
- [Elementor One overview (Essential Addons)](https://essential-addons.com/elementor-one-a-complete-overview/) ·
  [Elementor One review (WP Marmite)](https://wpmarmite.com/en/elementor-one/)
- [Best WordPress store-locator plugins (Elfsight)](https://elfsight.com/blog/best-wordpress-store-locator-plugins/) ·
  [Store-locator roundup (Ultida)](https://ultida.com/wordpress-store-locator-plugins/)
- [Royal MCP](https://royalplugins.com/royal-mcp/) ·
  [WordPress MCP Adapter](https://github.com/wordpress/mcp-adapter) ·
  [Abilities API in WP 6.9 & MCP](https://www.miniorange.com/blog/wordpress-api-abilities-and-mcp-ai-agents/) ·
  [AI Engine — Claude Code + WordPress (Meow Apps)](https://meowapps.com/claude-code-wordpress-mcp/)
