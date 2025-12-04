// Simple in-memory product data for demo.
// Replace with your real products later.
const products = [
  {
    id: 1,
    name: "Product Name",
    price: 0,
  },
  {
    id: 2,
    name: "Kit Name",
    price: 0,
  },
  {
    id: 3,
    name: "Serum Name",
    price: 10,
  },
];

let cart = [];

// Helpers
function formatPrice(num) {
  return num.toFixed(2);
}

function updateCartCount() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.getElementById("cart-count").textContent = count;
}

function updateCartUI() {
  const cartItemsEl = document.getElementById("cart-items");
  const totalEl = document.getElementById("cart-total");

  cartItemsEl.innerHTML = "";

  if (cart.length === 0) {
    cartItemsEl.innerHTML = '<p class="cart-empty">Your cart is empty.</p>';
    totalEl.textContent = "0.00";
    return;
  }

  let total = 0;

  cart.forEach((item) => {
    const lineTotal = item.price * item.quantity;
    total += lineTotal;

    const row = document.createElement("div");
    row.className = "cart-item";
    row.innerHTML = `
      <div class="cart-item-title">${item.name} × ${item.quantity}</div>
      <div class="cart-item-price">₹ ${formatPrice(lineTotal)}</div>
      <button class="cart-item-remove" data-id="${item.id}">Remove</button>
    `;
    cartItemsEl.appendChild(row);
  });

  totalEl.textContent = formatPrice(total);
}

function addToCart(id) {
  const product = products.find((p) => p.id === id);
  if (!product) return;

  const existing = cart.find((item) => item.id === id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
    });
  }
  updateCartCount();
  updateCartUI();
}

// Razorpay checkout
function openRazorpayCheckout(amountInRupees) {
  const options = {
    key: "YOUR_RZP_TEST_KEY_HERE", // TODO: replace with your live/test key
    amount: amountInRupees * 100, // in paise
    currency: "INR",
    name: "YourBrand",
    description: "Order Payment",
    handler: function (response) {
      // This is called after successful payment
      // TODO: Verify payment on backend using response.razorpay_payment_id
      alert("Payment successful! Payment ID: " + response.razorpay_payment_id);
    },
    prefill: {
      name: "",
      email: "",
      contact: "",
    },
    notes: {},
    theme: {
      color: "#000000",
    },
  };

  const rzp = new Razorpay(options);
  rzp.open();
}

// DOM ready
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("year").textContent = new Date().getFullYear();

  // Attach add-to-cart listeners
  document.querySelectorAll(".add-to-cart-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = parseInt(btn.closest(".product-card").dataset.id, 10);
      addToCart(id);
    });
  });

  // Cart open/close
  const cartBtn = document.getElementById("cart-btn");
  const cartOverlay = document.getElementById("cart-overlay");
  const closeCartBtn = document.getElementById("close-cart");

  cartBtn.addEventListener("click", () => {
    cartOverlay.classList.add("active");
  });

  closeCartBtn.addEventListener("click", () => {
    cartOverlay.classList.remove("active");
  });

  cartOverlay.addEventListener("click", (e) => {
    if (e.target === cartOverlay) {
      cartOverlay.classList.remove("active");
    }
  });

  // Remove item from cart
  document.getElementById("cart-items").addEventListener("click", (e) => {
    if (e.target.classList.contains("cart-item-remove")) {
      const id = parseInt(e.target.dataset.id, 10);
      cart = cart.filter((item) => item.id !== id);
      updateCartCount();
      updateCartUI();
    }
  });

  // Checkout
  document.getElementById("checkout-btn").addEventListener("click", () => {
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    if (total <= 0) {
      alert("Cart is empty or prices not set.");
      return;
    }
    openRazorpayCheckout(total);
  });
});



