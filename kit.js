/* Abex concept kit: English/Arabic switch (data-ar on any element), reveal on scroll, staggers, demo forms, header state. */
(() => {
  const root = document.documentElement;
  const els = [...document.querySelectorAll("[data-ar]")];
  els.forEach((e) => (e._en = e.innerHTML));
  const phs = [...document.querySelectorAll("[data-ar-ph]")];
  phs.forEach((e) => (e._en = e.placeholder));
  const lbs = [...document.querySelectorAll("[data-ar-label]")];
  lbs.forEach((e) => (e._en = e.getAttribute("aria-label")));
  function set(l) {
    root.lang = l;
    root.dir = l === "ar" ? "rtl" : "ltr";
    els.forEach((e) => (e.innerHTML = l === "ar" ? e.dataset.ar : e._en));
    phs.forEach((e) => (e.placeholder = l === "ar" ? e.dataset.arPh : e._en));
    lbs.forEach((e) => e.setAttribute("aria-label", l === "ar" ? e.dataset.arLabel : e._en));
    document.querySelectorAll("[data-lang]").forEach((b) => {
      b.textContent = l === "ar" ? "English" : "العربية";
      b.lang = l === "ar" ? "en" : "ar";
    });
    try { localStorage.setItem("lang", l); } catch (e) {}
    dispatchEvent(new Event("langchange"));
  }
  document.addEventListener("click", (e) => { if (e.target.closest("[data-lang]")) set(root.lang === "ar" ? "en" : "ar"); });
  let start = new URLSearchParams(location.search).get("lang");
  try { start = start || localStorage.getItem("lang"); } catch (e) {}
  if (start === "ar") set("ar");

  root.classList.add("js");
  document.querySelectorAll("[data-stagger]").forEach((p) => [...p.children].forEach((c, i) => c.style.setProperty("--i", i)));
  /* reveal by geometry, not IntersectionObserver: a heading clipped to nothing (for its wipe) never "intersects" */
  const pend = new Set(document.querySelectorAll(".rv"));
  let last = 0, tail = 0;
  const reveal = () => {
    const edge = innerHeight * .91;
    pend.forEach((e) => {
      const r = e.getBoundingClientRect();
      if ((r.width || r.height) && r.top < edge) { e.classList.add("in"); pend.delete(e); }   // includes anything already scrolled past
    });
  };
  /* throttled by time, with a trailing check, so it never depends on a frame being scheduled */
  const ask = () => {
    if (!pend.size) return;
    const now = performance.now();
    if (now - last > 60) { last = now; reveal(); }
    clearTimeout(tail); tail = setTimeout(reveal, 140);
  };
  addEventListener("scroll", ask, { passive: true });
  addEventListener("resize", ask);
  addEventListener("langchange", ask);
  addEventListener("load", ask);
  reveal();

  document.querySelectorAll("form[data-demo]").forEach((f) => f.addEventListener("submit", (e) => { e.preventDefault(); f.classList.add("sent"); }));
  const hdr = document.querySelector("header");
  const solid = () => hdr && hdr.classList.toggle("solid", scrollY > 40);
  addEventListener("scroll", solid, { passive: true });
  solid();
})();
