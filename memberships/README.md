# Location Membership Data Files

One markdown file per location — the record of that location's memberships as
published on the website, kept in sync with **CourtReserve's live public
list**, which is the true source.

**Nobody fills out forms.** In a Claude Code session in this repo, just say
e.g. *"Build the membership snippet for Grand Rapids"* — the
`membership-snippet` skill
([`.claude/skills/membership-snippet/SKILL.md`](../.claude/skills/membership-snippet/SKILL.md))
pulls the live list straight from CourtReserve:

```bash
node scripts/fetch-courtreserve-memberships.cjs 10840 "Grand Rapids"
```

That returns every plan for the location — IDs, badges, **live prices**,
features, effective dates, and the exact signup URL behind each plan's
Learn More button. The skill then writes/refreshes
`memberships/<slug>-memberships.md` and generates the paste-ready
"Choose Your Membership" snippet in `WORDPRESSDEPLOYMENT.md`.

- **Completed example:** [`ludington-memberships.md`](ludington-memberships.md)
- **Manual fallback** (no CourtReserve listing, or the script fails):
  [`.claude/skills/membership-snippet/membership-data-template.md`](../.claude/skills/membership-snippet/membership-data-template.md)
  — owners can fill it in and share by email or Google Drive.

**Update flow when memberships or prices change in CourtReserve:** re-run the
skill → data file refreshes → snippet regenerates → paste it into the Elementor
HTML widget on the location page. Never hand-edit a snippet without updating
the data file — they must always agree.
