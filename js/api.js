/**
 * Loads the product catalog from the API once per page load and exposes it
 * the same way the old static js/data/products.js did (window.WaffleNibbles.PRODUCTS),
 * so cart.js and every page script can keep reading it synchronously.
 * window.WaffleNibbles.ready resolves once PRODUCTS is populated - anything
 * that reads PRODUCTS on page load must await it first.
 */
(function () {
  "use strict";

  window.WaffleNibbles = window.WaffleNibbles || {};
  window.WaffleNibbles.PRODUCTS = [];

  window.WaffleNibbles.ready = fetch("/api/products")
    .then((res) => {
      if (!res.ok) throw new Error(`Failed to load products (${res.status})`);
      return res.json();
    })
    .then((products) => {
      window.WaffleNibbles.PRODUCTS = products;
    })
    .catch((err) => {
      console.error("Waffle Nibbles: failed to load product catalog.", err);
      window.WaffleNibbles.PRODUCTS = [];
    });
})();
