# 24/7 Golf Website

The production website for [24-7golf.com](https://www.24-7golf.com) — an
[Astro](https://astro.build) static site deployed to **Cloudflare Pages**.

**One location = one data file.** Location pages and the location finder are
generated automatically from `src/data/locations/*.json`. Nobody hand-builds a
location page.

## Quick start

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # -> dist/
```

## Project structure

```
src/
├── content.config.ts          # locations collection schema (HQ-owned)
├── data/locations/<slug>.json # ONE FILE PER LOCATION — the source of truth
├── components/                # Header.astro, Footer.astro (HQ-owned)
├── layouts/BaseLayout.astro   # shared <head> + header + footer (HQ-owned)
├── styles/global.css          # design tokens (HQ-owned)
└── pages/
    ├── index.astro            # homepage
    └── locations/
        ├── index.astro        # the finder (list + map), auto-generated
        └── [slug].astro       # a location page, auto-generated
public/locations/<slug>/       # per-location images (owner-managed)
docs/                          # platform strategy + guides
```

## Adding a location

1. Copy an existing file in `src/data/locations/` to `<new-slug>.json`.
2. Edit the fields (name, slug, address, bays, memberships, …).
3. `npm run build` — a complete page **and** a finder map pin appear with zero
   page-building. That's the whole model.

## How owners edit

Owners edit **only** their own `src/data/locations/<slug>.json` (and images in
`public/locations/<slug>/`), then open a Pull Request. HQ reviews the Cloudflare
preview and merges. See [`docs/OWNER-GUIDE.md`](docs/OWNER-GUIDE.md).

## Memberships

Membership plans/prices/signup links come from **CourtReserve** via the
`membership-snippet` skill (`.claude/skills/`). Never hand-enter or invent a
price — run the skill and it fills the `memberships` array from CourtReserve's
live public list.

## Deployment

Cloudflare Pages, framework preset **Astro**, build `npm run build`, output
`dist`. Every PR gets an automatic preview URL. See `docs/` for the full
strategy and cutover plan.
