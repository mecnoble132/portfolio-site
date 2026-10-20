// Mobile menu, active-link highlight, and smooth in-page anchor scrolling.
export function initNav() {
  const toggle = document.querySelector("#menu-toggle");
  const links = document.querySelector("#nav-links");

  const setOpen = (open) => {
    links.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
  };

  toggle.addEventListener("click", () => setOpen(toggle.getAttribute("aria-expanded") !== "true"));
  links.addEventListener("click", (e) => {
    if (e.target.closest("a")) setOpen(false);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setOpen(false);
  });

  // Only in-page anchors are tracked; the current page's own link is marked in the HTML (aria-current="page").
  const navLinks = [...links.querySelectorAll("a[href^='#']")];
  const sections = navLinks
    .map((a) => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((a) => {
          const active = a.getAttribute("href") === `#${entry.target.id}`;
          a.classList.toggle("is-active", active);
          if (active) a.setAttribute("aria-current", "true");
          else a.removeAttribute("aria-current");
        });
      });
    },
    { rootMargin: "-40% 0px -55% 0px" }
  );
  sections.forEach((s) => observer.observe(s));

  initAnchors();
}

// Smooth-scroll in-page links on click only (a global CSS smooth scroll breaks ScrollTrigger's measuring).
function initAnchors() {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  document.addEventListener("click", (e) => {
    const link = e.target.closest("a[href^='#']");
    if (!link || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey) return;

    const id = link.getAttribute("href").slice(1);
    const target = id ? document.getElementById(id) : document.body;
    if (!target) return;

    e.preventDefault();
    // A pinned section moves while pinned; its spacer is a stable stand-in for its position.
    const anchor = target.closest(".pin-spacer") || target;
    const top = id ? anchor.getBoundingClientRect().top + window.scrollY : 0;
    window.scrollTo({ top, behavior: reduceMotion.matches ? "auto" : "smooth" });
    history.pushState(null, "", id ? `#${id}` : location.pathname + location.search);
  });
}
