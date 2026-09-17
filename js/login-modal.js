/** Landing page: login popup shown to logged-out visitors, dismissible via X, backdrop click, or Escape. */
(function () {
  "use strict";

  const DISMISSED_KEY = "wn_login_modal_dismissed";

  function showError(message, field) {
    const el = document.querySelector("[data-login-modal] [data-form-error]");
    if (el) {
      el.textContent = message;
      el.hidden = !message;
    }
    document.querySelectorAll("[data-login-modal] [data-field-wrap]").forEach((wrap) => {
      wrap.setAttribute("data-invalid", field && wrap.getAttribute("data-field-wrap") === field ? "true" : "false");
    });
  }

  function closeModal() {
    const overlay = document.querySelector("[data-login-modal-overlay]");
    if (overlay) overlay.hidden = true;
    try {
      sessionStorage.setItem(DISMISSED_KEY, "1");
    } catch (err) {
      // sessionStorage unavailable (private mode, etc.) — just skip remembering the dismissal.
    }
  }

  function wireClose() {
    const overlay = document.querySelector("[data-login-modal-overlay]");
    const closeBtn = document.querySelector("[data-login-modal-close]");
    if (!overlay || !closeBtn) return;

    closeBtn.addEventListener("click", closeModal);
    overlay.addEventListener("click", (event) => {
      if (event.target === overlay) closeModal();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !overlay.hidden) closeModal();
    });
  }

  function wireForm() {
    const form = document.querySelector("[data-login-modal-form]");
    if (!form) return;
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      showError("");
      const formData = new FormData(form);
      const submitBtn = document.querySelector("[data-login-modal-form] [data-submit-login]");
      submitBtn.disabled = true;
      try {
        await window.WaffleNibbles.api.post("/api/auth/login", {
          email: (formData.get("email") || "").toString().trim(),
          password: (formData.get("password") || "").toString()
        });
        closeModal();
        window.location.reload();
      } catch (err) {
        showError(err.message || "Login failed.", err.field);
        submitBtn.disabled = false;
      }
    });
  }

  async function maybeShow() {
    const overlay = document.querySelector("[data-login-modal-overlay]");
    if (!overlay) return;

    let dismissed = false;
    try {
      dismissed = sessionStorage.getItem(DISMISSED_KEY) === "1";
    } catch (err) {
      // sessionStorage unavailable — fall back to always allowing the modal to show.
    }
    if (dismissed) return;

    try {
      const { user } = await window.WaffleNibbles.api.get("/api/auth/me");
      if (!user) overlay.hidden = false;
    } catch (err) {
      console.warn("Waffle Nibbles: could not check login state for the login popup.", err);
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    wireClose();
    wireForm();
    maybeShow();
  });
})();
