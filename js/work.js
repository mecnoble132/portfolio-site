import { projects } from "../data/projects.js";

// Green-family placeholder hues (emerald, teal, forest, lime, aqua) until real screenshots exist
const HUES = [152, 175, 128, 88, 190];

const make = (tag, className, text) => {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (text) el.textContent = text;
  return el;
};

function createCard(project, index) {
  const card = make("article", "work-card");

  // The art layer is wider than the frame so it can drift (parallax) while the strip scrolls.
  const media = make("div", "work-card__media");
  if (project.image) {
    const img = Object.assign(document.createElement("img"), {
      src: project.image,
      alt: `Screenshot of ${project.title}`,
      loading: "lazy",
      width: 1200,
      height: 750,
    });
    img.className = "work-card__art";
    media.append(img);
  } else {
    const art = make("div", "work-card__art ph");
    art.style.setProperty("--hue", String(HUES[index % HUES.length]));
    media.setAttribute("aria-hidden", "true");
    media.append(art);
  }
  media.append(make("span", "work-card__num", String(index + 1).padStart(2, "0")));
  media.dataset.cursor = "View"; // label shown by the custom cursor (artwork only, so the links below stay clickable)

  const tags = make("ul", "tags");
  tags.append(...project.tags.map((tag) => make("li", "", tag)));

  const links = make("div", "work-card__links");
  [
    ["Live demo ↗", project.live],
    ["Source ↗", project.source],
  ].forEach(([label, href]) => {
    const a = make("a", "", label);
    a.href = href;
    if (href.startsWith("http")) a.rel = "noopener";
    links.append(a);
  });

  card.append(media, make("h3", "work-card__title", project.title), make("p", "work-card__desc", project.description), tags, links);
  return card;
}

// Featured projects first (up to 4), then a card linking to the full list.
export function renderWork(track) {
  const featured = projects.filter((p) => p.featured);
  const picks = (featured.length ? featured : projects).slice(0, 4);
  track.append(...picks.map(createCard));

  const all = make("a", "work-card work-card--all");
  all.href = "projects.html";
  all.append(make("span", "", "Quick review"), make("strong", "", `See all ${projects.length} projects`), make("i", "", "→"));
  all.dataset.magnetic = "";
  all.dataset.cursor = "All";
  track.append(all);
}
