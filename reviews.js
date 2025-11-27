// Show more reviews
document.addEventListener("DOMContentLoaded", () => {
  const showMoreBtn = document.getElementById("showMoreBtn");
  const customers = document.querySelectorAll(".customer");
  const reviewsSection = document.getElementById("reviews");
  let showingAll = false;

  customers.forEach((cust, index) => {
    if (index >= 3) cust.classList.add("hidden-review");
  });

  showMoreBtn.addEventListener("click", () => {
    showingAll = !showingAll;

    customers.forEach((cust, index) => {
      if (index >= 3) {
        cust.classList.toggle("hidden-review", !showingAll);
        cust.classList.toggle("show-review", showingAll);
      }
    });

    showMoreBtn.textContent = showingAll ? "Show Less" : "Show More";

    if (!showingAll) {
      setTimeout(() => {
        reviewsSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 400);
    }
  });
});
