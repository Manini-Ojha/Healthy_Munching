/** Catalog page: render the full product grid, with a client-side keyword search. */
(function () {
  "use strict";

  let allProducts = [];

  function productCardHTML(product) {
    return `
      <div class="product-card" data-catalog-card data-product-id="${product.id}">
        <a href="product.html?id=${encodeURIComponent(product.id)}" class="product-card__image-wrap">
          <img src="${product.image}" alt="${product.name}" loading="lazy" width="400" height="300" />
        </a>
        <div class="product-card__body">
          <span class="product-card__category">${product.category}</span>
          <a href="product.html?id=${encodeURIComponent(product.id)}"><h3 class="product-card__name">${product.name}</h3></a>
          <p class="product-card__desc">${product.shortDescription}</p>
          <div class="product-card__footer">
            <span class="product-card__price">₹${product.price}</span>
            <button type="button" class="product-card__add-btn" data-catalog-add>Add to Cart</button>
          </div>
        </div>
      </div>
    `;
  }

  function wireAddToCartButtons() {
    document.querySelectorAll("[data-catalog-add]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const card = btn.closest("[data-catalog-card]");
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

  function matches(product, query) {
    const haystack = [
      product.name,
      product.shortDescription,
      product.fullDescription,
      product.category,
      ...(product.ingredients || []),
      ...(product.allergens || [])
    ]
      .join(" ")
      .toLowerCase();
    return query
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean)
      .every((term) => haystack.includes(term));
  }

  function renderGrid(products) {
    const grid = document.querySelector("[data-catalog-grid]");
    const noResults = document.querySelector("[data-catalog-no-results]");
    if (!grid) return;

    if (products.length === 0) {
      grid.innerHTML = "";
      if (noResults) noResults.hidden = false;
      return;
    }
    if (noResults) noResults.hidden = true;
    grid.innerHTML = products.map(productCardHTML).join("");
    wireAddToCartButtons();
  }

  function wireSearch() {
    const input = document.querySelector("[data-catalog-search]");
    if (!input) return;
    input.addEventListener("input", () => {
      const query = input.value.trim();
      const filtered = query ? allProducts.filter((p) => matches(p, query)) : allProducts;
      renderGrid(filtered);
    });
  }

  async function render() {
    const grid = document.querySelector("[data-catalog-grid]");
    if (!grid) return;
    allProducts = await window.WaffleNibbles.api.get("/api/products");
    renderGrid(allProducts);
    wireSearch();
  }

  document.addEventListener("DOMContentLoaded", render);
})();
