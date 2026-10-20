import { projects } from "../data/projects.js";

const VIEW_KEY = "projects-view";

const make = (tag, className, text) => {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (text) el.textContent = text;
  return el;
};

function link(label, href, className) {
  const a = make("a", className, label);
  a.href = href;
  if (href.startsWith("http")) {
    a.target = "_blank";
    a.rel = "noopener noreferrer";
  }
  return a;
}

function createItem(project, index) {
  const item = make("li", "p-item");

  const media = make("a", "p-item__media");
  media.href = project.live;
  media.tabIndex = -1;
  media.setAttribute("aria-hidden", "true");
  if (project.image) {
    media.append(
      Object.assign(document.createElement("img"), {
        src: project.image,
        alt: "",
        loading: index < 4 ? "eager" : "lazy",
        decoding: "async",
        width: 320,
        height: 200,
      })
    );
  } else {
    const ph = make("div", "ph");
    ph.style.setProperty("--hue", String([152, 175, 128, 88, 190][index % 5]));
    media.append(ph);
  }

  const main = make("div", "p-item__main");
  const title = make("h2", "p-item__title");
  title.append(link(project.title, project.live));
  const tags = make("ul", "tags");
  tags.append(...project.tags.map((tag) => make("li", "", tag)));
  main.append(title, make("p", "p-item__desc", project.description), tags);

  const actions = make("div", "p-item__actions");
  actions.append(link("Live demo ↗", project.live, "btn btn--primary"), link("Source ↗", project.source, "btn"));

  item.append(media, main, actions);
  return item;
}

export function initProjects() {
  const list = document.querySelector("#pp-list");
  const search = document.querySelector("#pp-search");
  const chips = document.querySelector("#pp-chips");
  const count = document.querySelector("#pp-count");
  const empty = document.querySelector("#pp-empty");
  const viewButtons = [...document.querySelectorAll("[data-view]")];

  // Featured first, then data-file order
  const ordered = [...projects].sort((a, b) => Number(b.featured) - Number(a.featured));
  const items = ordered.map((project, i) => ({ project, el: createItem(project, i) }));
  list.append(...items.map((i) => i.el));

  const categories = ["All", ...new Set(projects.map((p) => p.category).filter(Boolean))];
  const params = new URLSearchParams(location.search);
  let tag = categories.includes(params.get("tag")) ? params.get("tag") : "All";
  let query = params.get("q") || "";
  let view = params.get("view");
  if (view !== "grid" && view !== "list") {
    try {
      view = localStorage.getItem(VIEW_KEY);
    } catch {}
  }
  if (view !== "grid") view = "list";

  const chipButtons = categories.map((label) => {
    const btn = make("button", "chip", label);
    btn.type = "button";
    btn.addEventListener("click", () => {
      tag = label;
      update();
    });
    return btn;
  });
  chips.append(...chipButtons);

  viewButtons.forEach((btn) =>
    btn.addEventListener("click", () => {
      view = btn.dataset.view;
      try {
        localStorage.setItem(VIEW_KEY, view);
      } catch {}
      update();
    })
  );

  search.addEventListener("input", () => {
    query = search.value;
    update();
  });
  document.querySelector("#pp-reset").addEventListener("click", () => {
    tag = "All";
    query = "";
    search.value = "";
    update();
    search.focus();
  });
  // "/" jumps to search, like most dev tools
  window.addEventListener("keydown", (e) => {
    if (e.key === "/" && document.activeElement !== search && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      search.focus();
    }
  });

  function update() {
    const q = query.trim().toLowerCase();
    let shown = 0;
    items.forEach(({ project, el }) => {
      const haystack = [project.title, project.description, project.category, ...project.tags].join(" ").toLowerCase();
      const match = (tag === "All" || project.category === tag) && (!q || haystack.includes(q));
      el.hidden = !match;
      if (match) shown++;
    });

    chipButtons.forEach((btn) => btn.setAttribute("aria-pressed", String(btn.textContent === tag)));
    viewButtons.forEach((btn) => btn.setAttribute("aria-pressed", String(btn.dataset.view === view)));
    list.dataset.view = view;
    empty.hidden = shown > 0;
    count.textContent = shown === projects.length ? `${shown} projects` : `Showing ${shown} of ${projects.length} projects`;

    const next = new URLSearchParams();
    if (tag !== "All") next.set("tag", tag);
    if (q) next.set("q", query.trim());
    if (view === "grid") next.set("view", "grid");
    history.replaceState(null, "", next.size ? `?${next}` : location.pathname);
  }

  search.value = query;
  update();
}
