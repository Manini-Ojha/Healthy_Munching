/**
 * Cart module - the single source of truth for cart state.
 * Every page that reads or mutates the cart MUST go through these functions
 * (Constitution Principle I: no duplicated cart logic across pages).
 *
 * Persists server-side (SQLite via the /api/cart endpoints), keyed by the
 * session cookie so it works for guests and stays with the account once
 * they log in.
 */
(function () {
  "use strict";

  const api = () => window.WaffleNibbles.api;

  /** @returns {Promise<{items: {product: object, quantity: number, lineTotal: number}[], subtotal: number, itemCount: number}>} */
  function getCart() {
    return api().get("/api/cart");
  }

  function addItem(productId, quantity) {
    return api().post("/api/cart", { productId, quantity });
  }

  function updateQuantity(productId, quantity) {
    return api().put(`/api/cart/${encodeURIComponent(productId)}`, { quantity });
  }

  function removeItem(productId) {
    return api().del(`/api/cart/${encodeURIComponent(productId)}`);
  }

  function clearCart() {
    return api().del("/api/cart");
  }

  async function getSubtotal() {
    return (await getCart()).subtotal;
  }

  async function getItemCount() {
    return (await getCart()).itemCount;
  }

  window.WaffleNibbles = window.WaffleNibbles || {};
  window.WaffleNibbles.cart = {
    getCart,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    getSubtotal,
    getItemCount
  };
})();
