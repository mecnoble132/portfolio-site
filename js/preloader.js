const SEEN_KEY = "preloader-seen";

// Counts to 100 and lifts away. Resolves as the lift begins so the hero can animate in underneath.
export function runPreloader() {
  const el = document.querySelector(".preloader");
  if (!el) return Promise.resolve();

  let seen = false;
  try {
    seen = sessionStorage.getItem(SEEN_KEY) === "1";
    sessionStorage.setItem(SEEN_KEY, "1");
  } catch {}

  if (seen) {
    el.remove();
    return Promise.resolve();
  }

  document.body.classList.add("is-loading");
  const count = el.querySelector(".preloader__count");
  const progress = { value: 0 };

  return new Promise((resolve) => {
    const done = () => {
      el.remove();
      document.body.classList.remove("is-loading");
      resolve();
    };
    gsap
      .timeline({ onComplete: done })
      .to(progress, {
        value: 100,
        duration: 1.1,
        ease: "power2.inOut",
        onUpdate: () => {
          count.textContent = Math.round(progress.value);
        },
      })
      .call(resolve)
      .to(el, { yPercent: -100, duration: 0.8, ease: "power4.inOut" }, "+=0.15");
  });
}
