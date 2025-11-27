// CART FUNCTIONALITY 
const addToCartBtn = document.querySelector(".add-to-cart");
const cartDrawer = document.getElementById("cartDrawer");
const cartSuccess = document.getElementById("cartSuccess");
const closeCart = document.querySelector(".close-cart");
const plusBtn = document.querySelector(".plus");
const minusBtn = document.querySelector(".minus");
const qtyValue = document.querySelector(".qty-value");
const totalDisplay = document.querySelector(".cartTotal");
const itemPrice = 50;

addToCartBtn.addEventListener("click", () => {
  cartDrawer.classList.add("show");
  cartSuccess.classList.add("show");
  void cartSuccess.offsetWidth;
  cartSuccess.classList.add("show");
});

addToCartBtn.addEventListener("click", () => {
  cartDrawer.classList.add("show");
  cartSuccess.classList.add("show");

  setTimeout(() => {
    cartSuccess.classList.remove("show");
  }, 3500);
});

// ❌ Close cart
closeCart.addEventListener("click", () => {
  cartDrawer.classList.remove("show");
});

// ➕➖ Quantity
plusBtn.addEventListener("click", () => {
  let qty = parseInt(qtyValue.textContent);
  qty++;
  qtyValue.textContent = qty;
  totalDisplay.textContent = `₹${qty * itemPrice}`;
});

minusBtn.addEventListener("click", () => {
  let qty = parseInt(qtyValue.textContent);
  if (qty > 1) qty--;
  qtyValue.textContent = qty;
  totalDisplay.textContent = `₹${qty * itemPrice}`;
});

// CHECKOUT SUCCESS POPUP
const checkoutBtn = document.querySelector(".checkout-btn");
const orderSuccess = document.getElementById("orderSuccess");

checkoutBtn.addEventListener("click", () => {
  cartDrawer.classList.remove("show");
  orderSuccess.classList.add("show");

  setTimeout(() => {
    orderSuccess.classList.remove("show");
  }, 4000);
});
