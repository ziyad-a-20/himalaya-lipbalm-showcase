/* ── PAGE LOADER ─────────────────────────────── */
window.addEventListener("load", () => {
  const minDisplay = 1500;
  const loadStart = performance.now();

  const reveal = () => {
    const elapsed = performance.now() - loadStart;
    const wait = Math.max(0, minDisplay - elapsed);
    setTimeout(() => {
      document.body.classList.remove("loading");
      setTimeout(() => {
        const loader = document.getElementById("pageLoader");
        if (loader) loader.remove();
      }, 800);
    }, wait);
  };

  reveal();
});

document.addEventListener("DOMContentLoaded", () => {
  /* ── AOS ─────────────────────────────────────── */
  if (typeof AOS !== "undefined") {
    AOS.init({
      duration: 850,
      easing: "ease-out-cubic",
      once: true,
      offset: 30,
      anchorPlacement: "top-bottom",
    });
  }
  setTimeout(() => {
    document.querySelectorAll("[data-aos]").forEach((el) => {
      el.classList.add("aos-animate");
      el.style.pointerEvents = "auto";
    });
  }, 4000);

  /* ── DARK MODE ───────────────────────────────── */
  const themeToggle = document.getElementById("themeToggle");
  const themeIcon = document.getElementById("themeIcon");
  const html = document.documentElement;

  const savedTheme = localStorage.getItem("hlc_theme") || "light";
  html.setAttribute("data-theme", savedTheme);
  updateThemeIcon(savedTheme);

  function updateThemeIcon(theme) {
    if (!themeIcon) return;
    themeIcon.className =
      theme === "dark" ? "fa-solid fa-sun" : "fa-solid fa-moon";
  }

  themeToggle?.addEventListener("click", () => {
    const next = html.getAttribute("data-theme") === "dark" ? "light" : "dark";
    html.setAttribute("data-theme", next);
    localStorage.setItem("hlc_theme", next);
    updateThemeIcon(next);
  });

  /* ── PROMO BANNER ────────────────────────────── */
  document.getElementById("promoClose")?.addEventListener("click", () => {
    document.getElementById("promoBanner")?.classList.add("hidden");
  });

  /* ── NAVBAR ──────────────────────────────────── */
  const navbar = document.getElementById("navbar");
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-links a");
  const backToTop = document.getElementById("backToTop");

  const onScroll = () => {
    const sy = window.scrollY;
    navbar?.classList.toggle("scrolled", sy > 20);
    backToTop?.classList.toggle("show", sy > 400);
    let current = "";
    sections.forEach((s) => {
      if (sy >= s.offsetTop - 120 && sy < s.offsetTop - 120 + s.offsetHeight)
        current = s.id;
    });
    navLinks.forEach((a) =>
      a.classList.toggle("active", a.getAttribute("href") === "#" + current),
    );
    animateRatingBars();
    animateScore();
    updateStickyBar();
  };
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ── NAV SMOOTH SCROLL ───────────────────────── */
  const hamburger = document.getElementById("hamburger");
  const navLinksEl = document.getElementById("navLinks");

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
      navLinksEl?.classList.remove("open");
      hamburger?.classList.remove("open");
    });
  });

  hamburger?.addEventListener("click", () => {
    hamburger.classList.toggle("open");
    navLinksEl?.classList.toggle("open");
  });
  document.addEventListener("click", (e) => {
    if (navbar && !navbar.contains(e.target)) {
      hamburger?.classList.remove("open");
      navLinksEl?.classList.remove("open");
    }
  });

  document.querySelector(".learn-more-btn")?.addEventListener("click", () => {
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
  });

  backToTop?.addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: "smooth" }),
  );

  /* ── MOBILE STICKY BUY BAR ───────────────────── */
  const stickyBuyBar = document.getElementById("stickyBuyBar");
  const heroSection = document.getElementById("home");
  function updateStickyBar() {
    if (!stickyBuyBar || !heroSection) return;
    stickyBuyBar.classList.toggle(
      "show",
      heroSection.getBoundingClientRect().bottom < 0,
    );
  }

  /* ── LAZY IMAGES ─────────────────────────────── */
  const imgObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const img = entry.target;
        const src = img.getAttribute("data-src");
        if (!src) return;
        const t = new Image();
        t.onload = () => {
          img.src = src;
          img.classList.add("loaded");
        };
        t.src = src;
        imgObserver.unobserve(img);
      });
    },
    { rootMargin: "100px" },
  );
  document
    .querySelectorAll(".lazy-img")
    .forEach((img) => imgObserver.observe(img));

  /* ── RATING BARS ─────────────────────────────── */
  let barsAnimated = false;
  const reviewsSection = document.getElementById("reviews");
  function animateRatingBars() {
    if (barsAnimated || !reviewsSection) return;
    if (reviewsSection.getBoundingClientRect().top < window.innerHeight - 100) {
      barsAnimated = true;
      document.querySelectorAll(".bar-fill").forEach((bar) => {
        requestAnimationFrame(() => {
          bar.style.width = bar.getAttribute("data-width");
        });
      });
    }
  }

  /* ── SCORE COUNT-UP ──────────────────────────── */
  let scoreAnimated = false;
  const scoreEl = document.getElementById("scoreCount");
  function animateScore() {
    if (scoreAnimated || !scoreEl || !reviewsSection) return;
    if (reviewsSection.getBoundingClientRect().top < window.innerHeight - 100) {
      scoreAnimated = true;
      const target = 4.3,
        duration = 1400,
        startTime = performance.now();
      const tick = (now) => {
        const p = Math.min((now - startTime) / duration, 1);
        scoreEl.textContent = ((1 - Math.pow(1 - p, 3)) * target).toFixed(1);
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }
  }

  /* ── SHARE ───────────────────────────────────── */
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

  /* ── WISHLIST ─────────────────────────────────── */
  const wishlistBtn = document.getElementById("wishlistBtn");
  const wishlistBtnIcon = document.getElementById("wishlistBtnIcon");
  const wishlistNavBtn = document.getElementById("wishlistNavBtn");
  const wishlistNavIcon = document.getElementById("wishlistNavIcon");
  const wishlistToast = document.getElementById("wishlistToast");
  const wishlistMsg = document.getElementById("wishlistMsg");

  let wishlisted = localStorage.getItem("hlc_wishlisted") === "true";

  function applyWishlistUI() {
    wishlistBtnIcon?.classList.toggle("fa-regular", !wishlisted);
    wishlistBtnIcon?.classList.toggle("fa-solid", wishlisted);
    wishlistBtn?.classList.toggle("active", wishlisted);
    wishlistNavIcon?.classList.toggle("fa-regular", !wishlisted);
    wishlistNavIcon?.classList.toggle("fa-solid", wishlisted);
    wishlistNavBtn?.classList.toggle("active", wishlisted);
  }
  applyWishlistUI();

  function toggleWishlist() {
    wishlisted = !wishlisted;
    localStorage.setItem("hlc_wishlisted", wishlisted);
    applyWishlistUI();
    if (wishlisted && wishlistBtn) {
      wishlistBtn.classList.add("burst");
      setTimeout(() => wishlistBtn.classList.remove("burst"), 500);
    }
    if (wishlistMsg)
      wishlistMsg.textContent = wishlisted
        ? "Added to wishlist!"
        : "Removed from wishlist";
    wishlistToast?.classList.add("show");
    setTimeout(() => wishlistToast?.classList.remove("show"), 2500);
  }
  wishlistBtn?.addEventListener("click", toggleWishlist);
  wishlistNavBtn?.addEventListener("click", toggleWishlist);

  /* ── CART ────────────────────────────────────── */
  const cartDrawer = document.getElementById("cartDrawer");
  const cartOverlay = document.getElementById("cartOverlay");
  const cartToggle = document.getElementById("cartToggle");
  const closeCartBtn = document.getElementById("closeCart");
  const cartSuccess = document.getElementById("cartSuccess");
  const qtyValueEl = document.querySelector(".qty-value");
  const cartBadge = document.getElementById("cartBadge");
  const cartHeaderSub = document.getElementById("cartHeaderSub");
  const cartSubtotalEl = document.querySelector(".cartSubtotal");
  const totalEl = document.querySelector(".cartTotal");
  const cartItem = document.getElementById("cartItem");
  const cartEmpty = document.getElementById("cartEmpty");
  const cartFooter = document.getElementById("cartFooter");
  const removeItemBtn = document.getElementById("removeItemBtn");

  const PRICE = 50;
  let cartQty = 0;
  let promoApplied = false;
  let promoDiscount = 0;
  let promoCode = "";

  const PROMO_CODES = { NATURE10: 0.1, SAVE15: 0.15 };

  const openCart = () => {
    cartDrawer?.classList.add("show");
    cartOverlay?.classList.add("show");
    document.body.style.overflow = "hidden";
  };
  const closeCart = () => {
    cartDrawer?.classList.remove("show");
    cartOverlay?.classList.remove("show");
    document.body.style.overflow = "";
  };

  cartToggle?.addEventListener("click", openCart);
  closeCartBtn?.addEventListener("click", closeCart);
  cartOverlay?.addEventListener("click", closeCart);

  document.querySelectorAll(".add-to-cart").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (cartQty === 0) {
        cartQty = 1;
        updateCart();
      }
      openCart();
      cartSuccess?.classList.add("show");
      setTimeout(() => cartSuccess?.classList.remove("show"), 3000);
    });
  });

  document.querySelector(".qty-btn.plus")?.addEventListener("click", () => {
    cartQty++;
    updateCart();
  });
  document.querySelector(".qty-btn.minus")?.addEventListener("click", () => {
    if (cartQty > 1) {
      cartQty--;
      updateCart();
    }
  });
  removeItemBtn?.addEventListener("click", () => {
    cartQty = 0;
    updateCart();
  });

  function updateCart() {
    const isEmpty = cartQty === 0;
    const subtotal = cartQty * PRICE;
    const discount = promoApplied ? Math.round(subtotal * promoDiscount) : 0;
    const total = subtotal - discount;

    if (cartItem) cartItem.style.display = isEmpty ? "none" : "flex";
    if (cartEmpty) cartEmpty.style.display = isEmpty ? "flex" : "none";
    if (cartFooter) {
      cartFooter.style.opacity = isEmpty ? "0.45" : "1";
      cartFooter.style.pointerEvents = isEmpty ? "none" : "auto";
    }
    if (removeItemBtn) removeItemBtn.classList.toggle("visible", cartQty === 1);
    if (qtyValueEl) qtyValueEl.textContent = cartQty;
    if (cartBadge) cartBadge.textContent = cartQty;
    if (cartSubtotalEl) cartSubtotalEl.textContent = subtotal;
    if (totalEl) totalEl.textContent = `₹${total}`;
    if (cartHeaderSub)
      cartHeaderSub.textContent = isEmpty
        ? "0 items"
        : `${cartQty} item${cartQty > 1 ? "s" : ""} · ₹${total}`;

    const cartPromoRow = document.getElementById("cartPromoRow");
    const cartPromoSaving = document.getElementById("cartPromoSaving");
    const cartPromoLabel = document.getElementById("cartPromoLabel");
    if (cartPromoRow)
      cartPromoRow.style.display = promoApplied && !isEmpty ? "flex" : "none";
    if (cartPromoSaving) cartPromoSaving.textContent = `Save ₹${discount}`;
    if (cartPromoLabel) cartPromoLabel.textContent = `${promoCode} applied:`;

    const announce = document.getElementById("cartAnnounce");
    if (announce)
      announce.textContent = isEmpty
        ? "Cart is now empty"
        : `Cart updated: ${cartQty} item${cartQty > 1 ? "s" : ""}, total ₹${total}`;
  }

  /* ── PROMO CODE ──────────────────────────────── */
  const promoCodeInput = document.getElementById("promoCodeInput");
  const promoApplyBtn = document.getElementById("promoApplyBtn");
  const promoFeedback = document.getElementById("promoFeedback");

  promoApplyBtn?.addEventListener("click", applyPromo);
  promoCodeInput?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") applyPromo();
  });

  function applyPromo() {
    if (!promoCodeInput || !promoFeedback) return;
    const entered = promoCodeInput.value.trim().toUpperCase();
    if (!entered) {
      promoFeedback.textContent = "Please enter a promo code.";
      promoFeedback.className = "promo-feedback error";
      return;
    }

    if (PROMO_CODES[entered] !== undefined) {
      promoApplied = true;
      promoDiscount = PROMO_CODES[entered];
      promoCode = entered;
      promoFeedback.textContent = `✓ ${entered} applied — ${Math.round(promoDiscount * 100)}% off!`;
      promoFeedback.className = "promo-feedback success";
      promoCodeInput.value = entered;
      promoCodeInput.disabled = true;
      promoApplyBtn.textContent = "Applied";
      promoApplyBtn.disabled = true;
    } else {
      promoApplied = false;
      promoDiscount = 0;
      promoFeedback.textContent = "Invalid code. Try NATURE10 or SAVE15.";
      promoFeedback.className = "promo-feedback error";
    }
    updateCart();
  }

  /* ── COMPARISON TABLE SCROLL ─────────────────── */
  const comparisonScroll = document.getElementById("comparisonScroll");
  const tableFadeMask = document.getElementById("tableFadeMask");
  const tableScrollHint = document.getElementById("tableScrollHint");

  function updateTableMask() {
    if (!comparisonScroll || !tableFadeMask) return;
    const { scrollLeft, scrollWidth, clientWidth } = comparisonScroll;
    const isOverflowing = scrollWidth > clientWidth + 2;
    const atEnd = scrollLeft + clientWidth >= scrollWidth - 4;
    tableFadeMask.style.display = isOverflowing && !atEnd ? "block" : "none";
    if (tableScrollHint)
      tableScrollHint.style.display = isOverflowing ? "flex" : "none";
  }
  comparisonScroll?.addEventListener("scroll", updateTableMask, {
    passive: true,
  });
  window.addEventListener("resize", updateTableMask);
  setTimeout(updateTableMask, 500);

  /* ── FOCUS TRAP ──────────────────────────────── */
  function trapFocus(modal) {
    const focusable = modal.querySelectorAll(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (first) first.focus();
    modal._trapHandler = (e) => {
      if (e.key !== "Tab") return;
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    modal.addEventListener("keydown", modal._trapHandler);
  }
  function releaseFocus(modal) {
    if (modal._trapHandler)
      modal.removeEventListener("keydown", modal._trapHandler);
  }

  /* ── MODALS ──────────────────────────────────── */
  const orderSuccess = document.getElementById("orderSuccess");
  const contactSuccessModal = document.getElementById("contactSuccess");
  const modalReplyEmail = document.getElementById("modalReplyEmail");

  document.getElementById("checkoutBtn")?.addEventListener("click", () => {
    if (cartQty === 0) return;
    closeCart();
    orderSuccess?.classList.add("show");
    if (orderSuccess) trapFocus(orderSuccess);
    setTimeout(() => {
      orderSuccess?.classList.remove("show");
      if (orderSuccess) releaseFocus(orderSuccess);
    }, 5000);
  });

  document.getElementById("closeOrderModal")?.addEventListener("click", () => {
    orderSuccess?.classList.remove("show");
    if (orderSuccess) releaseFocus(orderSuccess);
  });
  document
    .getElementById("closeContactModal")
    ?.addEventListener("click", () => {
      contactSuccessModal?.classList.remove("show");
      if (contactSuccessModal) releaseFocus(contactSuccessModal);
    });

  [orderSuccess, contactSuccessModal].forEach((modal) => {
    modal?.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.classList.remove("show");
        releaseFocus(modal);
      }
    });
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      [orderSuccess, contactSuccessModal].forEach((modal) => {
        if (modal?.classList.contains("show")) {
          modal.classList.remove("show");
          releaseFocus(modal);
        }
      });
    }
  });

  /* ── CONTACT FORM ────────────────────────────── */
  const contactForm = document.getElementById("contactForm");

  function validateField(input) {
    const errorEl = document.getElementById(input.id + "Error");
    let message = "";
    if (!input.value.trim()) {
      message = "This field is required.";
    } else if (
      input.type === "email" &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)
    ) {
      message = "Please enter a valid email address.";
    }
    input.classList.toggle("invalid", !!message);
    input.classList.toggle("valid", !message && !!input.value.trim());
    if (errorEl) errorEl.textContent = message;
    return !message;
  }

  contactForm?.querySelectorAll("input, textarea").forEach((field) => {
    field.addEventListener("blur", () => validateField(field));
    field.addEventListener("input", () => {
      if (field.classList.contains("invalid")) validateField(field);
    });
  });

  contactForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const fields = [...contactForm.querySelectorAll("input, textarea")];
    if (!fields.map(validateField).every(Boolean)) return;

    const btn = contactForm.querySelector("button[type=submit]");
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending…';
    btn.disabled = true;

    // Show email in modal
    const emailVal = contactForm.querySelector("#email")?.value?.trim();
    if (modalReplyEmail && emailVal) modalReplyEmail.textContent = emailVal;

    try {
      const res = await fetch(contactForm.action, {
        method: "POST",
        body: new FormData(contactForm),
        headers: { Accept: "application/json" },
      });
      if (res.ok) {
        contactSuccessModal?.classList.add("show");
        if (contactSuccessModal) trapFocus(contactSuccessModal);
        contactForm.reset();
        fields.forEach((f) => f.classList.remove("valid", "invalid"));
        setTimeout(() => {
          contactSuccessModal?.classList.remove("show");
          if (contactSuccessModal) releaseFocus(contactSuccessModal);
        }, 5000);
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch {
      alert("Network error. Please try again later.");
    } finally {
      btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send Message';
      btn.disabled = false;
    }
  });

  /* ── NEWSLETTER ──────────────────────────────── */
  const newsletterForm = document.getElementById("newsletterForm");
  const newsletterMsg = document.getElementById("newsletterMsg");
  newsletterForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const emailInput = document.getElementById("newsletterEmail");
    if (
      !emailInput?.value.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value)
    ) {
      if (newsletterMsg) {
        newsletterMsg.textContent = "Please enter a valid email.";
        newsletterMsg.className = "footer-newsletter-msg error";
      }
      return;
    }
    if (newsletterMsg) {
      newsletterMsg.textContent = "🌿 You're subscribed! Check your inbox.";
      newsletterMsg.className = "footer-newsletter-msg";
    }
    if (emailInput) {
      emailInput.value = "";
      emailInput.disabled = true;
    }
    newsletterForm.querySelector("button").disabled = true;
  });

  /* ── SHOW MORE REVIEWS ───────────────────────── */
  const showMoreBtn = document.getElementById("showMoreBtn");
  const hiddenReviews = document.querySelectorAll(".hidden-review");
  let showingAll = false;
  showMoreBtn?.addEventListener("click", () => {
    showingAll = !showingAll;
    hiddenReviews.forEach((card, i) => {
      if (showingAll) {
        card.style.display = "flex";
        card.style.animationDelay = `${i * 80}ms`;
        card.style.animation = "reviewFadeIn 0.5s ease forwards";
      } else {
        card.style.display = "none";
        card.style.animation = "";
      }
    });
    showMoreBtn.innerHTML = showingAll
      ? '<i class="fa-solid fa-chevron-up"></i> Show Less'
      : '<i class="fa-solid fa-chevron-down"></i> Show More Reviews';
    if (!showingAll)
      reviewsSection?.scrollIntoView({ behavior: "smooth", block: "start" });
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

  /* Initial render */
  updateCart();
}); // END DOMContentLoaded
