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

  /* ── SCROLL PROGRESS BAR ─────────────────────── */
  const scrollProgress = document.getElementById("scrollProgress");
  function updateScrollProgress() {
    if (!scrollProgress) return;
    const pct =
      (window.scrollY / (document.body.scrollHeight - window.innerHeight)) *
      100;
    scrollProgress.style.width = Math.min(pct, 100) + "%";
    scrollProgress.setAttribute("aria-valuenow", Math.round(pct));
  }

  /* ── PROMO BANNER ────────────────────────────── */
  document.getElementById("promoClose")?.addEventListener("click", () => {
    document.getElementById("promoBanner")?.classList.add("hidden");
  });

  /* ── NAVBAR ──────────────────────────────────── */
  const navbar = document.getElementById("navbar");
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-links a");
  const backToTop = document.getElementById("backToTop");
  const hamburger = document.getElementById("hamburger");
  const navLinksEl = document.getElementById("navLinks");
  const navOverlay = document.getElementById("navOverlay");

  const onScroll = () => {
    const sy = window.scrollY;
    navbar?.classList.toggle("scrolled", sy > 20);
    backToTop?.classList.toggle("show", sy > 400);
    updateScrollProgress();
    updateStickyBar();
    let current = "";
    sections.forEach((s) => {
      if (sy >= s.offsetTop - 120 && sy < s.offsetTop - 120 + s.offsetHeight)
        current = s.id;
    });
    navLinks.forEach((a) =>
      a.classList.toggle("active", a.getAttribute("href") === "#" + current),
    );
  };
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ── NAV SMOOTH SCROLL ───────────────────────── */
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

  function closeNav() {
    hamburger?.classList.remove("open");
    hamburger?.setAttribute("aria-expanded", "false");
    navLinksEl?.classList.remove("open");
    navOverlay?.classList.remove("show");
    document.body.style.overflow = "";
  }

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
    ) {
      closeNav();
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

  /* ── RATING BARS — IntersectionObserver ─────── */
  let barsAnimated = false;
  const reviewsSection = document.getElementById("reviews");

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

  /* ── SCORE COUNT-UP ──────────────────────────── */
  const scoreEl = document.getElementById("scoreCount");
  function animateScore() {
    if (!scoreEl) return;
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

  /* ── BENEFIT CARD NUMBER ANIMATE ────────────── */
  const benefitNums = document.querySelectorAll(".benefit-num");
  const benefitObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("num-animated");
          benefitObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 },
  );
  benefitNums.forEach((num) => benefitObserver.observe(num));

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
  const wishlistToastIcon = document.querySelector(".wishlist-toast-icon");

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
    if (wishlistToastIcon)
      wishlistToastIcon.style.color = wishlisted
        ? "var(--wishlist-toast-icon-color)"
        : "var(--muted)";
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
  const cartPromoWrap = document.getElementById("cartPromoWrap");
  const qtyTierNudge = document.getElementById("qtyTierNudge");
  const qtyTierMsg = document.getElementById("qtyTierMsg");
  const stickyBuyPrice = document.getElementById("stickyBuyPrice");

  const PRICE = 50;
  const TIERS = [{ minQty: 3, discount: 0.15 }];

  let cartQty = parseInt(localStorage.getItem("hlc_cartQty") || "0");
  let promoApplied = false;
  let promoDiscount = 0;
  let promoCode = "";

  const PROMO_CODES = { NATURE10: 0.1, SAVE15: 0.15 };

  /* Restore saved promo */
  const savedPromo = localStorage.getItem("hlc_promo");
  if (savedPromo && PROMO_CODES[savedPromo]) {
    promoApplied = true;
    promoDiscount = PROMO_CODES[savedPromo];
    promoCode = savedPromo;
    const inp = document.getElementById("promoCodeInput");
    const btn = document.getElementById("promoApplyBtn");
    const fb = document.getElementById("promoFeedback");
    if (inp) {
      inp.value = savedPromo;
      inp.disabled = true;
    }
    if (btn) {
      btn.textContent = "Applied";
      btn.disabled = true;
    }
    if (fb) {
      fb.textContent = `✓ ${savedPromo} applied — ${Math.round(promoDiscount * 100)}% off!`;
      fb.className = "promo-feedback success";
    }
  }

  const openCart = () => {
    cartDrawer?.classList.add("show");
    cartOverlay?.classList.add("show");
    document.body.style.overflow = "hidden";
    trapFocus(cartDrawer);
  };
  const closeCart = () => {
    cartDrawer?.classList.remove("show");
    cartOverlay?.classList.remove("show");
    document.body.style.overflow = "";
    releaseFocus(cartDrawer);
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

  function getTierDiscount(qty) {
    for (let i = TIERS.length - 1; i >= 0; i--) {
      if (qty >= TIERS[i].minQty) return TIERS[i].discount;
    }
    return 0;
  }

  function resetPromoUI() {
    promoApplied = false;
    promoDiscount = 0;
    promoCode = "";
    localStorage.removeItem("hlc_promo");
    const inp = document.getElementById("promoCodeInput");
    const btn = document.getElementById("promoApplyBtn");
    const fb = document.getElementById("promoFeedback");
    if (inp) {
      inp.value = "";
      inp.disabled = false;
    }
    if (btn) {
      btn.textContent = "Apply";
      btn.disabled = false;
    }
    if (fb) {
      fb.textContent = "";
      fb.className = "promo-feedback";
    }
  }

  function updateCart() {
    localStorage.setItem("hlc_cartQty", cartQty);

    const isEmpty = cartQty === 0;
    const tierDisc = getTierDiscount(cartQty);
    const effectiveDisc = Math.max(promoApplied ? promoDiscount : 0, tierDisc);
    const subtotal = cartQty * PRICE;
    const discount = Math.round(subtotal * effectiveDisc);
    const total = subtotal - discount;

    cartItem?.classList.toggle("hidden", isEmpty);
    cartEmpty?.classList.toggle("hidden", !isEmpty);
    if (removeItemBtn) removeItemBtn.style.display = isEmpty ? "none" : "flex";
    cartPromoWrap?.classList.toggle("hidden", isEmpty);

    if (cartFooter) {
      cartFooter.style.opacity = isEmpty ? "0.45" : "1";
      cartFooter.style.pointerEvents = isEmpty ? "none" : "auto";
    }

    if (qtyTierNudge && qtyTierMsg) {
      if (!isEmpty && cartQty < 3) {
        const need = 3 - cartQty;
        qtyTierMsg.textContent = `Add ${need} more unit${need > 1 ? "s" : ""} — get 15% off!`;
        qtyTierNudge.classList.remove("hidden", "tier-applied");
      } else if (!isEmpty && cartQty >= 3) {
        qtyTierMsg.textContent = `15% tier discount applied on ${cartQty} units 🎉`;
        qtyTierNudge.classList.remove("hidden");
        qtyTierNudge.classList.add("tier-applied");
      } else {
        qtyTierNudge.classList.add("hidden");
      }
    }

    if (qtyValueEl) qtyValueEl.textContent = cartQty;
    if (cartBadge) cartBadge.textContent = cartQty;

    const cartItemTotalPrice = document.querySelector(".cart-item-total-price");
    if (cartItemTotalPrice) cartItemTotalPrice.textContent = subtotal;

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
      cartPromoRow.classList.toggle("hidden", !(effectiveDisc > 0 && !isEmpty));
    if (cartPromoSaving) cartPromoSaving.textContent = `−₹${discount}`;
    if (cartPromoLabel)
      cartPromoLabel.textContent =
        promoApplied && promoDiscount >= tierDisc
          ? promoCode
          : "Tier (3+ units)";

    if (stickyBuyPrice) {
      stickyBuyPrice.textContent = promoApplied
        ? `₹${PRICE - Math.round(PRICE * promoDiscount)} after ${promoCode} · 10g`
        : "₹50 · 10g";
    }

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
      localStorage.setItem("hlc_promo", entered);
      promoFeedback.textContent = `✓ ${entered} applied — ${Math.round(promoDiscount * 100)}% off!`;
      promoFeedback.className = "promo-feedback success";
      promoCodeInput.value = entered;
      promoCodeInput.disabled = true;
      if (promoApplyBtn) {
        promoApplyBtn.textContent = "Applied";
        promoApplyBtn.disabled = true;
      }
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
  const tableScrollHint = document.getElementById("tableScrollHint");

  function updateTableMask() {
    if (!comparisonScroll) return;
    const { scrollWidth, clientWidth } = comparisonScroll;
    const isOverflowing = scrollWidth > clientWidth + 2;
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
    if (!modal) return;
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
    if (modal?._trapHandler)
      modal.removeEventListener("keydown", modal._trapHandler);
  }

  /* ── MODALS ──────────────────────────────────── */
  const orderSuccess = document.getElementById("orderSuccess");
  const contactSuccessModal = document.getElementById("contactSuccess");
  const reviewSuccessModal = document.getElementById("reviewSuccess");
  const modalReplyEmail = document.getElementById("modalReplyEmail");

  document.getElementById("checkoutBtn")?.addEventListener("click", () => {
    if (cartQty === 0) return;
    closeCart();
    cartQty = 0;
    localStorage.removeItem("hlc_cartQty");
    resetPromoUI();
    updateCart();
    orderSuccess?.classList.add("show");
    if (orderSuccess) trapFocus(orderSuccess);
    setTimeout(() => {
      orderSuccess?.classList.remove("show");
      if (orderSuccess) releaseFocus(orderSuccess);
    }, 5000);
  });

  document.getElementById("closeOrderModal")?.addEventListener("click", () => {
    orderSuccess?.classList.remove("show");
    releaseFocus(orderSuccess);
  });
  document
    .getElementById("closeContactModal")
    ?.addEventListener("click", () => {
      contactSuccessModal?.classList.remove("show");
      releaseFocus(contactSuccessModal);
    });
  document.getElementById("closeReviewModal")?.addEventListener("click", () => {
    reviewSuccessModal?.classList.remove("show");
    releaseFocus(reviewSuccessModal);
  });

  [orderSuccess, contactSuccessModal, reviewSuccessModal].forEach((modal) => {
    modal?.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.classList.remove("show");
        releaseFocus(modal);
      }
    });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (cartDrawer?.classList.contains("show")) {
      closeCart();
      return;
    }
    [orderSuccess, contactSuccessModal, reviewSuccessModal].forEach((modal) => {
      if (modal?.classList.contains("show")) {
        modal.classList.remove("show");
        releaseFocus(modal);
      }
    });
  });

  /* ── CONTACT FORM ────────────────────────────── */
  const contactForm = document.getElementById("contactForm");
  const formSubmitError = document.getElementById("formSubmitError");

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
    if (formSubmitError) {
      formSubmitError.textContent = "";
      formSubmitError.className = "form-submit-error";
    }

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
        if (formSubmitError) {
          formSubmitError.textContent =
            "Something went wrong. Please try again.";
          formSubmitError.className = "form-submit-error visible";
        }
      }
    } catch {
      if (formSubmitError) {
        formSubmitError.textContent =
          "Network error. Please check your connection and try again.";
        formSubmitError.className = "form-submit-error visible";
      }
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
      const bVal = parseInt(b.getAttribute("data-val"));
      b.querySelector("i").className =
        bVal <= val ? "fa-solid fa-star" : "fa-regular fa-star";
    });
  }
  function resetStars() {
    starBtns.forEach((b) => {
      b.querySelector("i").className = "fa-regular fa-star";
    });
    const ratingInput = document.getElementById("wr-rating");
    if (ratingInput) ratingInput.value = 0;
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
    const initial = name.charAt(0).toUpperCase();
    const palettes = [
      { bg: "#e9f7f2", col: "#2f8f6d" },
      { bg: "#f6f0ff", col: "#6b3aa6" },
      { bg: "#fff6ea", col: "#e07a1f" },
      { bg: "#e8f8ff", col: "#0b6b8c" },
    ];
    const p = palettes[Math.floor(Math.random() * palettes.length)];

    card.innerHTML = `
      <div class="review-top">
        <div class="review-avatar" style="--av-bg:${p.bg};--av-color:${p.col}">${initial}</div>
        <div><h5>${name}</h5><div class="review-stars">${starsHtml}</div></div>
        <span class="review-date">Just now</span>
      </div>
      <p>"${text}"</p>
      <button class="review-helpful voted" aria-label="Mark as helpful">
        <i class="fa-solid fa-thumbs-up"></i>
        <span class="helpful-count">0</span> people found this helpful
      </button>`;
    grid.insertBefore(card, grid.firstChild);

    writeReviewForm.reset();
    selectedRating = 0;
    resetStars();
    writeReviewForm.classList.remove("open");
    writeReviewToggle.style.display = "";

    reviewSuccessModal?.classList.add("show");
    if (reviewSuccessModal) trapFocus(reviewSuccessModal);
    setTimeout(() => {
      reviewSuccessModal?.classList.remove("show");
      releaseFocus(reviewSuccessModal);
    }, 4000);
  });

  /* ── INGREDIENT EXPAND PANELS ────────────────── */
  document.querySelectorAll(".ingredient-overlay").forEach((overlay) => {
    const card = overlay.closest(".ingredient-card");
    const expandEl = card?.querySelector(".ingredient-expand");

    function toggleExpand() {
      const isOpen = card.classList.contains("expanded");
      /* Close all others first */
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
        toggleExpand();
      }
    });
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

  /* ── INITIAL RENDER ──────────────────────────── */
  updateCart();
  updateScrollProgress();
}); // END DOMContentLoaded
  