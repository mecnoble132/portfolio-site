import { site } from "../data/site.js";

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

// 3D tilt + glow that follows the mouse on work cards.
export function initTilt() {
  document.querySelectorAll(".work-card:not(.work-card--all)").forEach((card) => {
    card.addEventListener("pointermove", (e) => {
      if (e.pointerType !== "mouse") return;
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      card.style.transform = `perspective(900px) rotateX(${(0.5 - py) * 10}deg) rotateY(${(px - 0.5) * 12}deg)`;
      card.style.setProperty("--mx", `${px * 100}%`);
      card.style.setProperty("--my", `${py * 100}%`);
    });
    card.addEventListener("pointerleave", () => {
      card.style.transform = "";
    });
  });
}

// Spotlight that follows the pointer on skill cards.
export function initSpotlight() {
  document.querySelectorAll(".skill-card").forEach((card) => {
    card.addEventListener("pointermove", (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - r.left}px`);
      card.style.setProperty("--my", `${e.clientY - r.top}px`);
    });
  });
}

// Typing terminal in About. Types once when scrolled into view; shows everything at once if motion is reduced.
export function initTerminal({ instant = false } = {}) {
  const body = document.querySelector("#terminal-body");
  if (!body) return;

  const skills = site.skills.flatMap((g) => g.items).slice(0, 6).map((s) => s.name).join("  ");
  const lines = [
    { prompt: true, text: "whoami" },
    { text: `${site.name} — ${site.role}` },
    { prompt: true, text: "ls skills/" },
    { text: skills },
    { prompt: true, text: "cat status.txt" },
    { text: site.status },
    { prompt: true, text: "" },
  ];

  const caret = Object.assign(document.createElement("span"), { className: "terminal__caret", ariaHidden: "true" });

  const addLine = (line) => {
    const row = document.createElement("div");
    if (line.prompt) row.append(Object.assign(document.createElement("span"), { className: "terminal__prompt", textContent: "$ " }));
    const text = document.createElement("span");
    row.append(text);
    body.append(row);
    return text;
  };

  const renderAll = () => {
    lines.forEach((line) => (addLine(line).textContent = line.text));
    body.lastElementChild.append(caret);
  };

  if (instant || reduceMotion.matches) {
    renderAll();
    return;
  }

  const type = async () => {
    for (const line of lines) {
      const target = addLine(line);
      body.append(caret);
      target.parentElement.append(caret);
      if (line.prompt) {
        for (const ch of line.text) {
          target.textContent += ch;
          await new Promise((r) => setTimeout(r, 35));
        }
        await new Promise((r) => setTimeout(r, 250));
      } else {
        target.textContent = line.text;
        await new Promise((r) => setTimeout(r, 200));
      }
    }
  };

  new IntersectionObserver(
    ([entry], observer) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      type();
    },
    { threshold: 0.4 }
  ).observe(body);
}

// Konami code -> confetti.
export function initKonami() {
  const code = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
  let i = 0;
  window.addEventListener("keydown", (e) => {
    i = e.key === code[i] ? i + 1 : e.key === code[0] ? 1 : 0;
    if (i < code.length) return;
    i = 0;

    const toast = Object.assign(document.createElement("div"), { className: "toast", textContent: "🎉 You found the secret!", role: "status" });
    document.body.append(toast);
    setTimeout(() => toast.remove(), 3500);
    if (reduceMotion.matches) return;

    const colors = ["#6e95ff", "#4a73e6", "#e8eaee", "#2a4fd6", "#22c55e"];
    for (let n = 0; n < 80; n++) {
      const piece = document.createElement("div");
      piece.className = "confetti";
      piece.style.left = `${Math.random() * 100}vw`;
      piece.style.background = colors[n % colors.length];
      piece.style.setProperty("--d", `${2.5 + Math.random() * 2}s`);
      piece.style.setProperty("--delay", `${Math.random() * 0.6}s`);
      document.body.append(piece);
      setTimeout(() => piece.remove(), 5500);
    }
  });
}
