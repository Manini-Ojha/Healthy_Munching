/** Catalog page: render the full product grid. */
(function () {
  "use strict";

  function productCardHTML(product) {
    return `
      <a class="product-card" href="product.html?id=${encodeURIComponent(product.id)}">
        <div class="product-card__image-wrap">
          <img src="${product.image}" alt="${product.name}" loading="lazy" width="400" height="300" />
        </div>
        <div class="product-card__body">
          <span class="product-card__category">${product.category}</span>
          <h3 class="product-card__name">${product.name}</h3>
          <p class="product-card__desc">${product.shortDescription}</p>
          <span class="product-card__price">₹${product.price}</span>
        </div>
      </a>
    `;
  }

  function render() {
    const grid = document.querySelector("[data-catalog-grid]");
    if (!grid) return;
    const products = (window.WaffleNibbles && window.WaffleNibbles.PRODUCTS) || [];
    grid.innerHTML = products.map(productCardHTML).join("");
  }

  document.addEventListener("DOMContentLoaded", render);
})();
