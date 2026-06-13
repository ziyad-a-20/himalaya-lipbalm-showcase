/* ── REVIEWS.JS ──────────────────────────────────
   Rating bars, score count-up, snap scroll dots,
   show more, helpful votes, write a review,
   ingredient expand panels, FAQ
─────────────────────────────────────────────────── */

document.addEventListener("DOMContentLoaded", () => {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  /* ── RATING BARS + SCORE COUNT-UP ────────────── */
  let barsAnimated = false;
  const reviewsSection = document.getElementById("reviews");
  const scoreEl = document.getElementById("scoreCount");

  const reviewsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !barsAnimated) {
          barsAnimated = true;
          document.querySelectorAll(".bar-fill").forEach((bar) => {
            requestAnimationFrame(() => {
              bar.style.width = bar.getAttribute("data-width");
            });
          });
          animateScore();
          reviewsObserver.disconnect();
        }
      });
    },
    { threshold: 0.2 },
  );
  if (reviewsSection) reviewsObserver.observe(reviewsSection);

  function animateScore() {
    if (!scoreEl) return;
    if (prefersReducedMotion) {
      scoreEl.textContent = "4.3";
      return;
    }
    const target = 4.3,
      duration = 1400,
      start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      scoreEl.textContent = ((1 - Math.pow(1 - p, 3)) * target).toFixed(1);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  /* ── MOBILE REVIEW SNAP SCROLL DOTS ─────────── */
  const reviewGrid = document.getElementById("reviewGrid");
  const reviewScrollDots = document.getElementById("reviewScrollDots");

  function initReviewDots() {
    if (!reviewGrid || !reviewScrollDots) return;
    if (window.innerWidth > 768) {
      reviewScrollDots.innerHTML = "";
      return;
    }
    const cards = [...reviewGrid.querySelectorAll(".review-card")];
    reviewScrollDots.innerHTML = "";
    cards.forEach((_, i) => {
      const dot = document.createElement("button");
      dot.className = "review-dot" + (i === 0 ? " active" : "");
      dot.setAttribute("aria-label", `Go to review ${i + 1}`);
      dot.addEventListener("click", () => {
        reviewGrid.scrollTo({
          left: cards[i].offsetLeft - 20,
          behavior: "smooth",
        });
      });
      reviewScrollDots.appendChild(dot);
    });
  }

  reviewGrid?.addEventListener(
    "scroll",
    () => {
      if (window.innerWidth > 768) return;
      const cards = [...reviewGrid.querySelectorAll(".review-card")];
      const dots = [...reviewScrollDots.querySelectorAll(".review-dot")];
      let closest = 0,
        minDist = Infinity;
      cards.forEach((card, i) => {
        const dist = Math.abs(card.offsetLeft - 20 - reviewGrid.scrollLeft);
        if (dist < minDist) {
          minDist = dist;
          closest = i;
        }
      });
      dots.forEach((d, i) => d.classList.toggle("active", i === closest));
    },
    { passive: true },
  );

  initReviewDots();
  window.addEventListener("resize", initReviewDots);

  /* ── SHOW MORE REVIEWS ───────────────────────── */
  const showMoreBtn = document.getElementById("showMoreBtn");
  const hiddenReviews = document.querySelectorAll(".hidden-review");
  let showingAll = false;

  showMoreBtn?.addEventListener("click", () => {
    showingAll = !showingAll;
    hiddenReviews.forEach((card, i) => {
      if (showingAll) {
        card.classList.remove("hidden");
        card.style.animationDelay = `${i * 80}ms`;
        card.style.animation = "reviewFadeIn 0.5s ease forwards";
      } else {
        card.classList.add("hidden");
        card.style.animation = "";
      }
    });
    showMoreBtn.innerHTML = showingAll
      ? '<i class="fa-solid fa-chevron-up"></i> Show Less'
      : '<i class="fa-solid fa-chevron-down"></i> Show More Reviews';
    if (!showingAll)
      reviewsSection?.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  /* ── REVIEW HELPFUL BUTTONS ──────────────────── */
  document.querySelectorAll(".review-helpful").forEach((btn) => {
    const id = btn.getAttribute("data-id");
    const key = `hlc_helpful_${id}`;
    const countEl = btn.querySelector(".helpful-count");
    let voted = localStorage.getItem(key) === "1";
    if (voted) btn.classList.add("voted");
    btn.addEventListener("click", () => {
      if (voted) return;
      voted = true;
      localStorage.setItem(key, "1");
      btn.classList.add("voted");
      if (countEl) countEl.textContent = parseInt(countEl.textContent) + 1;
    });
  });

  /* ── WRITE A REVIEW ──────────────────────────── */
  const writeReviewToggle = document.getElementById("writeReviewToggle");
  const writeReviewCancel = document.getElementById("writeReviewCancel");
  const writeReviewForm = document.getElementById("writeReviewForm");
  const reviewSuccessModal = document.getElementById("reviewSuccess");
  let selectedRating = 0;

  writeReviewToggle?.addEventListener("click", () => {
    writeReviewForm?.classList.add("open");
    writeReviewToggle.style.display = "none";
    writeReviewForm?.querySelector("input, textarea")?.focus();
  });
  writeReviewCancel?.addEventListener("click", () => {
    writeReviewForm?.classList.remove("open");
    writeReviewToggle.style.display = "";
    selectedRating = 0;
    resetStars();
  });

  const starBtns = document.querySelectorAll(".star-pick");
  starBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      selectedRating = parseInt(btn.getAttribute("data-val"));
      document.getElementById("wr-rating").value = selectedRating;
      updateStars(selectedRating);
    });
    btn.addEventListener("mouseenter", () =>
      updateStars(parseInt(btn.getAttribute("data-val"))),
    );
    btn.addEventListener("mouseleave", () => updateStars(selectedRating));
  });

  function updateStars(val) {
    starBtns.forEach((b) => {
      b.querySelector("i").className =
        parseInt(b.getAttribute("data-val")) <= val
          ? "fa-solid fa-star"
          : "fa-regular fa-star";
    });
  }
  function resetStars() {
    starBtns.forEach((b) => {
      b.querySelector("i").className = "fa-regular fa-star";
    });
    const r = document.getElementById("wr-rating");
    if (r) r.value = 0;
  }

  writeReviewForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("wr-name")?.value.trim();
    const rating = parseInt(document.getElementById("wr-rating")?.value || "0");
    const text = document.getElementById("wr-text")?.value.trim();
    if (!name || !text || rating === 0) {
      if (rating === 0) {
        const picker = document.querySelector(".star-picker");
        picker?.classList.add("star-error");
        setTimeout(() => picker?.classList.remove("star-error"), 800);
      }
      return;
    }
    const grid = document.querySelector(".review-grid");
    const card = document.createElement("div");
    card.className = "review-card";
    card.style.animation = "reviewFadeIn 0.5s ease forwards";
    const starsHtml = Array.from(
      { length: 5 },
      (_, i) =>
        `<i class="fa-${i < rating ? "solid" : "regular"} fa-star"></i>`,
    ).join("");
    const palettes = [
      { bg: "#e9f7f2", col: "#2f8f6d" },
      { bg: "#f6f0ff", col: "#6b3aa6" },
      { bg: "#fff6ea", col: "#e07a1f" },
      { bg: "#e8f8ff", col: "#0b6b8c" },
    ];
    const p = palettes[Math.floor(Math.random() * palettes.length)];
    card.innerHTML = `
      <div class="review-top">
        <div class="review-avatar" style="--av-bg:${p.bg};--av-color:${p.col}">${name.charAt(0).toUpperCase()}</div>
        <div><h5>${name}</h5><div class="review-stars">${starsHtml}</div></div>
        <span class="review-date">Just now</span>
      </div>
      <p>"${text}"</p>
      <button class="review-helpful voted" aria-label="Mark as helpful">
        <i class="fa-solid fa-thumbs-up"></i>
        <span class="helpful-count">0</span> people found this helpful
      </button>`;
    grid.insertBefore(card, grid.firstChild);
    if (window.innerWidth <= 768) initReviewDots();
    writeReviewForm.reset();
    selectedRating = 0;
    resetStars();
    writeReviewForm.classList.remove("open");
    writeReviewToggle.style.display = "";
    if (reviewSuccessModal) {
      reviewSuccessModal.classList.add("show");
      window.HLC.trapFocus?.(reviewSuccessModal);
      setTimeout(() => {
        reviewSuccessModal.classList.remove("show");
        window.HLC.releaseFocus?.(reviewSuccessModal);
      }, 4000);
    }
  });

  /* ── INGREDIENT EXPAND PANELS ────────────────── */
  /* Key fix: use e.stopPropagation() + check e.currentTarget
     so only the clicked card's overlay fires, not its siblings.
     Also close all others before opening the clicked one. */
  function closeAllIngredients() {
    document.querySelectorAll(".ingredient-card.expanded").forEach((c) => {
      c.classList.remove("expanded");
      c.querySelector(".ingredient-overlay")?.setAttribute(
        "aria-expanded",
        "false",
      );
      c.querySelector(".ingredient-expand")?.setAttribute(
        "aria-hidden",
        "true",
      );
    });
  }

  document.querySelectorAll(".ingredient-overlay").forEach((overlay) => {
    const card = overlay.closest(".ingredient-card");
    const expandEl = card?.querySelector(".ingredient-expand");

    function toggleExpand(e) {
      /* Stop the click from bubbling up to document or sibling listeners */
      e.stopPropagation();

      const isOpen = card.classList.contains("expanded");

      /* Always close all cards first */
      closeAllIngredients();

      /* If this card wasn't open, open it */
      if (!isOpen) {
        card.classList.add("expanded");
        overlay.setAttribute("aria-expanded", "true");
        expandEl?.setAttribute("aria-hidden", "false");
      }
    }

    overlay.addEventListener("click", toggleExpand);
    overlay.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggleExpand(e);
      }
    });
  });

  /* Clicking anywhere outside an ingredient card closes all */
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".ingredient-card")) {
      closeAllIngredients();
    }
  });

  /* ── FAQ ─────────────────────────────────────── */
  document.querySelectorAll(".faq-q").forEach((btn) => {
    btn.addEventListener("click", () => {
      const item = btn.closest(".faq-item");
      const isOpen = item.classList.contains("open");
      document.querySelectorAll(".faq-item.open").forEach((el) => {
        el.classList.remove("open");
        el.querySelector(".faq-q")?.setAttribute("aria-expanded", "false");
      });
      if (!isOpen) {
        item.classList.add("open");
        btn.setAttribute("aria-expanded", "true");
      }
    });
  });
}); // END DOMContentLoaded
