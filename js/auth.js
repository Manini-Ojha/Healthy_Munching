/** Login + signup pages: submit credentials to the API, show errors, redirect on success. */
(function () {
  "use strict";

  function showError(message, field) {
    const el = document.querySelector("[data-form-error]");
    if (el) {
      el.textContent = message;
      el.hidden = !message;
    }
    document.querySelectorAll("[data-field-wrap]").forEach((wrap) => {
      wrap.setAttribute("data-invalid", field && wrap.getAttribute("data-field-wrap") === field ? "true" : "false");
    });
  }

  function wireLogin() {
    const form = document.querySelector("[data-login-form]");
    if (!form) return;
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      showError("");
      const formData = new FormData(form);
      const submitBtn = document.querySelector("[data-submit-login]");
      submitBtn.disabled = true;
      try {
        await window.WaffleNibbles.api.post("/api/auth/login", {
          email: (formData.get("email") || "").toString().trim(),
          password: (formData.get("password") || "").toString()
        });
        window.location.href = "index.html";
      } catch (err) {
        showError(err.message || "Login failed.", err.field);
        submitBtn.disabled = false;
      }
    });
  }

  function wireSignup() {
    const form = document.querySelector("[data-signup-form]");
    if (!form) return;
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      showError("");
      const formData = new FormData(form);
      const submitBtn = document.querySelector("[data-submit-signup]");
      submitBtn.disabled = true;
      try {
        await window.WaffleNibbles.api.post("/api/auth/register", {
          name: (formData.get("name") || "").toString().trim(),
          email: (formData.get("email") || "").toString().trim(),
          password: (formData.get("password") || "").toString()
        });
        window.location.href = "index.html";
      } catch (err) {
        showError(err.message || "Sign up failed.", err.field);
        submitBtn.disabled = false;
      }
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    wireLogin();
    wireSignup();
  });
})();
