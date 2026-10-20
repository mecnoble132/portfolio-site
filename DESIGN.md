# Design Guide

> **Update:** the site is now two pages with two different personalities.
> - **Fonts (both pages):** *Instrument Serif* for display headings, logo and numerals (400 only, italics for emphasis), *Geist* for body/UI, *Geist Mono* for labels and the terminal. These replace Inter everywhere below; tokens are `--font`, `--font-display`, `--font-mono`.
> - **Colors:** the blue accent is retired. Current palette (see `css/tokens.css`, which is the source of truth): green-tinted neutral surfaces, emerald accent (`#0b7a4b` light, `#3ddc84` dark) and lime `--accent-2`. The homepage Work section is always a dark "stage" in both themes.
> - **Nav:** identical on both pages: logo, Work, Projects, About, Contact, Resume, theme toggle. 72px tall on mobile, 80px on desktop (`--nav-h`). It is NOT sticky and has NO background: it is simply the top row of the page and scrolls away with it (on the homepage it overlays the hero; only the opened mobile menu panel has a solid background). The only sticky element is the Projects page search toolbar. Page gutters use `--gutter` (20/28/32px). The hero has no gradients (flat background, particles only).
> - **Work strip:** pins and scrolls sideways when the window is at least 800px wide and 520px tall. Under 700px tall the cards go compact (no description or tags) so they always fit; smaller windows fall back to a native swipe row.
> - **Cursor (homepage, mouse only):** glowing orb with a comet tail; swells into a labelled bubble ("View") over project artwork, shrinks and ripples on click.
> - **Gotcha:** never put `scroll-behavior: smooth` on `html`; it breaks ScrollTrigger's measuring. In-page links are smoothed in `js/nav.js`.
> - **`projects.html`** follows this guide as written: minimal, quiet, scannable (list or grid, search, chips).
> - **`index.html`** is a deliberate showpiece: dark-leaning cinematic look with a blue-to-magenta gradient accent (`--accent` + `--accent-2`), oversized typography (`--fs-hero`, `--fs-display`), film grain, particle hero, pinned horizontal project strip, marquee, custom cursor, and heavy motion. Motion rules still apply: everything is disabled for `prefers-reduced-motion`, and content must stay readable without it.

## 1. Design Principles
- **Minimal & clean.** Generous whitespace, few elements, no decoration for its own sake.
- **Work first.** Projects get the most visual weight; everything else supports them.
- **Quiet confidence.** Restrained palette, strong typography, subtle motion.
- **Scannable.** A visitor with 30 seconds should still get the full picture.

## 2. Layout
- Single page, vertical sections in this order: **Hero, Projects, About, Skills + Resume, Contact, Footer**.
- Content max-width: `1080px`, centered. Prose max-width: `640px`.
- Section vertical padding: `96px` desktop, `64px` mobile.
- 12-column feel on desktop; projects grid is 2 columns (featured projects may span full width); 1 column on mobile.
- Breakpoints: `640px` (tablet), `960px` (desktop).

## 3. Color System
Defined as CSS custom properties; both themes share the same names.

| Token | Light | Dark |
|---|---|---|
| `--bg` | `#FFFFFF` | `#0E0E10` |
| `--surface` | `#F6F6F7` | `#17171A` |
| `--border` | `#E4E4E7` | `#2A2A2F` |
| `--text` | `#111113` | `#F2F2F3` |
| `--text-muted` | `#5C5C66` | `#A0A0AB` |
| `--accent` | `#2F5BFF` | `#6B8CFF` |
| `--accent-contrast` | `#FFFFFF` | `#0E0E10` |

Rules: one accent color only, used for links, primary buttons, and focus rings. Text contrast must meet WCAG AA.

## 4. Typography
- **Font:** `Inter` (variable) with system fallback `system-ui, -apple-system, "Segoe UI", sans-serif`. Optional monospace for tech tags: `"JetBrains Mono", ui-monospace, monospace`.
- Fluid scale using `clamp()`:

| Role | Size | Weight | Line height |
|---|---|---|---|
| Hero title | `clamp(2.5rem, 6vw, 4.5rem)` | 700 | 1.1 |
| Section heading | `clamp(1.75rem, 3vw, 2.25rem)` | 600 | 1.2 |
| Card title | `1.25rem` | 600 | 1.3 |
| Body | `1rem` (16px) | 400 | 1.65 |
| Small / tags | `0.8125rem` | 500 | 1.4 |

- Tight letter-spacing on large headings (`-0.02em`).

## 5. Spacing and Shape
- 4px base scale: 4, 8, 12, 16, 24, 32, 48, 64, 96.
- Border radius: `12px` for cards, `8px` for buttons/inputs, `999px` for tags.
- Borders over shadows: 1px `--border`. Shadows only on hover, very soft.

## 6. Components

### Navigation
Sticky, translucent background with blur, 1px bottom border on scroll. Logo/name left, links center or right, theme toggle and Resume button at far right. Mobile: hamburger opening a simple full-width panel.

### Buttons
- **Primary:** accent background, accent-contrast text.
- **Secondary:** transparent, 1px border, text color.
- Height 44px minimum (touch target), clear focus ring (2px accent, 2px offset).

### Project Card (key component)
- Image on top (16:10), rounded, subtle border.
- Title, 2-line description, row of tech tags, then two text links: **Live demo ↗** and **Source ↗**.
- Hover: lift by 2-4px, soft shadow, image scales slightly (1.02).
- Featured cards: larger, span full width on desktop.

### Tags
Small pill, `--surface` background, muted text, monospace optional.

### Form
Labeled inputs (no placeholder-only labels), 1px border, accent focus ring, inline validation messages, clear success and error states.

## 7. Motion
- Duration 200-300ms, easing `cubic-bezier(0.2, 0.6, 0.2, 1)`.
- Scroll reveal: fade + 12px upward translate, staggered by 60ms within a group, triggered once via IntersectionObserver.
- Theme switch: smooth color transition (200ms).
- **Respect `prefers-reduced-motion`:** disable transforms and transitions beyond opacity.

## 8. Imagery
- Project screenshots in consistent aspect ratio and style (browser-frame mockups optional).
- WebP/AVIF, max 1200px wide, lazy-loaded.
- Optional profile photo: circular or softly rounded, 160-240px.
- Icons: simple line icons (inline SVG), 20-24px, 1.5px stroke.

## 9. Accessibility
- AA contrast in both themes.
- Visible focus on every interactive element.
- Semantic landmarks (`header`, `nav`, `main`, `section`, `footer`).
- Alt text on images; `aria-label` on icon-only buttons (theme toggle, menu).
- Fully keyboard navigable; skip-to-content link.

## 10. Sharing Preview
Open Graph image `1200x630`: name, role, and clean background in the same style, so the link looks polished when sent in chats and emails.
