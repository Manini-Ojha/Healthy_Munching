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
    addBtn.addEventListener("click", async () => {
      await window.WaffleNibbles.cart.addItem(product.id, quantity);
      await window.WaffleNibbles.nav.updateCartBadge();
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

  function starString(rating) {
    return "★★★★★".slice(0, rating) + "☆☆☆☆☆".slice(rating);
  }

  function reviewCardHTML(review) {
    const date = new Date(review.createdAt).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
    return `
      <div class="review-card">
        <div class="review-card__meta">
          <span class="review-card__author">${review.authorName}</span>
          <span class="review-card__date">${date}</span>
        </div>
        <div class="review-card__stars" aria-label="${review.rating} out of 5 stars">${starString(review.rating)}</div>
        <p>${review.comment}</p>
      </div>
    `;
  }

  async function renderReviews(productId) {
    const section = document.querySelector("[data-reviews-section]");
    if (!section) return;
    section.hidden = false;

    const { reviews, count, average } = await window.WaffleNibbles.api.get(`/api/products/${encodeURIComponent(productId)}/reviews`);

    const summaryEl = document.querySelector("[data-reviews-summary]");
    const listEl = document.querySelector("[data-reviews-list]");
    const emptyEl = document.querySelector("[data-reviews-empty]");

    if (count > 0) {
      summaryEl.textContent = `${average} ★ average · ${count} review${count === 1 ? "" : "s"}`;
      summaryEl.hidden = false;
      listEl.hidden = false;
      emptyEl.hidden = true;
      listEl.innerHTML = reviews.map(reviewCardHTML).join("");
    } else {
      summaryEl.hidden = true;
      listEl.hidden = true;
      emptyEl.hidden = false;
    }
  }

  function wireReviewForm(productId) {
    const form = document.querySelector("[data-review-form]");
    if (!form) return;

    const stars = Array.from(document.querySelectorAll("[data-star]"));
    const ratingInput = document.querySelector("[data-rating-value]");
    let currentRating = 0;

    function paintStars(rating) {
      stars.forEach((star) => {
        star.classList.toggle("is-active", Number(star.getAttribute("data-star")) <= rating);
      });
    }

    stars.forEach((star) => {
      star.addEventListener("click", () => {
        currentRating = Number(star.getAttribute("data-star"));
        ratingInput.value = String(currentRating);
        paintStars(currentRating);
      });
      star.addEventListener("mouseenter", () => paintStars(Number(star.getAttribute("data-star"))));
    });
    document.querySelector("[data-star-input]").addEventListener("mouseleave", () => paintStars(currentRating));

    function setFieldError(fieldName, hasError) {
      const wrap = document.querySelector(`[data-field-wrap="${fieldName}"]`);
      if (wrap) wrap.setAttribute("data-invalid", hasError ? "true" : "false");
    }

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const errorEl = document.querySelector("[data-review-form-error]");
      errorEl.hidden = true;
      ["authorName", "rating", "comment"].forEach((f) => setFieldError(f, false));

      const formData = new FormData(form);
      const submitBtn = document.querySelector("[data-submit-review]");
      submitBtn.disabled = true;

      try {
        await window.WaffleNibbles.api.post(`/api/products/${encodeURIComponent(productId)}/reviews`, {
          authorName: (formData.get("authorName") || "").toString().trim(),
          rating: Number(formData.get("rating")),
          comment: (formData.get("comment") || "").toString().trim()
        });
        form.reset();
        currentRating = 0;
        paintStars(0);
        await renderReviews(productId);
      } catch (err) {
        errorEl.textContent = err.message || "Could not submit review.";
        errorEl.hidden = false;
        if (err.field) setFieldError(err.field, true);
      } finally {
        submitBtn.disabled = false;
      }
    });
  }

  function suggestionCardHTML(product) {
    return `
      <div class="product-card" data-suggestion-card data-product-id="${product.id}">
        <a href="product.html?id=${encodeURIComponent(product.id)}" class="product-card__image-wrap">
          <img src="${product.image}" alt="${product.name}" loading="lazy" width="400" height="300" />
        </a>
        <div class="product-card__body">
          <span class="product-card__category">${product.category}</span>
          <a href="product.html?id=${encodeURIComponent(product.id)}"><h3 class="product-card__name">${product.name}</h3></a>
          <p class="product-card__desc">${product.shortDescription}</p>
          <div class="product-card__footer">
            <span class="product-card__price">₹${product.price}</span>
            <button type="button" class="product-card__add-btn" data-suggestion-add>Add to Cart</button>
          </div>
        </div>
      </div>
    `;
  }

  async function renderSuggestions(productId) {
    const section = document.querySelector("[data-suggestions-section]");
    const grid = document.querySelector("[data-suggestions-grid]");
    if (!section || !grid) return;

    const suggestions = await window.WaffleNibbles.api.get(`/api/products/${encodeURIComponent(productId)}/suggestions`);
    if (suggestions.length === 0) return;

    section.hidden = false;
    grid.innerHTML = suggestions.map(suggestionCardHTML).join("");

    grid.querySelectorAll("[data-suggestion-add]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const card = btn.closest("[data-suggestion-card]");
        const id = card.getAttribute("data-product-id");
        btn.disabled = true;
        const originalText = btn.textContent;
        await window.WaffleNibbles.cart.addItem(id, 1);
        await window.WaffleNibbles.nav.updateCartBadge();
        btn.textContent = "Added!";
        window.setTimeout(() => {
          btn.textContent = originalText;
          btn.disabled = false;
        }, 1500);
      });
    });
  }

  async function init() {
    const id = getProductIdFromUrl();
    const foundEl = document.querySelector("[data-product-found]");
    const notFoundEl = document.querySelector("[data-product-not-found]");

    let product = null;
    try {
      product = id ? await window.WaffleNibbles.api.get(`/api/products/${encodeURIComponent(id)}`) : null;
    } catch (err) {
      product = null;
    }

    if (!product) {
      if (foundEl) foundEl.hidden = true;
      if (notFoundEl) notFoundEl.hidden = false;
      return;
    }

    renderProduct(product);
    updateQtyDisplay();
    wireQuantityControls();
    wireAddToCart(product);
    renderReviews(product.id);
    wireReviewForm(product.id);
    renderSuggestions(product.id);
  }

  document.addEventListener("DOMContentLoaded", init);
})();
