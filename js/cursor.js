// Custom cursor + magnetic buttons. Fine pointers only; no-ops on touch.
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

export function initCursor() {
  if (!finePointer.matches) return;

  const root = document.documentElement;
  const el = (tag, className) => Object.assign(document.createElement(tag), { className });

  // A sharp arrow pointer that tilts with motion, a tag that follows it, and a "focus frame" that locks onto [data-focus] elements.
  const cursor = el("div", "cursor");
  const arrow = el("span", "cursor__arrow");
  arrow.innerHTML =
    '<svg width="22" height="26" viewBox="0 0 22 26" aria-hidden="true"><path d="M2 2v19.5l5.2-4.6 3.4 7.6 3.1-1.4-3.4-7.5 7-.5z"/></svg>';
  const tag = el("span", "cursor__tag");
  cursor.append(arrow, tag);
  const focus = el("div", "cursor__focus");
  const box = el("div", "cursor__focus-box");
  const chip = el("span", "cursor__focus-chip");
  box.append(el("i", "tl"), el("i", "tr"), el("i", "bl"), el("i", "br"), chip);
  focus.append(box);
  [cursor, focus].forEach((n) => n.setAttribute("aria-hidden", "true"));
  document.body.append(focus, cursor);
  root.classList.add("has-cursor");
  gsap.set(cursor, { opacity: 0 });
  gsap.set(focus, { opacity: 0 });

  // Colors follow the theme, and the dark Work stage swaps in its own accent.
  let scope = null;
  const readColors = (target) => {
    const node = target?.closest?.(".work") || root;
    if (node === scope) return;
    scope = node;
    const styles = getComputedStyle(node);
    [cursor, focus].forEach((n) => {
      n.style.setProperty("--cur-a", styles.getPropertyValue("--accent").trim());
      n.style.setProperty("--cur-bg", styles.getPropertyValue("--bg").trim());
    });
  };
  readColors();
  new MutationObserver(() => {
    scope = null;
    readColors();
  }).observe(root, { attributes: true, attributeFilter: ["data-theme"] });

  const dx = gsap.quickTo(cursor, "x", { duration: 0.08, ease: "power3" });
  const dy = gsap.quickTo(cursor, "y", { duration: 0.08, ease: "power3" });
  const fx = gsap.quickTo(focus, "x", { duration: 0.4, ease: "power3" });
  const fy = gsap.quickTo(focus, "y", { duration: 0.4, ease: "power3" });
  const fw = gsap.quickTo(focus, "width", { duration: 0.4, ease: "power3" });
  const fh = gsap.quickTo(focus, "height", { duration: 0.4, ease: "power3" });

  // Focus frame: hugs the hovered element (slightly larger, as the element lifts on hover).
  let target = null;
  const frameOf = (t) => {
    const r = t.getBoundingClientRect();
    const w = t.offsetWidth * 1.04 + 24;
    const h = t.offsetHeight * 1.04 + 24;
    return { x: r.left + r.width / 2 - w / 2, y: r.top + r.height / 2 - h / 2, w, h };
  };
  const setTarget = (t) => {
    if (t === target) return;
    const wasIdle = !target;
    target = t;
    root.classList.toggle("is-focusing", !!t);
    cursor.classList.toggle("is-focus", !!t);
    if (!t) {
      gsap.to(focus, { opacity: 0, duration: 0.2 });
      gsap.to(box, { scale: 1.12, duration: 0.25, ease: "power2.in" });
      return;
    }
    chip.textContent = t.dataset.focus;
    const f = frameOf(t);
    if (wasIdle) {
      gsap.set(focus, { x: f.x, y: f.y, width: f.w, height: f.h });
      gsap.fromTo(box, { scale: 1.25 }, { scale: 1, duration: 0.55, ease: "expo.out" });
      gsap.fromTo(focus, { opacity: 0 }, { opacity: 1, duration: 0.25 });
    }
  };
  // The arrow leans into the direction it is moving, then settles back
  let lastX = 0;
  let tilt = 0;
  gsap.ticker.add(() => {
    const x = gsap.getProperty(cursor, "x");
    tilt += (Math.max(-16, Math.min(16, (x - lastX) * 0.9)) - tilt) * 0.2;
    lastX = x;
    gsap.set(arrow, { rotation: tilt, transformOrigin: "2px 2px" });
    if (!target) return;
    const f = frameOf(target);
    fx(f.x);
    fy(f.y);
    fw(f.w);
    fh(f.h);
  });

  let shown = false;
  window.addEventListener("pointermove", (e) => {
    if (!shown) {
      shown = true;
      gsap.set(cursor, { x: e.clientX, y: e.clientY });
      gsap.to(cursor, { opacity: 1, duration: 0.3 });
    }
    dx(e.clientX);
    dy(e.clientY);
  });

  document.addEventListener("pointerover", (e) => {
    readColors(e.target);
    const labelled = e.target.closest("[data-cursor]");
    const linked = e.target.closest("a, button, label, [data-magnetic]");
    // Over text fields the native I-beam is the right cursor, so the arrow steps aside
    cursor.classList.toggle("is-text", !!e.target.closest("input, textarea, select, [contenteditable]"));
    cursor.classList.toggle("is-label", !!labelled);
    cursor.classList.toggle("is-link", !labelled && !!linked);
    if (labelled) tag.textContent = labelled.dataset.cursor;
    setTarget(e.target.closest("[data-focus]"));
  });

  // Keyboard users get the same lock-on frame
  document.addEventListener("focusin", (e) => e.target.matches(":focus-visible") && setTarget(e.target.closest("[data-focus]")));
  document.addEventListener("focusout", () => setTarget(null));

  // Click: the arrow presses in; on a focused project the frame snaps tight
  window.addEventListener("pointerdown", () => {
    cursor.classList.add("is-down");
    if (target) gsap.fromTo(box, { scale: 1 }, { scale: 0.94, duration: 0.12, yoyo: true, repeat: 1, ease: "power2.out" });
  });
  window.addEventListener("pointerup", () => cursor.classList.remove("is-down"));

  document.addEventListener("pointerleave", () => {
    gsap.to(cursor, { opacity: 0, duration: 0.2 });
    setTarget(null);
  });
  document.addEventListener("pointerenter", () => shown && gsap.to(cursor, { opacity: 1, duration: 0.2 }));
}

export function initMagnetic() {
  if (!finePointer.matches) return;
  document.querySelectorAll("[data-magnetic]").forEach((el) => {
    const x = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3" });
    const y = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3" });
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      x((e.clientX - (r.left + r.width / 2)) * 0.3);
      y((e.clientY - (r.top + r.height / 2)) * 0.3);
    });
    el.addEventListener("pointerleave", () => {
      x(0);
      y(0);
    });
  });
}
