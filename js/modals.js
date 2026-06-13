/* ── MODALS.JS ───────────────────────────────────
   Order success, contact success, escape handler,
   confetti
─────────────────────────────────────────────────── */

window.HLC = window.HLC || {};

document.addEventListener("DOMContentLoaded", () => {
  const orderSuccess = document.getElementById("orderSuccess");
  const contactSuccessModal = document.getElementById("contactSuccess");
  const reviewSuccessModal = document.getElementById("reviewSuccess");
  const cartDrawer = document.getElementById("cartDrawer");

  /* ── CONFETTI ────────────────────────────────── */
  const confettiCanvas = document.getElementById("confettiCanvas");
  const confettiCtx = confettiCanvas?.getContext("2d");
  const CONFETTI_COLORS = [
    "#2a8c6e",
    "#c8a96e",
    "#3aad87",
    "#1a6b52",
    "#e4f5ee",
    "#d4b87a",
  ];
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  function launchConfetti() {
    if (!confettiCanvas || !confettiCtx || prefersReducedMotion) return;
    confettiCanvas.style.display = "block";
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
    const particles = Array.from({ length: 55 }, () => ({
      x: confettiCanvas.width / 2 + (Math.random() - 0.5) * 200,
      y: confettiCanvas.height * 0.4,
      vx: (Math.random() - 0.5) * 8,
      vy: -(Math.random() * 7 + 4),
      size: Math.random() * 6 + 4,
      color:
        CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      rotation: Math.random() * 360,
      rotVel: (Math.random() - 0.5) * 8,
      opacity: 1,
      shape: Math.random() > 0.5 ? "rect" : "circle",
    }));
    let startTime = null;
    const DURATION = 2200;
    function draw(ts) {
      if (!startTime) startTime = ts;
      const elapsed = ts - startTime;
      confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.22;
        p.rotation += p.rotVel;
        p.opacity = Math.max(0, 1 - (elapsed / DURATION) * 1.2);
        confettiCtx.save();
        confettiCtx.globalAlpha = p.opacity;
        confettiCtx.translate(p.x, p.y);
        confettiCtx.rotate((p.rotation * Math.PI) / 180);
        confettiCtx.fillStyle = p.color;
        if (p.shape === "rect") {
          confettiCtx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        } else {
          confettiCtx.beginPath();
          confettiCtx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          confettiCtx.fill();
        }
        confettiCtx.restore();
      });
      if (elapsed < DURATION) requestAnimationFrame(draw);
      else {
        confettiCtx.clearRect(
          0,
          0,
          confettiCanvas.width,
          confettiCanvas.height,
        );
        confettiCanvas.style.display = "none";
      }
    }
    requestAnimationFrame(draw);
  }

  /* ── CHECKOUT ────────────────────────────────── */
  document.getElementById("checkoutBtn")?.addEventListener("click", () => {
    const cartQty = parseInt(localStorage.getItem("hlc_cartQty") || "0");
    if (cartQty === 0) return;

    window.HLC.closeCart?.();

    /* resetCart handles: zeroing in-memory qty, clearing localStorage,
       resetting promo UI, and calling updateCart — all in one call */
    window.HLC.resetCart?.();

    setTimeout(() => launchConfetti(), 400);

    if (orderSuccess) {
      orderSuccess.classList.add("show");
      window.HLC.trapFocus?.(orderSuccess);
      setTimeout(() => {
        orderSuccess.classList.remove("show");
        window.HLC.releaseFocus?.(orderSuccess);
      }, 5000);
    }
  });

  /* ── MODAL CLOSE BUTTONS ─────────────────────── */
  document.getElementById("closeOrderModal")?.addEventListener("click", () => {
    orderSuccess?.classList.remove("show");
    window.HLC.releaseFocus?.(orderSuccess);
  });
  document
    .getElementById("closeContactModal")
    ?.addEventListener("click", () => {
      contactSuccessModal?.classList.remove("show");
      window.HLC.releaseFocus?.(contactSuccessModal);
    });
  document.getElementById("closeReviewModal")?.addEventListener("click", () => {
    reviewSuccessModal?.classList.remove("show");
    window.HLC.releaseFocus?.(reviewSuccessModal);
  });

  [orderSuccess, contactSuccessModal, reviewSuccessModal].forEach((modal) => {
    modal?.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.classList.remove("show");
        window.HLC.releaseFocus?.(modal);
      }
    });
  });

  /* ── ESCAPE KEY ──────────────────────────────── */
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (cartDrawer?.classList.contains("show")) {
      window.HLC.closeCart?.();
      return;
    }
    const expandedCard = document.querySelector(".ingredient-card.expanded");
    if (expandedCard) {
      expandedCard.classList.remove("expanded");
      expandedCard
        .querySelector(".ingredient-overlay")
        ?.setAttribute("aria-expanded", "false");
      expandedCard
        .querySelector(".ingredient-expand")
        ?.setAttribute("aria-hidden", "true");
      return;
    }
    [orderSuccess, contactSuccessModal, reviewSuccessModal].forEach((modal) => {
      if (modal?.classList.contains("show")) {
        modal.classList.remove("show");
        window.HLC.releaseFocus?.(modal);
      }
    });
  });
}); // END DOMContentLoaded
