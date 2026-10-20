# CLAUDE.md

Guidance for Claude (or any AI coding assistant) working in this repository.

## Project
A two-page developer portfolio:
- **`index.html`** is a showpiece: bold design, lots of animation (preloader, particle hero, pinned horizontal project strip, scroll-driven text, custom cursor, terminal, easter egg). It should impress.
- **`projects.html`** is the opposite: a plain, fast, searchable list for people who just want a quick look at the work. Keep it simple, no show-off. This is the page the owner sends to recruiters.

Both read the same `data/` files. Read `PRD.md`, `DESIGN.md`, and `TECH_STACK.md` for background; where they say "minimal single page", this file wins.

## Stack (do not change without asking)
- Plain HTML, CSS, and vanilla JavaScript (ES modules). No frameworks, no bundler, no build step.
- **Allowed dependency: GSAP + ScrollTrigger** from cdnjs (pinned version, homepage only). No Three.js or others without asking.
- The homepage must degrade gracefully: if GSAP fails to load or `prefers-reduced-motion` is set, show a complete, static page (`html.anim` gates all animated states).
- Hosting: static (Vercel, Netlify, or GitHub Pages).
- Contact form via a third-party service (no custom backend).

## Project Structure
```
/
├── index.html          # showpiece homepage
├── projects.html       # quick-review projects page
├── css/
│   ├── tokens.css      # design tokens (colors, type, spacing)
│   ├── base.css        # reset + element defaults
│   ├── components.css  # shared: nav, buttons, tags, form, footer
│   ├── home.css        # homepage only
│   └── projects.css    # projects page only
├── js/
│   ├── main.js         # homepage entry point
│   ├── projects-page.js# projects page entry point
│   ├── sections.js     # fills text/skills/marquee from data/site.js
│   ├── work.js         # homepage featured-project strip
│   ├── projects.js     # projects page list, search, filters, URL state
│   ├── hero.js         # split text + particle canvas + entrance
│   ├── preloader.js    # intro counter
│   ├── scroll.js       # GSAP scroll effects (progress, marquee, pin, text fill, reveals)
│   ├── cursor.js       # custom cursor + magnetic buttons
│   ├── effects.js      # tilt, spotlight, terminal, konami
│   ├── nav.js          # mobile menu + active section
│   ├── theme.js        # light/dark toggle (circle-wipe)
│   └── contact.js      # form validation + submit
├── data/
│   ├── site.js         # name, bio, skills, links, form endpoint
│   └── projects.js     # ALL project content lives here
├── assets/
│   ├── images/
│   ├── icons/
│   └── resume.pdf
├── robots.txt
├── sitemap.xml
└── README.md
```

## Rules
1. **Content is data.** Projects, skills, and links live in `data/` files. Never hardcode project content in HTML.
2. **Use design tokens.** Never hardcode colors, font sizes, or spacing; use CSS custom properties from `tokens.css`. Both themes must work.
3. **Keep it light.** No dependencies beyond GSAP (see Stack). No jQuery, no CSS frameworks. Prefer native browser features. `projects.html` loads no animation library.
4. **Mobile first.** Write base styles for small screens, enhance upward. Test at 360px.
5. **Accessibility is required.** Semantic HTML, alt text, visible focus, keyboard support, AA contrast, respect `prefers-reduced-motion`.
6. **SEO basics stay intact.** Don't remove meta/Open Graph tags or the sitemap.
7. **Performance budget.** Images optimized (WebP/AVIF, sized, `loading="lazy"` below the fold). Aim for Lighthouse 90+.
8. **Small, focused changes.** One concern per change; don't reformat unrelated files.

## Code Style
- 2-space indentation, double quotes in JS, semicolons.
- `camelCase` for JS, `kebab-case` for CSS classes and filenames.
- BEM-style class naming (`.project-card__title`).
- Short comments only where intent isn't obvious.

## Common Tasks
- **Add a project:** add an object to `data/projects.js` and drop its image in `assets/images/`. No other file should need editing. Set `featured: true` to put it on the homepage strip.
- **Change name, bio, skills, links:** edit `data/site.js` (and the static title/meta/JSON-LD in the two HTML files).
- **Change colors/fonts:** edit `css/tokens.css` only.
- **Update resume:** replace `assets/resume.pdf`, keeping the filename.

## Before Finishing Any Task
- Check both light and dark themes.
- Check mobile and desktop widths.
- Check keyboard navigation.
- Confirm no console errors.

## Don'ts
- Don't add a framework, build tool, or backend without asking.
- Don't invent project content, links, or personal details; use clearly marked placeholders.
- Don't add tracking or analytics without asking.
