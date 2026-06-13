/* ── CONTACT.JS ──────────────────────────────────
   Contact form validation + submission,
   newsletter form
─────────────────────────────────────────────────── */

document.addEventListener("DOMContentLoaded", () => {
  const contactForm = document.getElementById("contactForm");
  const formSubmitError = document.getElementById("formSubmitError");
  const contactSuccessModal = document.getElementById("contactSuccess");
  const modalReplyEmail = document.getElementById("modalReplyEmail");
  const touchedFields = new Set();

  function validateField(input, force = false) {
    if (!force && !touchedFields.has(input)) return true;
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
    field.addEventListener("blur", () => {
      touchedFields.add(field);
      validateField(field);
    });
    field.addEventListener("input", () => {
      if (field.classList.contains("invalid")) validateField(field);
    });
  });

  contactForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const fields = [...contactForm.querySelectorAll("input, textarea")];
    if (!fields.map((f) => validateField(f, true)).every(Boolean)) return;

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
        if (contactSuccessModal) {
          contactSuccessModal.classList.add("show");
          window.HLC.trapFocus?.(contactSuccessModal);
          setTimeout(() => {
            contactSuccessModal.classList.remove("show");
            window.HLC.releaseFocus?.(contactSuccessModal);
          }, 5000);
        }
        contactForm.reset();
        touchedFields.clear();
        fields.forEach((f) => f.classList.remove("valid", "invalid"));
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
}); // END DOMContentLoaded
