/* Derma Glow concept: treatment selector that refocuses the arch, gentle auto-advance, room parallax. */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* treatments: one open at a time; the arch shows its photo, coming into focus */
  const items = $$(".tx__item");
  const shots = $$(".arch--tx img");
  const capN = $(".tx__capn");
  const pick = $("#f-tx");
  const srcs = shots.map((im) => im.getAttribute("src"));
  items.forEach((b, i) => b.style.setProperty("--img", `url("${srcs[i]}")`));
  let cur = 0, touched = false;
  function show(i) {
    if (i === cur) return;
    cur = i;
    items.forEach((b, k) => { b.classList.toggle("on", k === i); b.setAttribute("aria-pressed", String(k === i)); });
    shots.forEach((im, k) => im.classList.toggle("on", k === i));
    if (capN) capN.textContent = String(i + 1).padStart(2, "0");
    if (pick) pick.selectedIndex = i;
  }
  items.forEach((b, i) => {
    b.addEventListener("click", () => { touched = true; show(i); });
    if (fine) b.addEventListener("pointerenter", () => { touched = true; show(i); });
  });
  /* until someone picks one, walk through them slowly while the section is on screen (desktop only) */
  const tx = $(".tx");
  if (tx && fine && !reduce) {
    let timer = 0;
    const run = () => { clearInterval(timer); timer = setInterval(() => { if (touched) return clearInterval(timer); show((cur + 1) % items.length); }, 4200); };
    new IntersectionObserver(([e]) => { if (e.isIntersecting && !touched) run(); else clearInterval(timer); }, { threshold: .45 }).observe(tx);
  }

  /* the room photo settles as it scrolls through the viewport */
  const room = $(".room__fig");
  if (room && !reduce) {
    let q = false;
    const upd = () => {
      q = false;
      const r = room.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (innerHeight - r.top) / (innerHeight + r.height)));
      room.style.setProperty("--rp", p.toFixed(4));
    };
    addEventListener("scroll", () => { if (!q) { q = true; requestAnimationFrame(upd); } }, { passive: true });
    upd();
  }
})();
