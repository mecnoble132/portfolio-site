import { renderSite } from "./sections.js";
import { initTheme } from "./theme.js";
import { initNav } from "./nav.js";
import { initProjects } from "./projects.js";

renderSite();
initTheme(document.querySelector("#theme-toggle"));
initNav();
initProjects();
