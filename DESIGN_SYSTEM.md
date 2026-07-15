# 24/7 Golf — Design System

> **Read this before building any page.** All design decisions live here. Do not introduce new colors, fonts, or spacing values without updating this file.

---

## Brand Identity

**Positioning:** Michigan's premier indoor golf experience — premium, athletic, accessible 24/7  
**Tone:** Confident, modern, welcoming to all skill levels  
**Visual direction:** Dark/moody with vibrant green accents — think upscale sports lounge, not country club

---

## Color Palette

All colors are defined as CSS custom properties in `css/variables.css`.

| Token | Hex | Usage |
|-------|-----|-------|
| `--black` | `#0a0a0a` | Page background |
| `--dark` | `#111317` | Secondary background |
| `--card` | `#161a20` | Card/section backgrounds |
| `--green` | `#2ecc71` | Primary CTA, links, highlights |
| `--green-dim` | `#1a9e50` | Green hover state |
| `--green-glow` | `rgba(46,204,113,0.18)` | Glows, shadows behind green elements |
| `--white` | `#f5f7f2` | Body text, headings |
| `--muted` | `#8a9080` | Secondary text, captions |
| `--gold` | `#c9a84c` | Trackman badge, premium accents |
| `--border` | `rgba(255,255,255,0.07)` | Subtle dividers, card borders |

**Rules:**
- Never use pure white (`#ffffff`) — always use `--white`
- Green is for CTAs and key highlights only — don't overuse it
- Gold is reserved exclusively for Trackman branding and premium callouts

---

## Typography

Fonts are loaded from Google Fonts. Always include the `<link>` in `<head>`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&family=Barlow+Condensed:wght@400;500;600;700;800&display=swap" rel="stylesheet">
```

| Font | Variable | Usage |
|------|----------|-------|
| **Bebas Neue** | `font-family: 'Bebas Neue', sans-serif` | Hero headlines, section titles, large display text |
| **Barlow Condensed** | `font-family: 'Barlow Condensed', sans-serif` | Nav links, labels, badges, stat numbers |
| **Barlow** | `font-family: 'Barlow', sans-serif` | Body copy, descriptions, all paragraph text |

**Type scale:**
```
Hero headline:    Bebas Neue, clamp(3rem, 8vw, 7rem), letter-spacing: 2px
Section title:    Bebas Neue, clamp(2rem, 5vw, 3.5rem)
Card title:       Barlow Condensed 700, 1.4rem, uppercase, letter-spacing: 1px
Body:             Barlow 400, 1rem / 1.6
Small/label:      Barlow Condensed 600, 0.85rem, uppercase, letter-spacing: 1.5px
Nav:              Barlow Condensed 600, 0.95rem, uppercase, letter-spacing: 1.5px
```

---

## Spacing

Use multiples of 8px. CSS custom properties:

```css
--space-xs:   8px
--space-sm:   16px
--space-md:   24px
--space-lg:   48px
--space-xl:   80px
--space-2xl:  120px
```

Section padding: `padding: var(--space-xl) 5vw` (desktop), `padding: var(--space-lg) 5vw` (mobile)

---

## Components

### Buttons

```html
<!-- Primary CTA -->
<a href="#" class="btn btn-primary">Book a Bay</a>

<!-- Secondary / Outline -->
<a href="#" class="btn btn-outline">Learn More</a>

<!-- Small label style -->
<span class="badge">Trackman iO</span>
```

```css
.btn {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 14px 32px; border-radius: 4px;
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 1rem; font-weight: 700;
  letter-spacing: 1.5px; text-transform: uppercase;
  text-decoration: none; cursor: pointer;
  transition: all .2s;
}
.btn-primary {
  background: var(--green); color: var(--black);
  border: 2px solid var(--green);
}
.btn-primary:hover { background: var(--green-dim); border-color: var(--green-dim); }
.btn-outline {
  background: transparent; color: var(--white);
  border: 2px solid rgba(255,255,255,0.3);
}
.btn-outline:hover { border-color: var(--green); color: var(--green); }
```

### Cards

```css
.card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: var(--space-md);
  transition: border-color .2s, transform .2s;
}
.card:hover {
  border-color: rgba(46,204,113,0.3);
  transform: translateY(-3px);
}
```

### Location Compact Row

See `components/location-card.html` for the full snippet.

```
[Location Name]    [City, MI]    [Tag: e.g. Pickleball]    [Book Now →]
```

### Badges / Tags

```html
<span class="tag">Pickleball</span>
<span class="tag tag-gold">Trackman iO</span>
```

---

## Layout

**Max content width:** `1200px`, centered with `margin: 0 auto`  
**Side padding:** `5vw` on all sections  
**Grid:** CSS Grid preferred. Standard 3-col card grid:

```css
.grid-3 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-md);
}
@media (max-width: 768px) {
  .grid-3 { grid-template-columns: 1fr; }
}
```

---

## Scroll Reveal Animation

All sections use a consistent fade-up reveal. Add `class="reveal"` to any element:

```css
.reveal {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}
.reveal.visible {
  opacity: 1;
  transform: translateY(0);
}
```

JS observer is in `js/main.js` — it runs automatically on all `.reveal` elements.

---

## Responsive Breakpoints

```css
/* Tablet */
@media (max-width: 1024px) { ... }

/* Mobile */
@media (max-width: 768px) { ... }

/* Small mobile */
@media (max-width: 480px) { ... }
```

Mobile nav: hamburger menu toggles `.nav-open` class on `<body>`.

---

## Navigation Structure

```
Logo | Locations | How It Works | Get the App | FAQ | [Book Now] CTA
```

- **Logo:** two-tone — `24/7` in `--green` (`.nav-logo-accent`), `GOLF` in `--white`.
- **Links:** animated green underline on hover (desktop only).
- **Scrolled state:** `main.js` adds `.scrolled` to the nav after 20px of scroll. The
  header starts translucent and floating, then condenses (64px) to a solid background
  with a drop shadow.
- **CTA:** green button with a green glow + slight lift on hover.

On mobile: hamburger (morphs into an X when open) → slide-down menu anchored to the nav.

---

## Footer Structure

```
[Logo + tagline]    [Quick Links]    [Locations]    [Contact + Social]

© 2026 24/7 Golf. All rights reserved. | Phone: 616.350.9482
Social: Facebook | Instagram | TikTok
```

---

## Page Template Checklist

Every new page must include:
- [ ] `<link>` to Google Fonts (Bebas Neue + Barlow + Barlow Condensed)
- [ ] `<link>` to `../css/variables.css`
- [ ] `<link>` to `../css/base.css`
- [ ] `<link>` to `../css/components.css`
- [ ] Navigation (copy from `components/nav.html`)
- [ ] Footer (copy from `components/footer.html`)
- [ ] `<script src="../js/main.js">` before `</body>`
- [ ] `class="reveal"` on all major sections
- [ ] Responsive meta tag: `<meta name="viewport" content="width=device-width, initial-scale=1.0">`
