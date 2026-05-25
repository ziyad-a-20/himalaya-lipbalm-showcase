/* ── PAGE LOADER ──────────────────────────────── */
window.addEventListener("load", () => {
  const minDisplay = 2400;
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

  /* AOS fallback — force-reveal all elements after 4s
     in case AOS fails to load or device has reduced motion */
  setTimeout(() => {
    document.querySelectorAll("[data-aos]").forEach((el) => {
      el.classList.add("aos-animate");
      el.style.pointerEvents = "auto";
    });
  }, 4000);

  /* ── PROMO BANNER ────────────────────────────── */
  const promoBanner = document.getElementById("promoBanner");
  const promoClose = document.getElementById("promoClose");

  promoClose?.addEventListener("click", () => {
    promoBanner?.classList.add("hidden");
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
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (sy >= sectionTop && sy < sectionTop + sectionHeight) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.toggle(
        "active",
        link.getAttribute("href") === "#" + current,
      );
    });

    animateRatingBars();
    animateScore();
    updateStickyBar();
  };

  window.addEventListener("scroll", onScroll, { passive: true });

  /* ── NAV SMOOTH SCROLL ──────────────────────── */
  const hamburger = document.getElementById("hamburger");
  const navLinksEl = document.getElementById("navLinks");

  navLinks.forEach((a) => {
    a.addEventListener("click", (e) => {
      e.preventDefault();
      const target = document.getElementById(a.getAttribute("href").slice(1));

      if (target) {
        if (document.startViewTransition) {
          document.startViewTransition(() => {
            target.scrollIntoView({ behavior: "instant" });
          });
        } else {
          target.scrollIntoView({ behavior: "smooth" });
        }
      }

      navLinksEl?.classList.remove("open");
      hamburger?.classList.remove("open");
    });
  });

  /* ── HAMBURGER ───────────────────────────────── */
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

  /* ── LEARN MORE ──────────────────────────────── */
  document.querySelector(".learn-more-btn")?.addEventListener("click", () => {
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
  });

  /* ── BACK TO TOP ─────────────────────────────── */
  backToTop?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* ── MOBILE STICKY BUY BAR ───────────────────── */
  const stickyBuyBar = document.getElementById("stickyBuyBar");
  const heroSection = document.getElementById("home");

  function updateStickyBar() {
    if (!stickyBuyBar || !heroSection) return;
    const heroBottom = heroSection.getBoundingClientRect().bottom;
    stickyBuyBar.classList.toggle("show", heroBottom < 0);
  }

  /* ── LAZY IMAGE LOADING ─────────────────────── */
  const lazyImgs = document.querySelectorAll(".lazy-img");

  const imgObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const img = entry.target;
        const src = img.getAttribute("data-src");
        if (!src) return;

        const tempImg = new Image();
        tempImg.onload = () => {
          img.src = src;
          img.classList.add("loaded");
        };
        tempImg.src = src;
        imgObserver.unobserve(img);
      });
    },
    { rootMargin: "100px" },
  );

  lazyImgs.forEach((img) => imgObserver.observe(img));

  /* ── ANIMATED RATING BARS ───────────────────── */
  let barsAnimated = false;
  const reviewsSection = document.getElementById("reviews");

  function animateRatingBars() {
    if (barsAnimated || !reviewsSection) return;
    const rect = reviewsSection.getBoundingClientRect();
    if (rect.top < window.innerHeight - 100) {
      barsAnimated = true;
      document.querySelectorAll(".bar-fill").forEach((bar) => {
        const target = bar.getAttribute("data-width");
        requestAnimationFrame(() => {
          bar.style.width = target;
        });
      });
    }
  }

  /* ── SCORE COUNT-UP ─────────────────────────── */
  let scoreAnimated = false;
  const scoreEl = document.getElementById("scoreCount");

  function animateScore() {
    if (scoreAnimated || !scoreEl || !reviewsSection) return;
    const rect = reviewsSection.getBoundingClientRect();
    if (rect.top < window.innerHeight - 100) {
      scoreAnimated = true;
      const target = 4.3;
      const duration = 1400;
      const startTime = performance.now();

      const tick = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        scoreEl.textContent = (eased * target).toFixed(1);
        if (progress < 1) requestAnimationFrame(tick);
      };

      requestAnimationFrame(tick);
    }
  }

  /* ── WISHLIST ────────────────────────────────── */
  const wishlistBtn = document.getElementById("wishlistBtn");
  const wishlistBtnIcon = document.getElementById("wishlistBtnIcon");
  const wishlistNavBtn = document.getElementById("wishlistNavBtn");
  const wishlistNavIcon = document.getElementById("wishlistNavIcon");
  const wishlistToast = document.getElementById("wishlistToast");
  const wishlistMsg = document.getElementById("wishlistMsg");

  // Restore persisted state
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

    if (wishlistMsg) {
      wishlistMsg.textContent = wishlisted
        ? "Added to wishlist!"
        : "Removed from wishlist";
    }
    wishlistToast?.classList.add("show");
    setTimeout(() => wishlistToast?.classList.remove("show"), 2500);
  }

  wishlistBtn?.addEventListener("click", toggleWishlist);
  wishlistNavBtn?.addEventListener("click", toggleWishlist);

  /* ── CART ───────────────────────────────────── */
  const cartDrawer = document.getElementById("cartDrawer");
  const cartOverlay = document.getElementById("cartOverlay");
  const cartToggle = document.getElementById("cartToggle");
  const closeCartBtn = document.getElementById("closeCart");
  const cartSuccess = document.getElementById("cartSuccess");
  const qtyValueEl = document.querySelector(".qty-value");
  const cartBadge = document.getElementById("cartBadge");
  const cartHeaderSub = document.getElementById("cartHeaderSub");
  const cartSubtotal = document.querySelector(".cartSubtotal");
  const totalEl = document.querySelector(".cartTotal");

  const PRICE = 50;
  const PROMO_DISC = 0.1;

  let cartQty = 1;

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

  function updateCart() {
    const subtotal = cartQty * PRICE;
    const discount = Math.round(subtotal * PROMO_DISC);
    const total = subtotal - discount;

    if (qtyValueEl) qtyValueEl.textContent = cartQty;
    if (cartBadge) cartBadge.textContent = cartQty;
    if (cartSubtotal) cartSubtotal.textContent = subtotal;
    if (totalEl) totalEl.textContent = `₹${total}`;
    if (cartHeaderSub) {
      cartHeaderSub.textContent = `${cartQty} item${cartQty > 1 ? "s" : ""} · ₹${total}`;
    }

    // Update promo savings label
    const promoSaving = document.querySelector(".promo-code-tag");
    if (promoSaving) promoSaving.textContent = `Save ₹${discount}`;

    // Announce to screen readers
    const announce = document.getElementById("cartAnnounce");
    if (announce) {
      announce.textContent = `Cart updated: ${cartQty} item${cartQty > 1 ? "s" : ""}, total ₹${total}`;
    }
  }

  /* ── MODAL FOCUS TRAP ────────────────────────── */
  function trapFocus(modal) {
    const focusable = modal.querySelectorAll(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (first) first.focus();

    modal._trapHandler = (e) => {
      if (e.key !== "Tab") return;
      if (focusable.length === 0) {
        e.preventDefault();
        return;
      }
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
    if (modal._trapHandler) {
      modal.removeEventListener("keydown", modal._trapHandler);
    }
  }

  /* ── CHECKOUT ────────────────────────────────── */
  const orderSuccess = document.getElementById("orderSuccess");

  document.getElementById("checkoutBtn")?.addEventListener("click", () => {
    closeCart();
    orderSuccess?.classList.add("show");
    if (orderSuccess) trapFocus(orderSuccess);
    setTimeout(() => {
      orderSuccess?.classList.remove("show");
      if (orderSuccess) releaseFocus(orderSuccess);
    }, 4500);
  });

  // Close order modal via close button
  document.getElementById("closeOrderModal")?.addEventListener("click", () => {
    orderSuccess?.classList.remove("show");
    if (orderSuccess) releaseFocus(orderSuccess);
  });

  // Close contact modal via close button
  const contactSuccessModal = document.getElementById("contactSuccess");
  document
    .getElementById("closeContactModal")
    ?.addEventListener("click", () => {
      contactSuccessModal?.classList.remove("show");
      if (contactSuccessModal) releaseFocus(contactSuccessModal);
    });

  // Close modals on backdrop click
  [orderSuccess, contactSuccessModal].forEach((modal) => {
    modal?.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.classList.remove("show");
        releaseFocus(modal);
      }
    });
  });

  // Close modals on Escape key
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

  /* ── CONTACT FORM ───────────────────────────── */
  const contactForm = document.getElementById("contactForm");
  const contactSuccess = document.getElementById("contactSuccess");

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

  // Validate on blur
  contactForm?.querySelectorAll("input, textarea").forEach((field) => {
    field.addEventListener("blur", () => validateField(field));
    field.addEventListener("input", () => {
      if (field.classList.contains("invalid")) validateField(field);
    });
  });

  contactForm?.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Validate all fields before submit
    const fields = [...contactForm.querySelectorAll("input, textarea")];
    const valid = fields.map((f) => validateField(f)).every(Boolean);
    if (!valid) return;

    const btn = contactForm.querySelector("button[type=submit]");
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending…';
    btn.disabled = true;

    try {
      const res = await fetch(contactForm.action, {
        method: "POST",
        body: new FormData(contactForm),
        headers: { Accept: "application/json" },
      });

      if (res.ok) {
        contactSuccess?.classList.add("show");
        if (contactSuccess) trapFocus(contactSuccess);
        contactForm.reset();
        fields.forEach((f) => {
          f.classList.remove("valid", "invalid");
        });
        setTimeout(() => {
          contactSuccess?.classList.remove("show");
          if (contactSuccess) releaseFocus(contactSuccess);
        }, 4500);
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

  /* ── REVIEWS: SHOW MORE ─────────────────────── */
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

    if (!showingAll) {
      reviewsSection?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });

  /* ── FAQ ACCORDION ──────────────────────────── */
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
