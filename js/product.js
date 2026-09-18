/** Product detail page: render product info, quantity selector, add-to-cart. */
(function () {
  "use strict";

  let quantity = 1;

  function getProductIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get("id");
  }

  function renderTagList(container, values) {
    container.innerHTML = (values || []).map((v) => `<li>${v}</li>`).join("");
  }

  function renderProduct(product) {
    document.title = `${product.name} — Waffle Nibbles by Healthy Munching`;
    const titleTag = document.querySelector("[data-page-title]");
    if (titleTag) titleTag.textContent = `${product.name} — Waffle Nibbles by Healthy Munching`;

    const img = document.querySelector('[data-field="image"]');
    img.src = product.image;
    img.alt = product.name;

    document.querySelector('[data-field="category"]').textContent = product.category;
    document.querySelector('[data-field="name"]').textContent = product.name;
    document.querySelector('[data-field="fullDescription"]').textContent = product.fullDescription;
    document.querySelector('[data-field="price"]').textContent = product.price;

    renderTagList(document.querySelector('[data-field="ingredients"]'), product.ingredients);
    renderTagList(document.querySelector('[data-field="allergens"]'), product.allergens.length ? product.allergens : ["None declared"]);

    document.querySelector('[data-field="calories"]').textContent = `${product.nutrition.calories} kcal`;
    document.querySelector('[data-field="protein"]').textContent = product.nutrition.protein;
    document.querySelector('[data-field="carbs"]').textContent = product.nutrition.carbs;
    document.querySelector('[data-field="fat"]').textContent = product.nutrition.fat;
    document.querySelector('[data-field="fiber"]').textContent = product.nutrition.fiber;
  }

  function updateQtyDisplay() {
    const valueEl = document.querySelector("[data-qty-value]");
    if (valueEl) valueEl.textContent = String(quantity);
    const decreaseBtn = document.querySelector("[data-qty-decrease]");
    if (decreaseBtn) decreaseBtn.disabled = quantity <= 1;
  }

  function wireQuantityControls() {
    const decreaseBtn = document.querySelector("[data-qty-decrease]");
    const increaseBtn = document.querySelector("[data-qty-increase]");
    if (decreaseBtn) {
      decreaseBtn.addEventListener("click", () => {
        quantity = Math.max(1, quantity - 1);
        updateQtyDisplay();
      });
    }
    if (increaseBtn) {
      increaseBtn.addEventListener("click", () => {
        quantity = quantity + 1;
        updateQtyDisplay();
      });
    }
  }

  function wireAddToCart(product) {
    const addBtn = document.querySelector("[data-add-to-cart]");
    const confirm = document.querySelector("[data-add-confirm]");
    if (!addBtn) return;
    addBtn.addEventListener("click", () => {
      window.WaffleNibbles.cart.addItem(product.id, quantity);
      window.WaffleNibbles.nav.updateCartBadge();
      if (confirm) {
        confirm.hidden = false;
        window.clearTimeout(wireAddToCart._t);
        wireAddToCart._t = window.setTimeout(() => {
          confirm.hidden = true;
        }, 2500);
      }
      quantity = 1;
      updateQtyDisplay();
    });
  }

  async function init() {
    await window.WaffleNibbles.ready;
    const products = (window.WaffleNibbles && window.WaffleNibbles.PRODUCTS) || [];
    const id = getProductIdFromUrl();
    const product = products.find((p) => p.id === id);

    const foundEl = document.querySelector("[data-product-found]");
    const notFoundEl = document.querySelector("[data-product-not-found]");

    if (!product) {
      if (foundEl) foundEl.hidden = true;
      if (notFoundEl) notFoundEl.hidden = false;
      return;
    }

    renderProduct(product);
    updateQtyDisplay();
    wireQuantityControls();
    wireAddToCart(product);
  }

  document.addEventListener("DOMContentLoaded", init);
})();
