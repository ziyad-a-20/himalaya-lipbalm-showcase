/* ── CART.JS ─────────────────────────────────────
   Spring physics drawer, qty, promo codes,
   tier discounts, badge pop
─────────────────────────────────────────────────── */

window.HLC = window.HLC || {};

document.addEventListener("DOMContentLoaded", () => {
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

  /* ── Spring state ── */
  let springPos = 100;
  let springVel = 0;
  let springTarget = 100;
  let springRaf = null;

  const isMobile = () => window.innerWidth <= 768;

  const SPRING_STIFFNESS = 500;
  const SPRING_DAMPING = 48;
  const SPRING_MASS = 1;

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  function springStep() {
    const dt = 1 / 60;
    const force =
      -SPRING_STIFFNESS * (springPos - springTarget) -
      SPRING_DAMPING * springVel;
    springVel += (force / SPRING_MASS) * dt;
    springPos += springVel * dt;
    if (Math.abs(springPos - springTarget) < 0.1 && Math.abs(springVel) < 0.1) {
      springPos = springTarget;
      springVel = 0;
      applyCartTransform(springPos);
      springRaf = null;
      return;
    }
    applyCartTransform(springPos);
    springRaf = requestAnimationFrame(springStep);
  }

  function applyCartTransform(pct) {
    if (!cartDrawer) return;
    if (isMobile()) {
      cartDrawer.style.transform = `translateY(${Math.max(-3, Math.min(100, pct))}%)`;
    } else {
      cartDrawer.style.transform = `translateX(${Math.max(-2, Math.min(100, pct))}%)`;
    }
  }

  function springTo(target) {
    springTarget = target;
    if (springRaf) {
      cancelAnimationFrame(springRaf);
      springRaf = null;
    }
    if (prefersReducedMotion) {
      springPos = target;
      applyCartTransform(target);
      return;
    }
    springRaf = requestAnimationFrame(springStep);
  }

  /* Initialise closed */
  applyCartTransform(100);

  /* ── Trap / Release focus ── */
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
  window.HLC.trapFocus = trapFocus;
  window.HLC.releaseFocus = releaseFocus;

  /* ── Open / Close ── */
  const openCart = () => {
    springPos = 100;
    springVel = 0;
    if (springRaf) {
      cancelAnimationFrame(springRaf);
      springRaf = null;
    }
    applyCartTransform(100);
    cartDrawer?.classList.add("show");
    cartOverlay?.classList.add("show");
    document.body.style.overflow = "hidden";
    springTo(0);
    trapFocus(cartDrawer);
  };
  const closeCart = () => {
    springTo(100);
    cartOverlay?.classList.remove("show");
    document.body.style.overflow = "";
    releaseFocus(cartDrawer);
    setTimeout(() => {
      if (springTarget === 100) cartDrawer?.classList.remove("show");
    }, 600);
  };
  window.HLC.openCart = openCart;
  window.HLC.closeCart = closeCart;

  cartToggle?.addEventListener("click", openCart);
  closeCartBtn?.addEventListener("click", closeCart);
  cartOverlay?.addEventListener("click", closeCart);

  /* ── Cart data ── */
  const PRICE = 50;
  const TIERS = [{ minQty: 3, discount: 0.15 }];
  let cartQty = parseInt(localStorage.getItem("hlc_cartQty") || "0");
  let promoApplied = false;
  let promoDiscount = 0;
  let promoCode = "";
  const PROMO_CODES = { NATURE10: 0.1, SAVE15: 0.15 };

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
    popBadge();
  });
  document.querySelector(".qty-btn.minus")?.addEventListener("click", () => {
    if (cartQty > 1) {
      cartQty--;
      updateCart();
      popBadge();
    }
  });
  removeItemBtn?.addEventListener("click", () => {
    cartQty = 0;
    updateCart();
  });

  function getTierDiscount(qty) {
    for (let i = TIERS.length - 1; i >= 0; i--)
      if (qty >= TIERS[i].minQty) return TIERS[i].discount;
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
  window.HLC.resetPromoUI = resetPromoUI;

  /* ── resetCart: zeroes the in-memory qty, clears storage, re-renders ── */
  function resetCart() {
    cartQty = 0;
    localStorage.removeItem("hlc_cartQty");
    resetPromoUI();
    updateCart();
  }
  window.HLC.resetCart = resetCart;

  function getEffectiveDiscount(qty) {
    const t = getTierDiscount(qty);
    if (promoApplied && t > 0) return Math.min(t + promoDiscount, 0.25);
    if (promoApplied) return promoDiscount;
    return t;
  }
  function getDiscountLabel(qty) {
    const t = getTierDiscount(qty);
    if (promoApplied && t > 0) return `${promoCode} + Tier`;
    if (promoApplied) return promoCode;
    return "Tier (3+ units)";
  }

  function popBadge() {
    if (!cartBadge || prefersReducedMotion) return;
    cartBadge.classList.remove("pop");
    void cartBadge.offsetWidth;
    cartBadge.classList.add("pop");
    setTimeout(() => cartBadge.classList.remove("pop"), 400);
  }

  function updateCart() {
    localStorage.setItem("hlc_cartQty", cartQty);
    const isEmpty = cartQty === 0;
    const effectiveDisc = getEffectiveDiscount(cartQty);
    const subtotal = cartQty * PRICE;
    const discount = Math.round(subtotal * effectiveDisc);
    const total = subtotal - discount;

    cartItem?.classList.toggle("hidden", isEmpty);
    cartEmpty?.classList.toggle("hidden", !isEmpty);
    if (removeItemBtn) removeItemBtn.style.display = isEmpty ? "none" : "flex";
    cartPromoWrap?.classList.toggle("hidden", isEmpty);
    cartFooter?.classList.toggle("cart-footer--disabled", isEmpty);

    if (qtyTierNudge && qtyTierMsg) {
      if (!isEmpty && cartQty < 3) {
        const need = 3 - cartQty;
        qtyTierMsg.textContent = `Add ${need} more unit${need > 1 ? "s" : ""} — get 15% off!`;
        qtyTierNudge.classList.remove("hidden", "tier-applied");
      } else if (!isEmpty && cartQty >= 3) {
        const extra = promoApplied
          ? ` + ${Math.round(promoDiscount * 100)}% ${promoCode}`
          : "";
        qtyTierMsg.textContent = `15% tier${extra} applied on ${cartQty} units 🎉`;
        qtyTierNudge.classList.remove("hidden");
        qtyTierNudge.classList.add("tier-applied");
      } else {
        qtyTierNudge.classList.add("hidden");
      }
    }

    if (qtyValueEl) qtyValueEl.textContent = cartQty;
    if (cartBadge) cartBadge.textContent = cartQty;

    const cartItemPrice = document.querySelector(".cart-item-total-price");
    if (cartItemPrice) cartItemPrice.textContent = subtotal;
    if (cartSubtotalEl) cartSubtotalEl.textContent = subtotal;
    if (totalEl) totalEl.textContent = `₹${total}`;
    if (cartHeaderSub)
      cartHeaderSub.textContent = isEmpty
        ? "0 items"
        : `${cartQty} item${cartQty > 1 ? "s" : ""} · ₹${total}`;

    const cartPromoRow = document.getElementById("cartPromoRow");
    const cartPromoSaving = document.getElementById("cartPromoSaving");
    const cartPromoLabel = document.getElementById("cartPromoLabel");
    const hasDiscount = effectiveDisc > 0 && !isEmpty;
    cartPromoRow?.classList.toggle("hidden", !hasDiscount);
    if (cartPromoSaving) cartPromoSaving.textContent = `−₹${discount}`;
    if (cartPromoLabel) cartPromoLabel.textContent = getDiscountLabel(cartQty);

    if (stickyBuyPrice) {
      stickyBuyPrice.textContent =
        effectiveDisc > 0
          ? `₹${Math.round(PRICE * (1 - effectiveDisc))} after ${getDiscountLabel(cartQty)} · 10g`
          : "₹50 · 10g";
    }

    const announce = document.getElementById("cartAnnounce");
    if (announce)
      announce.textContent = isEmpty
        ? "Cart is now empty"
        : `Cart updated: ${cartQty} item${cartQty > 1 ? "s" : ""}, total ₹${total}`;
  }
  window.HLC.updateCart = updateCart;

  /* ── Promo code ── */
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
      const t = getTierDiscount(cartQty);
      let msg = `✓ ${entered} applied — ${Math.round(promoDiscount * 100)}% off!`;
      if (t > 0) msg += " Combined with 15% tier discount.";
      promoFeedback.textContent = msg;
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

  /* Initial render */
  updateCart();
}); // END DOMContentLoaded
