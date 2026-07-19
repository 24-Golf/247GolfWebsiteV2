# 24/7 Golf — Getting Started with Option 2
### Astro + GitHub + Cloudflare Pages, Claude Code-first

A step-by-step build guide for the new 24/7 Golf website platform.
Written to be followed *with* Claude Code — most steps are a prompt, not a command.

---

## Phase 0 — Prerequisites (one-time, ~30 min)

1. **Node.js 18+** installed (`node -v` to check).
2. **Git** installed and configured with your identity.
3. **GitHub CLI** (`gh`) installed, then authenticate as **lud247golf**:
   ```bash
   gh auth login
   ```
   Choose GitHub.com → HTTPS → login with a browser. Verify with `gh auth status`.
4. **Claude Code** installed:
   ```bash
   npm install -g @anthropic-ai/claude-code
   ```
   Docs: https://docs.claude.com/en/docs/claude-code/overview
5. **Cloudflare account** (free) with access to manage DNS for 24-7golf.com — you'll need this at Phase 5, and DNS control at cutover.

---

## Phase 1 — Create the repository (Claude Code does this)

Make a working folder, start Claude Code, and let it drive:

```bash
mkdir 247golf-website && cd 247golf-website
claude
```

Prompt:

> Create a new **private** GitHub repository named `247golf-website` under the
> `lud247golf` account using the gh CLI, initialize it with a README and a
> Node .gitignore, clone it here, and make an initial commit.

Claude Code will run `gh repo create lud247golf/247golf-website --private ...`
and ask permission before each command. This repo becomes the single source of
truth for the site.

---

## Phase 2 — Give Claude Code its deep context (the "memory bridge")

Claude Code does **not** automatically see claude.ai chats. Its memory is the
`CLAUDE.md` file in the repo — everything written there is loaded into every
session, for you *and* for every location owner later. So the first real work
is moving the strategy into the repo:

1. Copy from the existing `247GolfWebsiteV2` repo:
   - `DESIGN_SYSTEM.md` (colors #0a0a0a/#111317/#161a20, green #2ecc71, gold
     #c9a84c; Bebas Neue / Barlow Condensed / Barlow)
   - the `.claude/skills/` folder (including `membership-snippet`)
   - any reusable CSS architecture
2. Add the two strategy files to a `docs/` folder:
   - the platform strategy presentation (HTML version)
   - this guide
3. Create `CLAUDE.md` at the repo root. Starter content:

   ```markdown
   # 24/7 Golf Website — Claude Context

   ## What this is
   The production website for 24/7 Golf (24-7golf.com): Astro static site,
   deployed to Cloudflare Pages. 10 locations at launch, 50+ by 2030.

   ## Architecture rules
   - One location = one data file in `src/content/locations/<slug>.json`.
     Location pages AND the finder are generated from these files. Never
     hand-build a location page.
   - Global header menu, footer, and layouts are HQ-owned. Location owners
     edit ONLY their own `src/content/locations/<slug>.json` and assets in
     `public/locations/<slug>/`.
   - Owners may define an optional secondary menu inside their location file.
   - Booking stays on CourtReserve; the site deep-links to it.

   ## Design system
   See DESIGN_SYSTEM.md. Never introduce new colors or fonts.

   ## Workflow
   - Never commit to `main`. Branch → commit → push → open a PR.
   - Every PR gets a Cloudflare preview URL; HQ reviews and merges.

   ## Strategy background
   See docs/ for the full platform strategy presentation.
   ```

4. Commit: `git add -A && git commit -m "Seed context, design system, skills" && git push`.

**Ongoing habit:** when a claude.ai chat produces something the repo should
know, paste the takeaway into `CLAUDE.md` or `docs/` — that's how the two
worlds stay connected.

---

## Phase 3 — Scaffold the Astro site

In Claude Code, prompt:

> Scaffold an Astro project in this repo (minimal template, no framework
> integrations yet). Then:
> 1. Define a `locations` content collection with a zod schema:
>    name, slug, address, city, state, zip, lat, lng, phone, courtReserveOrgId,
>    courtReserveUrl, bays (number), hours, ownerName, ownerBio, photos[],
>    memberships[] (id, plan, type, price, features[], signupUrl),
>    secondaryMenu[] (label, href, optional), events[] (optional).
> 2. Create `src/pages/locations/[slug].astro` that renders a full location
>    page from the collection using our design system.
> 3. Create `src/pages/locations/index.astro` — the location finder: a list
>    of all locations plus a Google Maps JS API map with clustered markers,
>    generated from the same collection.
> 4. Build shared `Header.astro` and `Footer.astro` layouts (HQ-controlled).
> 5. Add one real location — Ludington — as `src/content/locations/ludington.json`
>    using the membership data from the membership-snippet skill.

Then `npm run dev` and review at `localhost:4321`. Iterate with Claude Code
until the pilot page matches the design system. This is the "August pilot"
from the presentation.

**Proof-of-model test:** duplicate `ludington.json` to a second slug, change
the fields, rebuild — a complete new location page and finder pin should
appear with zero page-building. That's the demo for the president.

---

## Phase 4 — Governance: protect HQ, empower owners

1. **Branch protection** (Claude Code can do this via `gh api`, or use
   GitHub → Settings → Branches → protect `main`):
   - Require a pull request before merging
   - Require 1 approval; dismiss stale approvals
   - Block force pushes
2. **CODEOWNERS** — create `.github/CODEOWNERS`:
   ```
   *                               @lud247golf
   /src/layouts/                   @lud247golf
   /src/components/Header.astro   @lud247golf
   /src/components/Footer.astro   @lud247golf
   ```
   With "require review from Code Owners" on, every merge needs your approval,
   and the header/footer are explicitly yours.
3. **Owner access:** invite each location owner's GitHub account as a
   collaborator with **Write** role (they can branch and open PRs; branch
   protection stops direct pushes to `main`).
4. Add `docs/OWNER-GUIDE.md` — a one-page "how to edit your page" for owners
   (Claude Code will happily draft it from CLAUDE.md).

---

## Phase 5 — Publish with Cloudflare Pages

1. Cloudflare dashboard → **Workers & Pages → Create → Pages →
   Connect to Git** → authorize GitHub → select `lud247golf/247golf-website`.
2. Build settings: framework preset **Astro**, build command `npm run build`,
   output directory `dist`.
3. Deploy. You get a `*.pages.dev` URL immediately — and **every PR from now
   on gets its own preview URL** automatically. That preview link is what you
   review before merging owner changes.
4. Keep `24-7golf.com` pointed at WordPress for now. Cutover is Phase 8.

---

## Phase 6 — Owner onboarding playbook (repeat per owner)

1. Owner gets a Claude subscription that includes Claude Code, installs it,
   and installs `git` + `gh`.
2. Owner authenticates `gh` with their own GitHub account; you've already
   invited that account as a collaborator.
3. Owner runs:
   ```bash
   gh repo clone lud247golf/247golf-website && cd 247golf-website && claude
   ```
4. Their Claude Code automatically loads `CLAUDE.md` and the shared
   `.claude/skills` — the guardrails travel with the repo, no per-owner setup.
5. First supervised edit — have them prompt:
   > Update my location's hours in src/content/locations/<slug>.json to ...,
   > then create a branch, commit, and open a pull request.
6. You open the PR's Cloudflare preview link, check it, merge. Live in ~1 min.
7. Owners who never take to Claude Code use the fallback: Sveltia/Decap CMS
   (add it in an afternoon later — it edits the same JSON files via a web form).

---

## Phase 7 — Evolve the membership skill for the new platform

The `membership-snippet` skill already fetches live CourtReserve plans by org
ID. On the new platform, retarget its output:

- **Instead of** generating an Elementor HTML snippet,
- **it updates** the `memberships` array in
  `src/content/locations/<slug>.json` (IDs, plans, prices, signupUrls straight
  from the fetch script) and opens a PR.

Everything else in the skill stays: prefix-matching by location, the
unmatched-plans rule (ask, never guess), no invented prices, and the
validation checklist. An owner's refresh becomes:

> Refresh my location's memberships from CourtReserve and open a PR.

---

## Phase 8 — Cutover checklist (target: Oct 1)

- [ ] All 10 locations exist as data files; pages + finder verified
- [ ] Redirect map from old WordPress URLs → new URLs (`_redirects` file in
      the repo; preserves SEO)
- [ ] Titles/meta/descriptions and sitemap generated; Google Search Console
      re-verified
- [ ] Every CourtReserve link click-tested on every page
- [ ] Analytics installed (Cloudflare Web Analytics is free and cookie-light)
- [ ] Move `24-7golf.com` DNS to Cloudflare; add it as the custom domain on
      the Pages project
- [ ] Keep WordPress alive but unlinked for 30 days as a fallback, then retire

---

## Quick answers

**Does Claude Code see my claude.ai chats?** No — they're separate contexts.
The repo's `CLAUDE.md` + `docs/` folder is the bridge (Phase 2), and it's
better anyway: it's versioned and every owner's Claude Code inherits it.

**Can Claude Code create the GitHub repo?** Yes — via the `gh` CLI (Phase 1),
including branch protection and collaborator invites afterward.

**Where do I ask questions mid-build?** Ask Claude Code inside the repo — with
CLAUDE.md seeded it has the full strategy context.
