/* ── MAIN.JS ─────────────────────────────────────
   Entry point: AOS init, dark mode + smooth theme
   transition, time-based greeting
─────────────────────────────────────────────────── */

window.HLC = window.HLC || {};

window.addEventListener("load", () => {
  const minDisplay = 1500;
  const loadStart = performance.now();
  setTimeout(
    () => {
      document.body.classList.remove("loading");
      setTimeout(() => document.getElementById("pageLoader")?.remove(), 800);
    },
    Math.max(0, minDisplay - (performance.now() - loadStart)),
  );
});

document.addEventListener("DOMContentLoaded", () => {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  AOS.init({
    duration: prefersReducedMotion ? 0 : 850,
    easing: "ease-out-cubic",
    once: true,
    offset: 30,
    anchorPlacement: "top-bottom",
  });

  const themeToggle = document.getElementById("themeToggle");
  const themeIcon = document.getElementById("themeIcon");
  const html = document.documentElement;

  const savedTheme = localStorage.getItem("hlc_theme") || "light";
  html.setAttribute("data-theme", savedTheme);
  updateThemeIcon(savedTheme);

  function updateThemeIcon(theme) {
    if (themeIcon)
      themeIcon.className =
        theme === "dark" ? "fa-solid fa-sun" : "fa-solid fa-moon";
  }

  themeToggle?.addEventListener("click", () => {
    const next = html.getAttribute("data-theme") === "dark" ? "light" : "dark";

    /* Phase 1 — fade overlay IN (covers the page) */
    html.classList.add("theme-transitioning");

    /* Phase 2 — swap theme while hidden, then fade OUT */
    setTimeout(() => {
      html.setAttribute("data-theme", next);
      localStorage.setItem("hlc_theme", next);
      updateThemeIcon(next);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          html.classList.add("theme-settled");
          setTimeout(() => {
            html.classList.remove("theme-transitioning", "theme-settled");
          }, 300);
        });
      });
    }, 230);
  });

  document.getElementById("promoClose")?.addEventListener("click", () => {
    document.getElementById("promoBanner")?.classList.add("hidden");
  });

  (function insertGreeting() {
    const hour = new Date().getHours();
    let emoji, text;
    if (hour >= 5 && hour < 12) {
      emoji = "🌅";
      text = "Good morning";
    } else if (hour >= 12 && hour < 17) {
      emoji = "☀️";
      text = "Good afternoon";
    } else if (hour >= 17 && hour < 21) {
      emoji = "🌇";
      text = "Good evening";
    } else {
      emoji = "🌙";
      text = "Good night";
    }
    const eyebrow = document.querySelector(".hero-eyebrow span");
    if (eyebrow)
      eyebrow.textContent = `${emoji} ${text} — Dermatologically Tested`;
  })();

  if (!prefersReducedMotion) {
    window.HLC.updateAboutScale?.();
    window.HLC.updateBenefitsSpotlight?.();
    window.HLC.updateHeroParallax?.(window.scrollY);
  }
}); // END DOMContentLoaded
