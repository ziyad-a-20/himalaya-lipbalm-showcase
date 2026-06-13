/* ── WISHLIST.JS ─────────────────────────────────
   Wishlist toggle, heart animation, toast
─────────────────────────────────────────────────── */

window.HLC = window.HLC || {};

document.addEventListener("DOMContentLoaded", () => {
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
}); // END DOMContentLoaded
