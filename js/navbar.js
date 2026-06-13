/* ── NAVBAR.JS ───────────────────────────────────
   Scroll spy, hamburger, sticky bar, back-to-top,
   share buttons, scroll progress
─────────────────────────────────────────────────── */

window.HLC = window.HLC || {};

document.addEventListener("DOMContentLoaded", () => {
  const navbar = document.getElementById("navbar");
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-links a");
  const backToTop = document.getElementById("backToTop");
  const hamburger = document.getElementById("hamburger");
  const navLinksEl = document.getElementById("navLinks");
  const navOverlay = document.getElementById("navOverlay");
  const scrollProgress = document.getElementById("scrollProgress");
  const stickyBuyBar = document.getElementById("stickyBuyBar");
  const heroSection = document.getElementById("home");

  function updateScrollProgress() {
    if (!scrollProgress) return;
    const pct =
      (window.scrollY / (document.body.scrollHeight - window.innerHeight)) *
      100;
    scrollProgress.style.width = Math.min(pct, 100) + "%";
    scrollProgress.setAttribute("aria-valuenow", Math.round(pct));
  }
  window.HLC.updateScrollProgress = updateScrollProgress;

  function updateStickyBar() {
    if (stickyBuyBar && heroSection)
      stickyBuyBar.classList.toggle(
        "show",
        heroSection.getBoundingClientRect().bottom < 0,
      );
  }

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  window.addEventListener(
    "scroll",
    () => {
      const sy = window.scrollY;
      navbar?.classList.toggle("scrolled", sy > 20);
      backToTop?.classList.toggle("show", sy > 400);
      updateScrollProgress();
      updateStickyBar();
      if (!prefersReducedMotion) {
        window.HLC.updateHeroParallax?.(sy);
        window.HLC.updateAboutScale?.();
        window.HLC.updateBenefitsSpotlight?.();
      }
      let current = "";
      sections.forEach((s) => {
        if (sy >= s.offsetTop - 120 && sy < s.offsetTop - 120 + s.offsetHeight)
          current = s.id;
      });
      navLinks.forEach((a) =>
        a.classList.toggle("active", a.getAttribute("href") === "#" + current),
      );
    },
    { passive: true },
  );

  function closeNav() {
    hamburger?.classList.remove("open");
    hamburger?.setAttribute("aria-expanded", "false");
    navLinksEl?.classList.remove("open");
    navOverlay?.classList.remove("show");
    document.body.style.overflow = "";
  }
  window.HLC.closeNav = closeNav;

  hamburger?.addEventListener("click", () => {
    const isOpen = navLinksEl?.classList.contains("open");
    if (isOpen) {
      closeNav();
    } else {
      hamburger.classList.add("open");
      hamburger.setAttribute("aria-expanded", "true");
      navLinksEl?.classList.add("open");
      navOverlay?.classList.add("show");
      document.body.style.overflow = "hidden";
    }
  });

  navOverlay?.addEventListener("click", closeNav);

  document.addEventListener("click", (e) => {
    if (
      navbar &&
      !navbar.contains(e.target) &&
      navLinksEl?.classList.contains("open")
    )
      closeNav();
  });

  navLinks.forEach((a) => {
    a.addEventListener("click", (e) => {
      e.preventDefault();
      const target = document.getElementById(a.getAttribute("href").slice(1));
      if (target) {
        if (document.startViewTransition) {
          document.startViewTransition(() =>
            target.scrollIntoView({ behavior: "instant" }),
          );
        } else {
          target.scrollIntoView({ behavior: "smooth" });
        }
      }
      closeNav();
    });
  });

  document.querySelector(".learn-more-btn")?.addEventListener("click", () => {
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
  });

  backToTop?.addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: "smooth" }),
  );

  /* ── SHARE ─────────────────────────────────── */
  const shareToast = document.getElementById("shareToast");
  const shareMsg = document.getElementById("shareMsg");

  async function handleShare() {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Himalaya Lip Care — Natural Lip Balm",
          text: "Check out this natural lip balm — cold-pressed botanical oils, PETA certified, just ₹50.",
          url: window.location.href,
        });
        return;
      } catch (err) {
        if (err.name === "AbortError") return;
      }
    }
    try {
      await navigator.clipboard.writeText(window.location.href);
      if (shareMsg) shareMsg.textContent = "Link copied to clipboard!";
    } catch {
      if (shareMsg) shareMsg.textContent = "Copy this URL to share";
    }
    shareToast?.classList.add("show");
    setTimeout(() => shareToast?.classList.remove("show"), 2500);
  }

  document
    .getElementById("shareNavBtn")
    ?.addEventListener("click", handleShare);
  document
    .getElementById("shareHeroBtn")
    ?.addEventListener("click", handleShare);

  /* Initial call */
  updateScrollProgress();
  updateStickyBar();
}); // END DOMContentLoaded
