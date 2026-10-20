const KEY = "theme";
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function getInitialTheme() {
  try {
    const saved = localStorage.getItem(KEY);
    if (saved) return saved;
  } catch {}
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme, button) {
  document.documentElement.dataset.theme = theme;
  button.setAttribute("aria-pressed", String(theme === "dark"));
  button.textContent = theme === "dark" ? "☀" : "☾";
}

export function initTheme(button) {
  let theme = getInitialTheme();
  applyTheme(theme, button);

  button.addEventListener("click", () => {
    theme = theme === "dark" ? "light" : "dark";
    try {
      localStorage.setItem(KEY, theme);
    } catch {}
    const change = () => applyTheme(theme, button);

    if (!document.startViewTransition || reduceMotion.matches) {
      change();
      return;
    }

    // Circle wipe expanding from the toggle button
    const rect = button.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    const root = document.documentElement;
    root.classList.add("theme-switching");
    const transition = document.startViewTransition(change);
    transition.ready.then(() =>
      root.animate(
        { clipPath: [`circle(0 at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration: 600, easing: "ease-in-out", pseudoElement: "::view-transition-new(root)" }
      )
    );
    transition.finished.finally(() => root.classList.remove("theme-switching"));
  });
}
