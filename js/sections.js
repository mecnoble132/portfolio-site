import { site } from "../data/site.js";
import { projects } from "../data/projects.js";

const make = (tag, className, text) => {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (text) el.textContent = text;
  return el;
};

// Fills elements marked data-site="key" / data-site-href="key|prefix" from data/site.js.
// Sections that exist only on some pages are skipped when missing.
export function renderSite() {
  document.querySelectorAll("[data-site]").forEach((el) => {
    el.textContent = site[el.dataset.site];
  });

  document.querySelectorAll("[data-site-href]").forEach((el) => {
    const [key, prefix = ""] = el.dataset.siteHref.split("|");
    el.href = prefix + site[key];
  });

  const statement = document.querySelector("#about-statement");
  if (statement) statement.textContent = site.bio.join(" ");

  const skills = document.querySelector("#skills-list");
  if (skills) {
    skills.append(
      ...site.skills.map(({ group, items }) => {
        const card = make("div", "skill-card");
        card.dataset.reveal = "";
        const list = make("ul", "tags");
        list.append(
          ...items.map(({ name, icon, learning }) => {
            const li = make("li", "skill");
            const mark = make("span", "skill__icon");
            // Resolved against the page: a url() inside a CSS variable is relative to the stylesheet otherwise
            mark.style.setProperty("--icon", `url("${new URL(`assets/icons/${icon}.svg`, document.baseURI).href}")`);
            mark.setAttribute("aria-hidden", "true");
            li.append(mark, name);
            if (learning) li.append(make("span", "skill__badge", "Learning"));
            return li;
          })
        );
        card.append(make("h3", "skill-card__title", group), list);
        return card;
      })
    );
  }

  const marquee = document.querySelector("#marquee");
  if (marquee) {
    const all = [...new Set(site.skills.flatMap((g) => g.items).map((s) => s.name))];
    [all, [...all].reverse()].forEach((items) => {
      const row = make("div", "marquee__row");
      const inner = make("div", "marquee__inner");
      // Two identical halves so the loop can wrap at -50%
      for (let copy = 0; copy < 2; copy++) {
        [...items, ...items].forEach((item) => {
          inner.append(make("span", "marquee__item", item), make("span", "marquee__sep", "✦"));
        });
      }
      row.append(inner);
      marquee.append(row);
    });
  }

  // Hero proof: stacked screenshots of featured projects + stats counted from the data files.
  const visual = document.querySelector("#hero-visual");
  if (visual) {
    projects
      .filter((p) => p.featured && p.image)
      .slice(0, 3)
      .forEach((p) => {
        const card = make("a", "hero__shot");
        card.href = p.live || "projects.html";
        card.target = "_blank";
        card.rel = "noopener";
        card.dataset.focus = p.live ? "Open live site ↗" : "View project";
        card.setAttribute("aria-label", `${p.title}: ${p.live ? "open live site (new tab)" : "view project"}`);
        const bar = make("div", "hero__shot-bar");
        bar.append(make("i"), make("i"), make("i"), make("span", "", p.title));
        const img = make("img");
        img.src = p.image;
        img.alt = "";
        img.width = 640;
        img.height = 400;
        card.append(bar, img);
        visual.append(card);
      });
  }

  const stats = document.querySelector("#hero-stats");
  if (stats) {
    const tech = new Set(projects.flatMap((p) => p.tags)).size;
    [
      [projects.length, "Projects shipped"],
      [projects.filter((p) => p.live).length, "Live websites"],
      [tech, "Technologies used"],
    ].forEach(([value, label]) => {
      const item = make("div", "hero__stat");
      item.append(make("dt", "", label), make("dd", "", String(value)));
      stats.append(item);
    });
  }
}
