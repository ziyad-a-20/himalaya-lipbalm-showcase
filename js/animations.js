/* ── ANIMATIONS.JS ───────────────────────────────
   Hero parallax, about scale, benefits spotlight,
   lazy image fade-in, benefit number reveal, tooltips
─────────────────────────────────────────────────── */

window.HLC = window.HLC || {};

document.addEventListener("DOMContentLoaded", () => {
  /* ── HERO PARALLAX ───────────────────────────── */
  const heroProductCard = document.getElementById("heroProductCard");
  window.HLC.updateHeroParallax = function (sy) {
    if (!heroProductCard) return;
    const heroEl = document.getElementById("home");
    if (!heroEl) return;
    if (sy > heroEl.offsetTop + heroEl.offsetHeight) return;
    heroProductCard.style.transform = `translateY(-${sy * 0.35}px)`;
  };

  /* ── ABOUT SCROLL SCALE ──────────────────────── */
  const aboutImgFrame = document.getElementById("aboutImgFrame");
  window.HLC.updateAboutScale = function () {
    if (!aboutImgFrame) return;
    const rect = aboutImgFrame.getBoundingClientRect();
    const progress = Math.min(
      Math.max((window.innerHeight - rect.top) / (window.innerHeight * 0.7), 0),
      1,
    );
    aboutImgFrame.style.setProperty("--about-scale", 0.95 + 0.05 * progress);
  };

  /* ── BENEFITS SPOTLIGHT ──────────────────────── */
  const benefitsSection = document.getElementById("benefits");
  const benefitsSpotlight = document.getElementById("benefitsSpotlight");
  window.HLC.updateBenefitsSpotlight = function () {
    if (!benefitsSection || !benefitsSpotlight) return;
    const rect = benefitsSection.getBoundingClientRect();
    const winH = window.innerHeight;
    const inView = rect.top < winH && rect.bottom > 0;
    benefitsSpotlight.classList.toggle("active", inView);
    if (!inView) return;
    const progress = Math.min(Math.max(-rect.top / (rect.height - winH), 0), 1);
    benefitsSpotlight.style.setProperty("--spot-x", "50%");
    benefitsSpotlight.style.setProperty("--spot-y", `${20 + progress * 60}%`);
  };

  /* ── LAZY IMAGE OBSERVER ─────────────────────── */
  const lazyObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const img = entry.target;
        const markLoaded = () => img.classList.add("loaded");
        if (img.complete) {
          markLoaded();
        } else {
          img.addEventListener("load", markLoaded, { once: true });
          img.addEventListener("error", markLoaded, { once: true });
        }
        lazyObserver.unobserve(img);
      });
    },
    { rootMargin: "0px 0px 200px 0px" },
  );
  document.querySelectorAll("img.lazy-img").forEach((img) => {
    img.complete ? img.classList.add("loaded") : lazyObserver.observe(img);
  });

  /* ── BENEFIT NUMBER REVEAL ───────────────────── */
  const benefitNumObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("num-animated");
          benefitNumObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 },
  );
  document
    .querySelectorAll(".benefit-num")
    .forEach((n) => benefitNumObserver.observe(n));

  /* ── INGREDIENT MOBILE SNAP SCROLL ──────────── */
  (function initIngredientScroll() {
    const grid = document.querySelector(".ingredient-grid");
    const section = document.getElementById("ingredients");
    if (!grid || !section) return;

    const dotsWrap = document.createElement("div");
    dotsWrap.className = "ingredient-scroll-dots";
    dotsWrap.setAttribute("aria-hidden", "true");
    grid.parentNode.insertBefore(dotsWrap, grid.nextSibling);

    function buildDots() {
      dotsWrap.innerHTML = "";
      if (window.innerWidth > 640) return;
      const cards = [...grid.querySelectorAll(".ingredient-card")];
      cards.forEach((_, i) => {
        const dot = document.createElement("button");
        dot.className = "ingredient-dot" + (i === 0 ? " active" : "");
        dot.setAttribute("aria-label", `Go to ingredient ${i + 1}`);
        dot.addEventListener("click", () => {
          grid.scrollTo({ left: cards[i].offsetLeft - 20, behavior: "smooth" });
        });
        dotsWrap.appendChild(dot);
      });
    }

    grid.addEventListener(
      "scroll",
      () => {
        if (window.innerWidth > 640) return;
        const cards = [...grid.querySelectorAll(".ingredient-card")];
        const dots = [...dotsWrap.querySelectorAll(".ingredient-dot")];
        let closest = 0,
          minDist = Infinity;
        cards.forEach((card, i) => {
          const dist = Math.abs(card.offsetLeft - 20 - grid.scrollLeft);
          if (dist < minDist) {
            minDist = dist;
            closest = i;
          }
        });
        dots.forEach((d, i) => d.classList.toggle("active", i === closest));
      },
      { passive: true },
    );

    buildDots();
    window.addEventListener("resize", buildDots);
  })();

  /* ── TOOLTIPS ────────────────────────────────── */
  const tooltipBox = document.getElementById("hlcTooltipBox");
  let tooltipTimeout = null;

  document.querySelectorAll(".hlc-tooltip").forEach((el) => {
    const text = el.getAttribute("data-tooltip");
    if (!text || !tooltipBox) return;

    function show() {
      clearTimeout(tooltipTimeout);
      tooltipBox.textContent = text;
      tooltipBox.classList.add("show");
      position();
    }
    function hide() {
      tooltipTimeout = setTimeout(
        () => tooltipBox.classList.remove("show"),
        120,
      );
    }
    function position() {
      const rect = el.getBoundingClientRect();
      const boxW = 220;
      let left = rect.left + rect.width / 2 - boxW / 2;
      left = Math.max(12, Math.min(left, window.innerWidth - boxW - 12));
      tooltipBox.style.left = left + "px";
      tooltipBox.style.top = rect.top - 8 + "px";
      tooltipBox.style.transform = `translateY(calc(-100% + ${tooltipBox.classList.contains("show") ? "0px" : "6px"}))`;
    }

    el.addEventListener("mouseenter", show);
    el.addEventListener("mouseleave", hide);
    el.addEventListener("focus", show);
    el.addEventListener("blur", hide);
    el.addEventListener("mousemove", position);
  });
}); // END DOMContentLoaded
