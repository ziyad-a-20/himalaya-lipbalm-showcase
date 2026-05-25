/* ── PAGE LOADER ──────────────────────────────── */
window.addEventListener("load", () => {
  // Let the leaf draw animation complete (~2.2s) before revealing page
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
  AOS.init({
    duration: 850,
    easing: "ease-out-cubic",
    once: false,
    mirror: true,
    offset: 30,
    anchorPlacement: "top-bottom",
  });

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

    // Navbar shadow
    navbar?.classList.toggle("scrolled", sy > 20);

    // Back to top
    backToTop?.classList.toggle("show", sy > 400);

    // Active nav links
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

    // Rating bars — animate on scroll into view
    animateRatingBars();

    // Score counter
    animateScore();
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
        // View Transition API for smooth page-feel transitions
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
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

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
    {
      rootMargin: "100px",
    },
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

      let start = 0;

      const target = 4.3;
      const duration = 1400;
      const startTime = performance.now();

      const tick = (now) => {
        const elapsed = now - startTime;

        const progress = Math.min(elapsed / duration, 1);

        const eased = 1 - Math.pow(1 - progress, 3);

        const val = (start + (target - start) * eased).toFixed(1);

        scoreEl.textContent = val;

        if (progress < 1) {
          requestAnimationFrame(tick);
        }
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

  let wishlisted = false;

  function toggleWishlist() {
    wishlisted = !wishlisted;

    // Hero button
    wishlistBtnIcon?.classList.toggle("fa-regular", !wishlisted);

    wishlistBtnIcon?.classList.toggle("fa-solid", wishlisted);

    wishlistBtn?.classList.toggle("active", wishlisted);

    // Nav button
    wishlistNavIcon?.classList.toggle("fa-regular", !wishlisted);

    wishlistNavIcon?.classList.toggle("fa-solid", wishlisted);

    wishlistNavBtn?.classList.toggle("active", wishlisted);

    // Heart burst animation
    if (wishlisted && wishlistBtn) {
      wishlistBtn.classList.add("burst");

      setTimeout(() => {
        wishlistBtn.classList.remove("burst");
      }, 500);
    }

    // Toast
    if (wishlistMsg) {
      wishlistMsg.textContent = wishlisted
        ? "Added to wishlist!"
        : "Removed from wishlist";
    }

    wishlistToast?.classList.add("show");

    setTimeout(() => {
      wishlistToast?.classList.remove("show");
    }, 2500);
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

  // Add to cart buttons
  document.querySelectorAll(".add-to-cart").forEach((btn) => {
    btn.addEventListener("click", () => {
      openCart();

      cartSuccess?.classList.add("show");

      setTimeout(() => {
        cartSuccess?.classList.remove("show");
      }, 3000);
    });
  });

  // Quantity controls
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
    const total = cartQty * PRICE;

    if (qtyValueEl) {
      qtyValueEl.textContent = cartQty;
    }

    if (cartBadge) {
      cartBadge.textContent = cartQty;
    }

    if (cartSubtotal) {
      cartSubtotal.textContent = `₹${total}`;
    }

    if (totalEl) {
      totalEl.textContent = `₹${total}`;
    }

    if (cartHeaderSub) {
      cartHeaderSub.textContent = `${cartQty} item${cartQty > 1 ? "s" : ""} · ₹${total}`;
    }
  }

  // Checkout
  const orderSuccess = document.getElementById("orderSuccess");

  document.getElementById("checkoutBtn")?.addEventListener("click", () => {
    closeCart();

    orderSuccess?.classList.add("show");

    setTimeout(() => {
      orderSuccess?.classList.remove("show");
    }, 4500);
  });

  // Close modals on backdrop click
  [orderSuccess, document.getElementById("contactSuccess")].forEach((modal) => {
    modal?.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.classList.remove("show");
      }
    });
  });

  /* ── CONTACT FORM ───────────────────────────── */
  const contactForm = document.getElementById("contactForm");

  const contactSuccess = document.getElementById("contactSuccess");

  contactForm?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const btn = contactForm.querySelector("button[type=submit]");

    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending…';

    btn.disabled = true;

    try {
      const res = await fetch(contactForm.action, {
        method: "POST",
        body: new FormData(contactForm),
        headers: {
          Accept: "application/json",
        },
      });

      if (res.ok) {
        contactSuccess?.classList.add("show");

        contactForm.reset();

        setTimeout(() => {
          contactSuccess?.classList.remove("show");
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
      reviewsSection?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });

  /* ── FAQ ACCORDION ──────────────────────────── */
  document.querySelectorAll(".faq-q").forEach((btn) => {
    btn.addEventListener("click", () => {
      const item = btn.closest(".faq-item");

      const isOpen = item.classList.contains("open");

      // Close all
      document.querySelectorAll(".faq-item.open").forEach((el) => {
        el.classList.remove("open");

        el.querySelector(".faq-q")?.setAttribute("aria-expanded", "false");
      });

      // Open clicked item
      if (!isOpen) {
        item.classList.add("open");

        btn.setAttribute("aria-expanded", "true");
      }
    });
  });
}); // END DOMContentLoaded

/* ── INJECT KEYFRAMES ─────────────────────────── */
const s = document.createElement("style");

s.textContent = `
  @keyframes reviewFadeIn {
    from {
      opacity: 0;
      transform: translateY(18px);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .wishlist-btn.burst {
    animation: heartBurst 0.4s ease;
  }

  @keyframes heartBurst {
    0% {
      transform: scale(1);
    }

    40% {
      transform: scale(1.35);
    }

    70% {
      transform: scale(0.9);
    }

    100% {
      transform: scale(1);
    }
  }
`;

document.head.appendChild(s);
