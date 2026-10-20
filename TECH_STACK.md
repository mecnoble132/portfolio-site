# Tech Stack

## Summary
A zero-build, static site using plain HTML, CSS, and vanilla JavaScript. Chosen for speed, simplicity, and because the site is a single page of mostly static content that a framework would only complicate.

> **Update:** the homepage uses **GSAP + ScrollTrigger** (cdnjs, pinned 3.12.5, loaded with `defer`) for scroll and text animation, with a custom canvas particle field instead of Three.js. `projects.html` uses no animation library. Cross-page fades use the native CSS `@view-transition`; the theme switch uses the View Transitions API with a fallback.

## Core
| Layer | Choice | Why |
|---|---|---|
| Markup | HTML5 (semantic) | Accessibility and SEO by default |
| Styling | Modern CSS (custom properties, Grid, Flexbox, `clamp()`) | No framework needed; easy theming |
| Scripting | Vanilla JS (ES modules) | Tiny payload, no build step |
| Fonts | Inter (self-hosted or Google Fonts with `display=swap`) | Clean, readable, minimal |
| Icons | Inline SVG | No icon library dependency |

## Feature Implementation
| Feature | Approach |
|---|---|
| Theme toggle | `data-theme` attribute on `<html>`, CSS variables, saved in `localStorage`, defaults to `prefers-color-scheme` |
| Animations | CSS transitions + `IntersectionObserver` for scroll reveal; honors `prefers-reduced-motion` |
| Projects rendering | JS renders cards from `data/projects.js` (single source of truth) |
| Contact form | Third-party endpoint (Formspree or Web3Forms) via `fetch`, with client-side validation and a honeypot field for spam |
| SEO | Meta description, Open Graph + Twitter tags, canonical URL, `sitemap.xml`, `robots.txt`, JSON-LD `Person` schema |
| Resume | Static PDF in `assets/`, linked with `download` attribute |

## Tooling (optional, dev only)
- **Prettier** for formatting
- **Lighthouse** for performance/accessibility/SEO audits
- **Squoosh or `sharp`** for image optimization (WebP/AVIF)
- A simple local server (`npx serve` or VS Code Live Server) for development

No `package.json` is required to run the site.

## Hosting and Deployment
- **Recommended:** Vercel (drag-and-drop or Git-connected, free tier, automatic HTTPS, preview URLs)
- **Alternatives:** Netlify, GitHub Pages, Cloudflare Pages
- Custom domain via the host's DNS settings
- Deploy flow: push to Git, host auto-deploys

## Browser Support
Latest two versions of Chrome, Edge, Safari, and Firefox, plus current iOS Safari and Android Chrome.

## Performance Targets
- Total page weight under 500 KB excluding project images
- Lighthouse 90+ in all four categories
- LCP under 2.5s on a mid-range mobile connection

## When to Reconsider
Move to **Astro** or **Next.js** only if the site grows to include a blog, many case-study pages, or CMS-driven content. The data-driven structure here is designed to make that migration straightforward.
