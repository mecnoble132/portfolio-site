# Product Requirements Document: Developer Portfolio Site

## 1. Overview
A minimal, fast, single-page portfolio website for a software developer. Its primary purpose is to be the **one link** the owner sends whenever someone asks "can I see your portfolio / previous work?" Visitors should understand who the owner is and see their best projects within seconds.

> **Update:** the site is split into a showpiece homepage (`index.html`) and a plain quick-review page (`projects.html`) for visitors who only want to see the work. See `CLAUDE.md` for the current structure.

## 2. Goals
1. **Primary:** Make the Projects section the strongest, most scannable part of the site, so a shared link immediately answers "show me your work."
2. **Secondary:** Provide supporting sections (About, Skills, Resume, Contact) so the site works as a complete professional presence.
3. Load fast, look clean on any device, and be easy for the owner to update without touching much code.

## 3. Non-Goals (v1)
- No blog or CMS.
- No user accounts, backend, or database.
- No heavy frameworks or build tooling.

## 4. Target Audience
| Visitor | What they want |
|---|---|
| Recruiters / hiring managers | Quick proof of skills, resume, contact info |
| Potential clients | Examples of finished work, ways to get in touch |
| Peers / collaborators | Live demos, source code, tech used |

Most visitors arrive from a direct link (message, email, résumé) and spend under a minute on the page.

## 5. Key User Flow
1. Owner shares the link.
2. Visitor lands on the hero: name, role, one-line pitch, and a **"View my work"** button.
3. Visitor jumps to or scrolls into Projects, opens a live demo or GitHub repo.
4. Visitor optionally reads About/Skills, downloads the resume, or sends a message.

## 6. Features and Requirements

### 6.1 Navigation (sticky header)
- Links: Work, About, Skills, Contact; Resume button; theme toggle.
- Smooth scroll to sections; active section highlighted.
- Collapses to a simple menu on mobile.

### 6.2 Hero
- Name, role/title, one-sentence pitch.
- Two calls to action: **View my work** (scrolls to Projects) and **Contact me**.
- Optional short status line (e.g. "Open to work" / "Available for freelance").

### 6.3 Projects (primary section, placed directly after hero)
- Grid of project cards, each with: title, short description, tech tags, screenshot or preview image, **Live demo** link, **Source code** link.
- Optional "Featured" flag so the 2-3 best projects appear first and larger.
- Optional tag filter (e.g. All / Web / Tools / Open Source).
- Projects defined in a single data file (`projects.js`/JSON) so adding one never requires editing HTML.

### 6.4 About
- Short bio, photo (optional), what the owner is looking for or currently focused on.

### 6.5 Skills + Resume
- Grouped skills (Languages, Frameworks, Tools).
- Optional experience/education timeline.
- **Download resume** button (PDF).

### 6.6 Contact
- Direct links: email, GitHub, LinkedIn (plus any others).
- Working contact form (name, email, message) with validation and success/error states, using a third-party form service (no custom backend).

### 6.7 Cross-cutting
- **Theme toggle:** light/dark, respects system preference, remembers choice.
- **Animations:** subtle scroll-reveal and hover effects; honors `prefers-reduced-motion`.
- **SEO:** title, meta description, Open Graph and Twitter card tags (so the shared link shows a clean preview), favicon, sitemap, robots.txt, semantic HTML.
- **Accessibility:** WCAG AA contrast, keyboard navigable, visible focus states, alt text.

## 7. Success Criteria
- Lighthouse scores 90+ across Performance, Accessibility, Best Practices, SEO.
- Link preview renders correctly when pasted into WhatsApp, LinkedIn, Slack, email.
- A new project can be added in under 2 minutes by editing one data file.
- Fully usable at 360px width and up.

## 8. Content Needed From Owner
- Name, role, one-line pitch, bio, photo
- 3-6 projects: title, description, tech, screenshot, live + repo links
- Skills list, resume PDF
- Email, GitHub, LinkedIn URLs
- Domain name (optional)

## 9. Milestones
1. Scaffold structure, base styles, theme system
2. Hero, nav, Projects section with data file
3. About, Skills, Resume, Contact (form wired up)
4. Animations, SEO, accessibility pass
5. Fill with real content, test, deploy

## 10. Open Questions
- Which form service will be used (Formspree, Web3Forms, Netlify Forms)?
- Custom domain or default host URL?
- Will a blog or case studies be added in a later version?
