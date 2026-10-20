import { renderSite } from "./sections.js";
import { renderWork } from "./work.js";
import { initTheme } from "./theme.js";
import { initNav } from "./nav.js";
import { initContact } from "./contact.js";
import { runPreloader } from "./preloader.js";
import { initHero } from "./hero.js";
import { initCursor, initMagnetic } from "./cursor.js";
import { initTilt, initSpotlight, initTerminal, initKonami } from "./effects.js";
import { initScroll } from "./scroll.js";

const root = document.documentElement;

// Build all content from data first, then layer on the effects.
renderSite();
renderWork(document.querySelector("#work-track"));
initTheme(document.querySelector("#theme-toggle"));
initNav();
initContact(document.querySelector("#contact-form"));
initSpotlight();
initKonami();

// "anim" is set in <head> unless the visitor prefers reduced motion.
const animate = root.classList.contains("anim") && window.gsap && window.ScrollTrigger;

if (!animate) {
  root.classList.remove("anim");
  document.querySelector(".preloader")?.remove();
  initHero({ animated: false });
  initTerminal({ instant: true });
} else {
  try {
    const hero = initHero({ animated: true });
    initTilt();
    await runPreloader();
    hero.play();
    initScroll();
    initCursor();
    initMagnetic();
    initTerminal();
  } catch (error) {
    // Never leave the page hidden or stuck: fall back to the plain version.
    console.error(error);
    root.classList.remove("anim");
    document.body.classList.remove("is-loading");
    document.querySelector(".preloader")?.remove();
    gsap.set(".char, .hero__status, .hero__kicker, .hero__pitch, .hero__actions, [data-reveal]", { clearProps: "all" });
  }
}
