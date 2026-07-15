# Elementor Playbook — How We Build 24-7golf.com Content

How this repo and **Elementor One** work together to develop and ship content
for **www.24-7golf.com**. Read this once; it explains who does what.

---

## The collaboration model (the short version)

Claude Code has **no plugin or direct connection to WordPress** (there is an
MCP path — see [claude-code-wordpress-setup.md](claude-code-wordpress-setup.md) —
but it's staging-only and optional). So the workflow is:

```
┌───────────────────────────┐      ┌──────────────────────────────┐
│  THIS REPO (Claude Code)  │      │  WORDPRESS (Elementor One)   │
│                           │      │                              │
│  • Design + write content │ ───▶ │  • Paste snippet into an     │
│  • Paste-ready snippets   │      │    Elementor HTML widget, OR │
│  • Step-by-step guides    │      │  • Rebuild natively with     │
│  • Version history (git)  │      │    Elementor AI / Angie      │
└───────────────────────────┘      └──────────────────────────────┘
```

1. **Design & author here.** New sections and pages are designed in this repo
   against the design system (`DESIGN_SYSTEM.md`), previewed as static HTML
   (`pages/*.html`), and reviewed on Netlify.
2. **Export as a portable snippet.** The section is rewritten as a
   self-contained, `g247-`-namespaced snippet in
   [`WORDPRESSDEPLOYMENT.md`](../WORDPRESSDEPLOYMENT.md) with step-by-step
   Elementor instructions.
3. **You ship it** — either paste the snippet into an Elementor **HTML widget**
   (fastest, pixel-exact), or use the snippet as a spec for **Elementor AI /
   Angie** to build a native Elementor version (more editable later).

Git is the change log: every piece of live-site content has a versioned source
of truth here, so nothing lives only inside WordPress.

---

## What's in Elementor One (and what we use it for)

Elementor One is the all-in-one subscription (relaunched January 2026) that
**includes the Pro editor** plus site tools and a monthly pool of AI credits.
What matters for this project:

| Feature | What it is | How we use it |
|---|---|---|
| **Editor Pro** | The Pro page builder: 80+ widgets, popups, forms, dynamic content. | Day-to-day page building on the live site and staging. |
| **Theme Builder** | Build one template that renders many pages from data. | The end-state for location pages: one **Location template** + ACF fields instead of 10 hand-built pages (ROADMAP §4). |
| **HTML widget** | Paste raw HTML/CSS/JS into a page. | How every snippet in `WORDPRESSDEPLOYMENT.md` ships. |
| **Elementor AI — code** | Generates HTML/CSS **against the exact selector of the element you're editing**. | Tweaking a pasted snippet or restyling a native widget without hand-writing CSS. |
| **Elementor AI — text & image** | On-brand copy rewriting, image generation/editing in the editor. | Quick copy variants; hero/gallery image touch-ups. |
| **Angie (agentic AI)** | An agent built natively for WordPress on MCP — it takes actions ("create a lead-gen popup with 10% off on exit intent") directly against your site. | In-WordPress structural work: creating pages, popups, menus, bulk edits. **Prefer Angie over wiring Claude Code into WordPress via MCP** — it's first-party and already covered by your subscription. |
| **AI Site Planner** | Generates a sitemap + wireframes from a written brief. | When we plan a new page type, we can write the brief here and feed it to Site Planner. |
| **Ally (accessibility)** | AI accessibility scanner + remediation. | Run it after each new section ships — ADA/WCAG matters for a multi-location consumer business. |
| **Image Optimization** | Automatic compression/conversion of media library images. | Your site is photo-heavy; keep it on. Upload the `assets/images/web/*.webp` files from this repo (already optimized) and let Elementor handle the rest. |
| **Cookie consent, email deliverability** | Bundled site tools. | Set-and-forget; no repo involvement. |

> **Credits note:** Elementor AI actions consume monthly credits (One includes
> ~25,000/month; heavier generations like AI Copilot layouts cost ~40 credits
> each). Pasting HTML snippets costs **zero credits** — another reason the
> snippet-first workflow is efficient.

---

## Division of labor

**Claude Code (this repo) is best for:**
- Designing new sections/pages against the design system, with git history
- Writing and maintaining content (copy, FAQs, membership data, location data)
- Producing paste-ready, self-contained snippets (`WORDPRESSDEPLOYMENT.md`)
- Anything data-driven: the location page generator, membership tables,
  keeping the finder's location list in sync
- Documentation and step-by-step guides

**Elementor AI / Angie is best for:**
- Visual layout work inside the Elementor editor
- Converting a snippet into native Elementor widgets when you want it
  editable by non-developers later
- In-WordPress operations: new pages, popups, menu changes, bulk content edits
- Image generation/editing and accessibility remediation (Ally)

**Rule of thumb:** *content and structure are authored here; pixels and
WordPress plumbing are finished there.*

---

## Shipping a snippet: the standard procedure

Every snippet in `WORDPRESSDEPLOYMENT.md` follows the same steps:

1. In WP Admin, edit the target page **with Elementor**.
2. Drag in an **HTML widget** (search "HTML" in the widget panel) where the
   section should appear. Give it full width.
3. Paste the **entire snippet** — comment header, `<link>` font tags, `<style>`
   block, and markup.
4. **Update/Publish**, then verify on the **live page**, not the editor canvas
   (the editor sometimes strips or restyles `<style>`/`<link>` in preview).
5. If the site strips `<script>` tags (some setups do), move script blocks into
   **WPCode / Code Snippets** set to load in the footer, and keep only the
   style + markup in the HTML widget.

### Or: rebuild it natively with Elementor AI

If you'd rather have the section as real Elementor widgets (editable without
touching code):

1. Build the skeleton with normal widgets (headings, buttons, grid container).
2. Select an element → **Custom CSS** (or the AI code assistant) → describe the
   look, or paste the matching CSS rules from the snippet. Elementor AI writes
   CSS scoped to that element's selector.
3. Use the snippet's copy verbatim (it's the reviewed source of truth).
4. Check the result against the design tokens below.

### Design tokens for any Elementor work

Set these in **Site Settings → Global Colors / Fonts** on the staging site so
native widgets match the snippets:

| Token | Value | Use |
|---|---|---|
| Green (primary) | `#2ecc71` | CTAs, links, highlights |
| Green hover | `#1a9e50` | Button hover |
| Black (background) | `#0a0a0a` | Page background |
| Card | `#161a20` | Card/section backgrounds |
| White (text) | `#f5f7f2` | Body text — never pure `#ffffff` |
| Muted | `#8a9080` | Secondary text |
| Gold | `#c9a84c` | Trackman/premium accents only |
| Display font | **Bebas Neue** | Headlines, section titles |
| Condensed font | **Barlow Condensed** | Nav, labels, badges, buttons |
| Body font | **Barlow** | Paragraph text |

Full reference: [`DESIGN_SYSTEM.md`](../DESIGN_SYSTEM.md).

---

## Safety rails

- **Stage first.** Try new sections on the staging site
  ([mzhprabe.elementor.cloud](https://mzhprabe.elementor.cloud/)) before the
  live page when the change is structural.
- **Live-page checks after publishing:** desktop + phone, dark section
  boundaries, button links (CourtReserve membership IDs especially), and a
  quick Ally scan.
- **Keep the repo in sync.** If you edit a shipped section directly in
  WordPress, port the change back to the matching snippet in
  `WORDPRESSDEPLOYMENT.md` (or ask Claude to), so the repo stays the source of
  truth.
- **No secrets in git.** API keys, Application Passwords and tokens never go
  in this repo.

---

### Sources / further reading

- [Elementor AI overview](https://elementor.com/products/ai/)
- [Elementor AI guide — features & credits (The Plus Addons)](https://theplusaddons.com/blog/how-to-use-elementor-ai/)
- [Elementor One review (WP Marmite)](https://wpmarmite.com/en/elementor-ai/)
- [AI Site Planner overview (Essential Addons)](https://essential-addons.com/elementor-ai-website-planner/)
- Repo docs: [ROADMAP.md](../ROADMAP.md) ·
  [WORDPRESSDEPLOYMENT.md](../WORDPRESSDEPLOYMENT.md) ·
  [claude-code-wordpress-setup.md](claude-code-wordpress-setup.md)
