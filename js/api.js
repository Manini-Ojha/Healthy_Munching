/** Thin fetch wrapper for the backend API — always sends/receives the session cookie. */
(function () {
  "use strict";

  async function request(method, url, body) {
    const res = await fetch(url, {
      method,
      credentials: "include",
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      const message = (data && data.error) || `Request failed (${res.status})`;
      const err = new Error(message);
      if (data && data.field) err.field = data.field;
      throw err;
    }
    return data;
  }

  window.WaffleNibbles = window.WaffleNibbles || {};
  window.WaffleNibbles.api = {
    get: (url) => request("GET", url),
    post: (url, body) => request("POST", url, body || {}),
    put: (url, body) => request("PUT", url, body || {}),
    del: (url) => request("DELETE", url)
  };
})();
