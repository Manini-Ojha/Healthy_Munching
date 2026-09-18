/**
 * Cart module - the single source of truth for cart state.
 * Every page that reads or mutates the cart MUST go through these functions
 * (Constitution Principle I: no duplicated cart logic across pages).
 *
 * Persists to localStorage under STORAGE_KEY. If localStorage is unavailable
 * (private browsing, storage disabled, etc.) it falls back to an in-memory
 * array for the lifetime of the current page load, per research.md
 * "localStorage unavailability handled via in-memory fallback".
 */
(function () {
  "use strict";

  const STORAGE_KEY = "waffle-nibbles-cart";

  /** In-memory fallback store, used only if localStorage throws. */
  let memoryStore = [];
  let storageAvailable = true;

  function readRaw() {
    if (!storageAvailable) {
      return memoryStore;
    }
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (err) {
      console.warn("Waffle Nibbles: localStorage unavailable, using in-memory cart for this session.", err);
      storageAvailable = false;
      return memoryStore;
    }
  }

  function writeRaw(items) {
    if (!storageAvailable) {
      memoryStore = items;
      return;
    }
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (err) {
      console.warn("Waffle Nibbles: localStorage write failed, using in-memory cart for this session.", err);
      storageAvailable = false;
      memoryStore = items;
    }
  }

  function findProduct(productId) {
    const products = (window.WaffleNibbles && window.WaffleNibbles.PRODUCTS) || [];
    return products.find((p) => p.id === productId) || null;
  }

  /** @returns {{productId: string, quantity: number}[]} raw persisted cart items */
  function getRawItems() {
    return readRaw();
  }

  /**
   * @returns {{items: {product: object, quantity: number, lineTotal: number}[], subtotal: number, itemCount: number}}
   */
  function getCart() {
    const raw = readRaw();
    const items = [];
    let subtotal = 0;
    let itemCount = 0;

    raw.forEach((entry) => {
      const product = findProduct(entry.productId);
      if (!product) {
        return; // Skip cart entries whose product no longer exists in the catalog.
      }
      const lineTotal = product.price * entry.quantity;
      items.push({ product, quantity: entry.quantity, lineTotal });
      subtotal += lineTotal;
      itemCount += entry.quantity;
    });

    return { items, subtotal, itemCount };
  }

  function addItem(productId, quantity) {
    const qty = Math.max(1, Math.floor(Number(quantity) || 1));
    const raw = readRaw();
    const existing = raw.find((entry) => entry.productId === productId);
    if (existing) {
      existing.quantity += qty;
    } else {
      raw.push({ productId, quantity: qty });
    }
    writeRaw(raw);
  }

  function updateQuantity(productId, quantity) {
    const qty = Math.floor(Number(quantity) || 0);
    let raw = readRaw();
    if (qty < 1) {
      raw = raw.filter((entry) => entry.productId !== productId);
    } else {
      const existing = raw.find((entry) => entry.productId === productId);
      if (existing) {
        existing.quantity = qty;
      }
    }
    writeRaw(raw);
  }

  function removeItem(productId) {
    const raw = readRaw().filter((entry) => entry.productId !== productId);
    writeRaw(raw);
  }

  function clearCart() {
    writeRaw([]);
  }

  function getSubtotal() {
    return getCart().subtotal;
  }

  function getItemCount() {
    return getCart().itemCount;
  }

  window.WaffleNibbles = window.WaffleNibbles || {};
  window.WaffleNibbles.cart = {
    getCart,
    getRawItems,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    getSubtotal,
    getItemCount
  };
})();
