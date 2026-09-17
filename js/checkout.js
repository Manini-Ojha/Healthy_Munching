/** Checkout page: order summary, empty-cart guard, form validation, submit + confirmation. */
(function () {
  "use strict";

  const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  // Accepts optional leading +, digits, spaces and dashes, 7-15 digits total.
  const PHONE_PATTERN = /^\+?[\d\s-]{7,15}$/;

  function renderOrderSummary(cart) {
    const itemsEl = document.querySelector("[data-order-summary-items]");
    const subtotalEl = document.querySelector("[data-order-subtotal]");
    if (!itemsEl || !subtotalEl) return;

    itemsEl.innerHTML = cart.items
      .map(
        (entry) => `
        <div class="order-summary__item">
          <span>${entry.product.name} × ${entry.quantity}</span>
          <span>₹${entry.lineTotal}</span>
        </div>
      `
      )
      .join("");
    subtotalEl.textContent = String(cart.subtotal);
  }

  function showEmptyCartGuard() {
    document.querySelector("[data-checkout-form-section]").hidden = true;
    document.querySelector("[data-empty-cart-guard]").hidden = false;
  }

  function setFieldError(fieldName, hasError) {
    const wrap = document.querySelector(`[data-field-wrap="${fieldName}"]`);
    if (wrap) wrap.setAttribute("data-invalid", hasError ? "true" : "false");
  }

  function validateForm(formData) {
    let isValid = true;

    const name = (formData.get("name") || "").toString().trim();
    if (!name) {
      setFieldError("name", true);
      isValid = false;
    } else {
      setFieldError("name", false);
    }

    const email = (formData.get("email") || "").toString().trim();
    if (!EMAIL_PATTERN.test(email)) {
      setFieldError("email", true);
      isValid = false;
    } else {
      setFieldError("email", false);
    }

    const phone = (formData.get("phone") || "").toString().trim();
    if (!PHONE_PATTERN.test(phone)) {
      setFieldError("phone", true);
      isValid = false;
    } else {
      setFieldError("phone", false);
    }

    const address = (formData.get("address") || "").toString().trim();
    if (!address) {
      setFieldError("address", true);
      isValid = false;
    } else {
      setFieldError("address", false);
    }

    return isValid;
  }

  function showConfirmation(customer, referenceNumber) {
    document.querySelector("[data-checkout-form-section]").hidden = true;
    const confirmationSection = document.querySelector("[data-confirmation-section]");
    confirmationSection.hidden = false;
    document.querySelector("[data-order-reference]").textContent = referenceNumber;
    document.querySelector("[data-confirm-name]").textContent = customer.name;
    document.querySelector("[data-confirm-email]").textContent = customer.email;
  }

  function wireSubmit() {
    const form = document.querySelector("[data-checkout-form]");
    if (!form) return;
    const submitBtn = document.querySelector("[data-submit-order]");

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const formData = new FormData(form);

      if (!validateForm(formData)) {
        return;
      }

      // Prevent double-submission (e.g., double-click).
      submitBtn.disabled = true;

      const customer = {
        name: (formData.get("name") || "").toString().trim(),
        email: (formData.get("email") || "").toString().trim(),
        phone: (formData.get("phone") || "").toString().trim(),
        address: (formData.get("address") || "").toString().trim()
      };

      try {
        const order = await window.WaffleNibbles.api.post("/api/orders", customer);
        showConfirmation(customer, order.referenceNumber);
        window.WaffleNibbles.nav.updateCartBadge();
      } catch (err) {
        submitBtn.disabled = false;
        window.alert(err.message || "Could not place order. Please try again.");
      }
    });
  }

  async function init() {
    const cart = await window.WaffleNibbles.cart.getCart();
    if (cart.items.length === 0) {
      showEmptyCartGuard();
      return;
    }
    renderOrderSummary(cart);
    wireSubmit();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
