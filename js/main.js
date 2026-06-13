/* ── MAIN.JS ─────────────────────────────────────
   Entry point: AOS init, dark mode + smooth theme
   transition, time-based greeting
─────────────────────────────────────────────────── */

window.HLC = window.HLC || {};

/* ── PAGE LOADER ─────────────────────────────── */
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
  /* ── REDUCED MOTION ────────────────────────── */
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  /* ── AOS ───────────────────────────────────── */
  AOS.init({
    duration: prefersReducedMotion ? 0 : 850,
    easing: "ease-out-cubic",
    once: true,
    offset: 30,
    anchorPlacement: "top-bottom",
  });

  /* ── DARK MODE ─────────────────────────────── */
  const themeToggle = document.getElementById("themeToggle");
  const themeIcon = document.getElementById("themeIcon");
  const html = document.documentElement;

  /* Apply saved theme immediately to avoid flash */
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

    /* Add the transition class, swap the theme, then remove the class
       after the transition duration so it never fights other transitions */
    html.classList.add("theme-transitioning");
    html.setAttribute("data-theme", next);
    localStorage.setItem("hlc_theme", next);
    updateThemeIcon(next);
    setTimeout(() => html.classList.remove("theme-transitioning"), 500);
  });

  /* ── PROMO BANNER CLOSE ────────────────────── */
  document.getElementById("promoClose")?.addEventListener("click", () => {
    document.getElementById("promoBanner")?.classList.add("hidden");
  });

  /* ── TIME-BASED GREETING ───────────────────── */
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
    if (eyebrow) {
      eyebrow.textContent = `${emoji} ${text} — Dermatologically Tested`;
    }
  })();

  /* ── INITIAL SCROLL-DRIVEN STATE ──────────── */
  if (!prefersReducedMotion) {
    window.HLC.updateAboutScale?.();
    window.HLC.updateBenefitsSpotlight?.();
    window.HLC.updateHeroParallax?.(window.scrollY);
  }
}); // END DOMContentLoaded
