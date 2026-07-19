# 24/7 Golf Website — Claude Context

## What this is
The production website for 24/7 Golf (24-7golf.com): an **Astro** static site,
deployed to **Cloudflare Pages**, hosted in the **24-Golf** GitHub org
(`24-Golf/247golf-website`). 10 locations at launch, 50+ by 2030.

## Architecture rules
- **One location = one data file** in `src/data/locations/<slug>.json`.
  The location page (`/locations/<slug>`) AND the finder (`/locations`) are
  generated from these files. **Never hand-build a location page.**
- The file name is the slug (`ludington.json` → `/locations/ludington`).
- Global header menu, footer, and layouts are **HQ-owned**
  (`src/components/Header.astro`, `src/components/Footer.astro`,
  `src/layouts/`, `src/content.config.ts`). Location owners edit **only**
  their own `src/data/locations/<slug>.json` and assets in
  `public/locations/<slug>/`.
- Owners may define an optional secondary menu and events inside their
  location file.
- Booking stays on **CourtReserve**; the site deep-links to it. Never invent a
  price — membership data comes from CourtReserve via the membership skill.

## Design system
See `DESIGN_SYSTEM.md`. Tokens live in `src/styles/global.css`. Never
introduce new colors or fonts. Palette: `#0a0a0a` / `#111317` / `#161a20`,
green `#2ecc71`, gold `#c9a84c` (Trackman/premium only). Fonts: Bebas Neue,
Barlow Condensed, Barlow.

## Workflow
- **Never commit to `main`.** Branch → commit → push → open a Pull Request.
- Every PR gets a Cloudflare Pages preview URL; HQ reviews and merges.
- `main` is protected: PR + 1 approval required, force-pushes blocked.
- `.github/CODEOWNERS` routes review of shared files to HQ (@lud247golf).

## Commands
- `npm install` — install dependencies
- `npm run dev` — local dev server at http://localhost:4321
- `npm run build` — production build to `dist/`
- `npm run check` — type-check content and components

## Git identity
- Name: Ludington · Email: ludington@24-7golf.com · Org: 24-Golf

## Strategy background
See `docs/` for the full platform strategy presentation and the Option 2
getting-started guide.
