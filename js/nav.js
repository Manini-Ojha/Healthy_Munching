/**
 * Shared header/nav behavior: cart badge count, login state + active-link highlighting.
 * Called once from every page via WaffleNibbles.nav.init().
 */
(function () {
  "use strict";

  async function updateCartBadge() {
    const badge = document.querySelector("[data-cart-count]");
    if (!badge) return;
    const count = await window.WaffleNibbles.cart.getItemCount();
    badge.textContent = String(count);
    badge.hidden = count === 0;
  }

  async function updateAccountLink() {
    const el = document.querySelector("[data-account-link]");
    if (!el) return;
    try {
      const { user } = await window.WaffleNibbles.api.get("/api/auth/me");
      if (user) {
        el.textContent = `Hi, ${user.name.split(" ")[0]} · Logout`;
        el.setAttribute("href", "#");
        el.onclick = async (e) => {
          e.preventDefault();
          await window.WaffleNibbles.api.post("/api/auth/logout");
          window.location.href = "index.html";
        };
      } else {
        el.textContent = "Login";
        el.setAttribute("href", "login.html");
        el.onclick = null;
      }
    } catch (err) {
      console.warn("Waffle Nibbles: could not load account state.", err);
    }
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

  function init() {
    updateCartBadge();
    updateAccountLink();
    highlightActiveLink();
    initMobileNavToggle();
  }

  window.WaffleNibbles = window.WaffleNibbles || {};
  window.WaffleNibbles.nav = { init, updateCartBadge, updateAccountLink };

  document.addEventListener("DOMContentLoaded", init);
})();
