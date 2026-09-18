/**
 * Shared header/nav behavior: cart badge count + active-link highlighting.
 * Called once from every page via WaffleNibbles.nav.init().
 */
(function () {
  "use strict";

  function updateCartBadge() {
    const badge = document.querySelector("[data-cart-count]");
    if (!badge) return;
    const count = window.WaffleNibbles.cart.getItemCount();
    badge.textContent = String(count);
    badge.hidden = count === 0;
  }

  function highlightActiveLink() {
    const currentPage = (window.location.pathname.split("/").pop() || "index.html").toLowerCase();
    document.querySelectorAll("[data-nav-link]").forEach((link) => {
      const href = (link.getAttribute("href") || "").toLowerCase();
      const isActive = href === currentPage || (currentPage === "" && href === "index.html");
      link.classList.toggle("is-active", isActive);
      if (isActive) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  function initMobileNavToggle() {
    const toggle = document.querySelector("[data-nav-toggle]");
    const menu = document.querySelector("[data-nav-menu]");
    if (!toggle || !menu) return;
    toggle.addEventListener("click", () => {
      const isOpen = menu.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });
  }

  async function init() {
    highlightActiveLink();
    initMobileNavToggle();
    await window.WaffleNibbles.ready;
    updateCartBadge();
  }

  window.WaffleNibbles = window.WaffleNibbles || {};
  window.WaffleNibbles.nav = { init, updateCartBadge };

  document.addEventListener("DOMContentLoaded", init);
})();
