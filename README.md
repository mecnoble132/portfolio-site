# Developer Portfolio

A minimal single-page portfolio in plain HTML, CSS, and vanilla JS. No build step.

## Run locally
ES modules need a server (opening `index.html` directly won't work):

```bash
npx live-server --port=5500
```

## Edit your content
| To change | Edit |
|---|---|
| Name, pitch, bio, skills, email, social links | `data/site.js` |
| Projects (add, remove, feature, categorize) | `data/projects.js` + images in `assets/images/` |
| Colors, fonts, spacing | `css/tokens.css` |
| Resume | replace `assets/resume.pdf` (keep the filename) |

## Turn on the contact form
1. Create a form at [Formspree](https://formspree.io) or [Web3Forms](https://web3forms.com).
2. Paste its endpoint URL into `formEndpoint` in `data/site.js`.

Until then the form validates and tells visitors to use email instead.

## Before launch checklist
- [ ] Replace every placeholder in `data/site.js` and `data/projects.js`
- [ ] Replace `assets/resume.pdf`
- [ ] Set your real domain in `index.html` (canonical, `og:url`, JSON-LD), `robots.txt`, `sitemap.xml`
- [ ] Add a 1200x630 `assets/images/og.png` and an `og:image` / `twitter:image` meta tag
- [ ] Update the title/description/JSON-LD name in `index.html` (they are static for crawlers)
- [ ] Run Lighthouse

## Deploy
Static site: drag the folder into Vercel or Netlify, or push to GitHub Pages.
