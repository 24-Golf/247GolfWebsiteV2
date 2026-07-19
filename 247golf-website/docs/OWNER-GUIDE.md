# Location Owner's Guide — Editing Your 24/7 Golf Page

Welcome! This is everything you need to update **your** location page. You can
only change your own page — you can't accidentally break anyone else's or the
global design.

## What you can edit

- **Your location file:** `src/data/locations/<your-slug>.json`
- **Your photos:** `public/locations/<your-slug>/`

That's it. The header, footer, and site design are managed by HQ.

## What's in your location file

| Field | What it is |
|-------|-----------|
| `name`, `city`, `state`, `zip`, `address` | Where you are |
| `lat`, `lng` | Map pin coordinates |
| `phone` | Your booking/contact number |
| `bays` | Number of bays (a whole number) |
| `hours` | List of `{ "days": "...", "time": "..." }` |
| `courtReserveUrl` | Your CourtReserve booking link |
| `memberships` | Your plans — **use the membership skill, don't hand-type prices** |
| `secondaryMenu` | Optional extra nav on your page |
| `events` | Optional events list |

## Editing with Claude Code (recommended)

1. Install Claude Code, `git`, and `gh`, and sign in to your GitHub account.
2. Clone the repo and open Claude Code:
   ```bash
   gh repo clone 24-Golf/247golf-website && cd 247golf-website && claude
   ```
3. Claude Code automatically loads the project rules (`CLAUDE.md`) and skills.
4. Ask it, for example:
   > Update my location's hours in src/data/locations/<my-slug>.json to …,
   > then create a branch, commit, and open a pull request.
5. Refresh memberships from CourtReserve any time:
   > Refresh my location's memberships from CourtReserve and open a PR.

## What happens next

- Your change opens a **Pull Request**.
- It gets a **preview link** (a live copy of the site with your change).
- HQ checks the preview and merges it — your change is live in about a minute.

## No-code option

Prefer not to use Claude Code? A web-form editor (Sveltia/Decap CMS) can be
added that edits the same files through a simple form. Ask HQ.

## Rules

- Never change the header, footer, layouts, or design tokens (HQ-owned).
- Never invent membership prices — pull them from CourtReserve.
- One change at a time, open a PR, let HQ review.
