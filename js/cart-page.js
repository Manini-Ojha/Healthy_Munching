/** Cart page: render line items, wire quantity updates and removal, empty-cart state. */
(function () {
  "use strict";

  function cartItemHTML(entry) {
    const { product, quantity, lineTotal } = entry;
    return `
      <div class="cart-item" data-cart-item-row data-product-id="${product.id}">
        <div class="cart-item__image">
          <img src="${product.image}" alt="${product.name}" loading="lazy" width="80" height="80" />
        </div>
        <div class="cart-item__info">
          <div class="cart-item__name">${product.name}</div>
          <div class="cart-item__unit-price">₹${product.price} each</div>
        </div>
        <div class="cart-item__controls">
          <div class="qty-stepper" role="group" aria-label="Quantity for ${product.name}">
            <button type="button" class="btn-icon" data-qty-decrease aria-label="Decrease quantity">−</button>
            <span class="qty-stepper__value" data-qty-value>${quantity}</span>
            <button type="button" class="btn-icon" data-qty-increase aria-label="Increase quantity">+</button>
          </div>
        </div>
        <div class="cart-item__line-total">₹${lineTotal}</div>
        <button type="button" class="btn-icon" data-remove-item aria-label="Remove ${product.name} from cart">✕</button>
      </div>
    `;
  }

  async function render() {
    await window.WaffleNibbles.ready;
    const cart = window.WaffleNibbles.cart.getCart();
    const hasItemsSection = document.querySelector("[data-cart-has-items]");
    const emptySection = document.querySelector("[data-cart-empty]");
    const itemsContainer = document.querySelector("[data-cart-items]");

    if (cart.items.length === 0) {
      if (hasItemsSection) hasItemsSection.hidden = true;
      if (emptySection) emptySection.hidden = false;
      return;
    }

    if (hasItemsSection) hasItemsSection.hidden = false;
    if (emptySection) emptySection.hidden = true;

    itemsContainer.innerHTML = cart.items.map(cartItemHTML).join("");
    document.querySelector("[data-cart-item-count]").textContent = String(cart.itemCount);
    document.querySelector("[data-cart-subtotal]").textContent = String(cart.subtotal);

    wireRowControls();
  }

  function wireRowControls() {
    document.querySelectorAll("[data-cart-item-row]").forEach((row) => {
      const productId = row.getAttribute("data-product-id");
      const cart = window.WaffleNibbles.cart.getCart();
      const entry = cart.items.find((i) => i.product.id === productId);
      if (!entry) return;

      const decreaseBtn = row.querySelector("[data-qty-decrease]");
      const increaseBtn = row.querySelector("[data-qty-increase]");
      const removeBtn = row.querySelector("[data-remove-item]");

      decreaseBtn.addEventListener("click", () => {
        window.WaffleNibbles.cart.updateQuantity(productId, entry.quantity - 1);
        afterChange();
      });
      increaseBtn.addEventListener("click", () => {
        window.WaffleNibbles.cart.updateQuantity(productId, entry.quantity + 1);
        afterChange();
      });
      removeBtn.addEventListener("click", () => {
        window.WaffleNibbles.cart.removeItem(productId);
        afterChange();
      });
    });
  }

  function afterChange() {
    render();
    window.WaffleNibbles.nav.updateCartBadge();
  }

  document.addEventListener("DOMContentLoaded", render);
})();
