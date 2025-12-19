// Sample product data
const products = [
  { id: 1, title: "Calathea Roseopicta", price: 150, image: "../assets/images/1.png" },
  { id: 2, title: "Chinese Evergreen", price: 150, image: "assets/images/2.png" },
  { id: 3, title: "Jade Plant", price: 150, image: "assets/images/3.png" },
  { id: 4, title: "Calathea Freddie", price: 150, image: "assets/images/4.png" },
  { id: 5, title: "False Cypress", price: 150, image: "assets/images/5.png" },
  { id: 6, title: "Snake Plant", price: 150, image: "assets/images/6.png" },
];

// Max items for bundle
const MAX_BUNDLE_ITEMS = 3;

// Selected products array (with quantity)
let selectedProducts = []; // [{ id, title, price, image, quantity }]

// DOM elements
const productGrid = document.querySelector(".product-grid");
const selectedList = document.getElementById("selected-products");
const progressBar = document.getElementById("progress");
const progressText = document.getElementById("progress-text");
const discountAmount = document.getElementById("discount-amount");
const subtotalAmount = document.getElementById("subtotal-amount");
const addToCartBtn = document.getElementById("add-to-cart-btn");

// Initialize product cards
function renderProducts() {
  products.forEach((product) => {
    const card = document.createElement("article");
    card.className = "product-card";
    card.innerHTML = `
      <div class="product-card-img"><img src="${product.image}" alt="${product.title}" /></div>
      <div class="product-title">${product.title}</div>
      <div class="product-price">$${product.price.toFixed(2)}</div>
      <div class="toggle-btn" data-id="${product.id}">
        <div class="product-select-text">add to bundle</div>
        <div class="product-select-icon">+</div>
      </div>
    `;
    productGrid.appendChild(card);
  });
}

// Update sidebar UI
function updateSidebar() {
  // Update progress
  progressBar.value = selectedProducts.length;
  progressText.textContent = `${selectedProducts.length} / ${MAX_BUNDLE_ITEMS} items added`;

  // Update selected product list
  selectedList.innerHTML = "";
  selectedProducts.forEach((product, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <img src="${product.image}" alt="${product.title}" />
      <div class="selected-product-detailes">
      <span>${product.title}</span>
      <div>$${(product.price * product.quantity).toFixed(2)}</div>
      <div class="quitity">
      <div class="quitity-btn" >
        <div class="qty-btn decrease" data-index="${index}">-</div>
        <span>${product.quantity}</span>
        <div class="qty-btn increase" data-index="${index}">+</div>
      </div>
      <button class="delete-btn"  data-index="${index}"><i class="fa-solid fa-trash"></i></button>
      </div>
      </div>
    `;
    selectedList.appendChild(li);
  });

  // Calculate subtotal
  let subtotal = selectedProducts.reduce((acc, p) => acc + p.price * p.quantity, 0);

  // Calculate discount
  let discount = 0;
  if (selectedProducts.length >= 1) {
    discount = subtotal * 0.3; // 30% off
  }

  discountAmount.textContent = `-$${discount.toFixed(2)}`;
  subtotalAmount.textContent = `$${(subtotal - discount).toFixed(2)}`;

  // Enable/disable button
  if (selectedProducts.length >= MAX_BUNDLE_ITEMS) {
    addToCartBtn.disabled = false;
    addToCartBtn.classList.add("enabled");
    addToCartBtn.innerHTML= '<div>Add 3 Items to Cart</div> <div><i class="fa-solid fa-arrow-right"></i></div>';
  } else {
    addToCartBtn.disabled = true;
    addToCartBtn.classList.remove("enabled");
    addToCartBtn.innerHTML= '<div>Add 3 Items to Proceed</div> <div><i class="fa-solid fa-arrow-right"></i></div>';
  }
}

// Handle toggle click (add/remove product)
function toggleProduct(id, toggleElement) {
  const product = products.find((p) => p.id === id);
  if (!product) return;

  const index = selectedProducts.findIndex((p) => p.id === id);
  const icon = toggleElement.querySelector(".product-select-icon");
  const product_text = toggleElement.querySelector(".product-select-text");

  if (index === -1) {
    // Add product with quantity 1
    if (selectedProducts.length < MAX_BUNDLE_ITEMS) {
    selectedProducts.push({ ...product, quantity: 1 });
    toggleElement.classList.add("active");
    icon.innerHTML = '<i class="fa-solid fa-check"></i>';
    product_text.innerText = "added to bundle";
    } else {
      alert(`You can only add up to ${MAX_BUNDLE_ITEMS} products.`);
    }
  } else {
    // Remove product
    selectedProducts.splice(index, 1);
    toggleElement.classList.remove("active");
    icon.innerText = "+";
    product_text.innerText = "add to bundle";
  }

  updateSidebar();
}

// Setup event listeners
function setupListeners() {
  // Toggle product add/remove
  productGrid.addEventListener("click", (e) => {
    const toggle = e.target.closest(".toggle-btn");
    if (!toggle) return;
    const productId = parseInt(toggle.dataset.id, 10);
    toggleProduct(productId, toggle);
  });

  // Quantity & delete handling
  selectedList.addEventListener("click", (e) => {
    const index = e.target.dataset.index || (e.target.closest("button") && e.target.closest("button").dataset.index);
    if (index === undefined) return;

    if (e.target.classList.contains("increase")) {
      selectedProducts[index].quantity++;
    } else if (e.target.classList.contains("decrease")) {
      selectedProducts[index].quantity = Math.max(1, selectedProducts[index].quantity - 1);
    } else if (e.target.classList.contains("delete-btn") || e.target.closest(".delete-btn")) {
  const removedProduct = selectedProducts[index];
  selectedProducts.splice(index, 1);

  // Find the toggle button in the main grid & reset it
  const toggleBtn = productGrid.querySelector(`.toggle-btn[data-id="${removedProduct.id}"]`);
  if (toggleBtn) {
    toggleBtn.classList.remove("active");
    toggleBtn.querySelector(".product-select-icon").innerText = "+";
    toggleBtn.querySelector(".product-select-text").innerText = "add to bundle";
  }
    }

    updateSidebar();
  });

  // Add to cart button
  addToCartBtn.addEventListener("click", () => {
    console.log("Selected bundle:", selectedProducts);
    addToCartBtn.innerHTML='<div>Added to Card</div> <div><i class="fa-solid fa-check"></i></div>'
  });
}

// Initialize app
function init() {
  renderProducts();
  setupListeners();
  updateSidebar();
}

init();


