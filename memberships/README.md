# Location Membership Data Files

One markdown file per location — the **source of truth for that location's
memberships** on the website. Location owners fill these out (or email the
details to HQ) and Claude generates the matching "Choose Your Membership"
Elementor snippet from them.

- **Blank form to send an owner:**
  [`.claude/skills/membership-snippet/membership-data-template.md`](../.claude/skills/membership-snippet/membership-data-template.md)
  — share it by email or Google Drive.
- **Completed example:** [`ludington-memberships.md`](ludington-memberships.md)
- **How generation works:** the `membership-snippet` skill
  ([`.claude/skills/membership-snippet/SKILL.md`](../.claude/skills/membership-snippet/SKILL.md)).
  In a Claude Code session in this repo, just say e.g.
  *"Here's the membership info for Grand Rapids"* (paste or attach the file) —
  the skill produces `memberships/grand-rapids-memberships.md` plus the
  paste-ready snippet in `WORDPRESSDEPLOYMENT.md`.

**Update flow when memberships change:** owner sends updated details → the
data file here is updated → the snippet is regenerated → owner (or HQ) pastes
it into the Elementor HTML widget on the location page. Never edit the snippet
without updating the data file — they must always agree.
