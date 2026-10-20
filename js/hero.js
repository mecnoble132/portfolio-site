// Hero: split-text title, interactive particle field, entrance animation.

function splitChars(el) {
  const text = el.textContent;
  el.textContent = "";
  text.split(/(\s+)/).forEach((part) => {
    if (!part) return;
    if (/^\s+$/.test(part)) {
      el.append(" ");
      return;
    }
    const word = document.createElement("span");
    word.className = "word";
    word.setAttribute("aria-hidden", "true");
    [...part].forEach((ch) => {
      const c = document.createElement("span");
      c.className = "char";
      c.textContent = ch;
      word.append(c);
    });
    el.append(word);
  });
}

function initParticles(animated) {
  const canvas = document.querySelector(".hero__canvas");
  const hero = canvas.closest(".hero");
  const ctx = canvas.getContext("2d");
  const root = document.documentElement;
  const mouse = { x: -9999, y: -9999 };
  let width = 0;
  let height = 0;
  let particles = [];
  let colors = { a: "#6e95ff", b: "#4a73e6" };
  let raf = 0;
  let visible = true;

  const readColors = () => {
    const styles = getComputedStyle(root);
    colors = { a: styles.getPropertyValue("--accent").trim(), b: styles.getPropertyValue("--accent-2").trim() };
  };

  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = rect.width;
    height = rect.height;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.min(110, Math.floor((width * height) / 11000));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 1.6 + 0.6,
      c: Math.random() < 0.5 ? "a" : "b",
    }));
  };

  const LINK = 120;
  const REPEL = 140;

  const draw = () => {
    ctx.clearRect(0, 0, width, height);
    for (const p of particles) {
      if (animated) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const d = Math.hypot(dx, dy);
        if (d < REPEL && d > 0) {
          p.x += (dx / d) * (REPEL - d) * 0.03;
          p.y += (dy / d) * (REPEL - d) * 0.03;
        }
      }
      ctx.globalAlpha = 0.9;
      ctx.fillStyle = colors[p.c];
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.strokeStyle = colors.a;
    ctx.lineWidth = 1;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i];
        const b = particles[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < LINK) {
          ctx.globalAlpha = (1 - d / LINK) * 0.35;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }
  };

  const loop = () => {
    draw();
    raf = requestAnimationFrame(loop);
  };
  const start = () => {
    if (animated && !raf && visible && !document.hidden) loop();
  };
  const stop = () => {
    cancelAnimationFrame(raf);
    raf = 0;
  };

  readColors();
  resize();
  draw();
  if (!animated) {
    window.addEventListener("resize", () => {
      resize();
      draw();
    });
    new MutationObserver(() => {
      readColors();
      draw();
    }).observe(root, { attributes: true, attributeFilter: ["data-theme"] });
    return;
  }

  window.addEventListener("resize", resize);
  window.addEventListener("pointermove", (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });
  window.addEventListener("pointerleave", () => {
    mouse.x = mouse.y = -9999;
  });
  new MutationObserver(readColors).observe(root, { attributes: true, attributeFilter: ["data-theme"] });
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    visible ? start() : stop();
  }).observe(hero);
  document.addEventListener("visibilitychange", () => (document.hidden ? stop() : start()));
  start();
}

export function initHero({ animated }) {
  const title = document.querySelector(".hero__title");
  title.setAttribute("aria-label", title.textContent.replace(/\s+/g, " ").trim());
  document.querySelectorAll("[data-split]").forEach(splitChars);
  initParticles(animated);

  if (!animated) return { play() {} };

  // Hidden start states are set here (not in CSS) so a failure never leaves content invisible.
  const fades = document.querySelectorAll(".hero__status, .hero__kicker, .hero__pitch, .hero__actions, .hero__stats, .hero__visual");
  gsap.set(".hero .char", { yPercent: 115, rotate: 8 });
  gsap.set(fades, { opacity: 0, y: 24 });

  return {
    play() {
      gsap
        .timeline({ defaults: { ease: "power4.out" } })
        .to(".hero__status, .hero__kicker", { opacity: 1, y: 0, duration: 0.8, stagger: 0.1 })
        .to(".hero__name .char", { yPercent: 0, rotate: 0, duration: 1.1, stagger: 0.04 }, "<0.1")
        .to(".hero__headline .char", { yPercent: 0, rotate: 0, duration: 0.9, stagger: 0.02 }, "-=0.7")
        .to(".hero__pitch, .hero__actions, .hero__stats", { opacity: 1, y: 0, duration: 0.9, stagger: 0.12 }, "-=0.6")
        .to(".hero__visual", { opacity: 1, y: 0, duration: 1.1 }, "-=1.2");
    },
  };
}
