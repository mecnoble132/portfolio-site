// Scroll-driven animation (GSAP + ScrollTrigger). Only called when animations are enabled.
export function initScroll() {
  gsap.registerPlugin(ScrollTrigger);

  progressBar();
  heroParallax();
  marquees();
  workStrip();
  aboutStatement();
  reveals();

  // Web fonts and images change element heights after first measure. Re-measure so pins and triggers land correctly.
  const refresh = () => ScrollTrigger.refresh();
  document.fonts?.ready.then(refresh);
  if (document.readyState === "complete") refresh();
  else window.addEventListener("load", refresh, { once: true });
}

function progressBar() {
  gsap.to(".progress", {
    scaleX: 1,
    ease: "none",
    scrollTrigger: { start: 0, end: "max", scrub: 0.2 },
  });
}

function heroParallax() {
  gsap.to(".hero__content", {
    yPercent: -18,
    opacity: 0,
    ease: "none",
    scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
  });
}

// Two rows scrolling in opposite directions; scroll speed adds a temporary boost.
function marquees() {
  const rows = [...document.querySelectorAll(".marquee__inner")];
  if (!rows.length) return;

  const tweens = rows.map((inner, i) => {
    const dir = i % 2 === 0 ? 1 : -1;
    const tween = gsap.fromTo(inner, { xPercent: dir === 1 ? 0 : -50 }, { xPercent: dir === 1 ? -50 : 0, duration: 40, ease: "none", repeat: -1 });
    return tween;
  });

  const state = { boost: 0 };
  const apply = () => tweens.forEach((t) => t.timeScale(1 + state.boost));

  ScrollTrigger.create({
    onUpdate: (self) => {
      const v = Math.min(Math.abs(self.getVelocity()) / 400, 6);
      gsap.to(state, {
        boost: v,
        duration: 0.1,
        overwrite: true,
        onUpdate: apply,
        onComplete: () => gsap.to(state, { boost: 0, duration: 0.9, onUpdate: apply }),
      });
    },
  });
}

// On wide screens the strip pins and scrolls sideways; elsewhere it stays a native swipe row.
function workStrip() {
  const section = document.querySelector(".work");
  const track = document.querySelector(".work__track");
  if (!section || !track) return;

  const cards = [...track.querySelectorAll(".work-card:not(.work-card--all)")];
  const count = section.querySelector(".work__count");
  const bar = section.querySelector(".work__bar i");
  const pad = (n) => String(n).padStart(2, "0");

  // Pin and scroll sideways on any reasonably sized desktop window. Short windows get compact cards (see home.css)
  // instead of losing the effect; only genuinely tiny heights fall back to the swipe row.
  gsap.matchMedia().add("(min-width: 800px) and (min-height: 520px)", () => {
    section.classList.add("is-pinned");
    const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);

    const slide = gsap.to(track, {
      x: () => -distance(),
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: () => `+=${distance()}`,
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true,
        anticipatePin: 1,
        onUpdate: (self) => {
          bar.style.transform = `scaleX(${self.progress})`;
          const current = Math.min(cards.length, Math.floor(self.progress * cards.length) + 1);
          count.textContent = `${pad(current)} / ${pad(cards.length)}`;
        },
      },
    });
    count.textContent = `${pad(1)} / ${pad(cards.length)}`;

    // Artwork drifts against the scroll direction for depth
    cards.forEach((card) => {
      gsap.fromTo(
        card.querySelector(".work-card__art"),
        { xPercent: -5 },
        {
          xPercent: 5,
          ease: "none",
          scrollTrigger: { trigger: card, containerAnimation: slide, start: "left right", end: "right left", scrub: true },
        }
      );
    });

    return () => section.classList.remove("is-pinned");
  });
}

// Words light up as you scroll through the About statement.
function aboutStatement() {
  const el = document.querySelector("#about-statement");
  if (!el) return;

  const words = el.textContent.trim().split(/\s+/);
  el.setAttribute("aria-label", el.textContent.trim());
  el.textContent = "";
  const spans = words.map((word) => {
    const span = document.createElement("span");
    span.className = "w";
    span.setAttribute("aria-hidden", "true");
    span.textContent = word;
    el.append(span, " ");
    return span;
  });

  gsap.fromTo(
    spans,
    { opacity: 0.15 },
    {
      opacity: 1,
      stagger: 0.1,
      ease: "none",
      scrollTrigger: { trigger: el, start: "top 80%", end: "bottom 50%", scrub: true },
    }
  );
}

function reveals() {
  gsap.utils.toArray("[data-reveal]").forEach((el) => {
    const index = [...el.parentElement.children].indexOf(el);
    gsap.from(el, {
      y: 40,
      opacity: 0,
      duration: 0.8,
      delay: Math.min(index, 4) * 0.08,
      ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 90%", once: true },
    });
  });
}
