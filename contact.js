// Contact form
const contactForm = document.getElementById("contactForm");
const contactSuccess = document.getElementById("contactSuccess");

contactForm.addEventListener("submit", async (e) => {
  e.preventDefault(); 

  const formData = new FormData(contactForm);

  try {
    const response = await fetch(contactForm.action, {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json",
      },
    });

    if (response.ok) {
      // Show popup
      contactSuccess.classList.add("show");

      // Reset form
      contactForm.reset();

      // Hide popup after 4 seconds
      setTimeout(() => {
        contactSuccess.classList.remove("show");
      }, 4000);
    } else {
      alert("Error submitting form. Try again!");
    }
  } catch (err) {
    console.error(err);
    alert("Network error. Please try again later.");
  }
});
