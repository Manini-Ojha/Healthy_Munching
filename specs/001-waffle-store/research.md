# Phase 0 Research: Waffle Nibbles Storefront

No open `[NEEDS CLARIFICATION]` items remain from the Technical Context —
this feature's scope (static multi-page site, no backend, no payment) is
fully determined by the spec's Assumptions and the project constitution.
The decisions below record the "how" chosen for each technical area.

## Decision: Multi-page static HTML over a client-side router / SPA

- **Decision**: Five separate `.html` files (`index`, `catalog`, `product`,
  `cart`, `checkout`), linked normally, each loading shared CSS/JS plus one
  page-specific script.
- **Rationale**: Matches Constitution Principle V (simplicity, no
  framework/build step). Real URLs per page work with browser
  back/forward, are trivially hostable on any static host, and need no
  routing library.
- **Alternatives considered**: Single-page app with a hash/history-based
  router — rejected as unnecessary complexity and an extra dependency for
  a 5-page site with no shared-state-heavy transitions.

## Decision: Product data as a static JS module, not fetched JSON

- **Decision**: `js/data/products.js` exports a plain array of product
  objects, loaded via a regular `<script>` tag (or ES module import) —
  no `fetch()` call to a JSON file or API.
- **Rationale**: Avoids CORS/file:// fetch issues when opening pages
  directly from disk during development, avoids any async loading-state UI
  for what is static, build-time-known content, and keeps the "no backend"
  guarantee obvious (nothing is fetched over the network for data).
- **Alternatives considered**: `products.json` + `fetch()` — rejected: adds
  an async load state to every page for no real benefit at this scale, and
  breaks when opened via `file://` without a local server.

## Decision: Cart state in `localStorage`, keyed and versioned simply

- **Decision**: A single `localStorage` key (`waffle-nibbles-cart`) stores a
  JSON-serialized array of `{ productId, quantity }`. All reads/writes go
  through `js/cart.js` functions (`getCart`, `addItem`, `updateQuantity`,
  `removeItem`, `clearCart`, `getSubtotal`), which resolve `productId`
  against `products.js` at render time (so price/name changes in the data
  file are always reflected, and the cart itself stores no duplicated
  product info).
- **Rationale**: Satisfies FR-009 (persistence across reloads/sessions)
  with the simplest browser-native mechanism; centralizing all access in
  one module prevents the "duplicated cart logic per page" trap the
  constitution's Principle I warns against.
- **Alternatives considered**: `sessionStorage` — rejected, does not
  survive closing the tab, failing the spec's persistence requirement.
  Cookies — rejected, unnecessary size/complexity for structured cart data.

## Decision: `localStorage` unavailability handled via in-memory fallback

- **Decision**: `js/cart.js` wraps every `localStorage` read/write in
  try/catch; on failure it falls back to an in-memory JS array for the rest
  of that page load, so add/update/remove/checkout still work within the
  current session (per spec Edge Cases), just without persistence.
- **Rationale**: Directly satisfies the spec's edge case for private
  browsing / storage-disabled environments without crashing the site.
- **Alternatives considered**: Showing a hard error/blocking the cart —
  rejected as it would fail FR-005/FR-006 (add to cart, view cart) in a
  supported browsing mode.

## Decision: Checkout "submission" is a client-side-only confirmation

- **Decision**: On valid submit, `checkout.js` renders an on-page order
  confirmation (order summary + a generated reference number) and calls
  `clearCart()`. No network request is made (no backend exists to receive
  it), matching FR-012/FR-013.
- **Rationale**: Matches the explicit "no live payment processing" / "no
  backend" scope from the spec and constitution.
- **Alternatives considered**: `mailto:` link or third-party form
  endpoint (e.g., Formspree) — noted as a natural future extension but
  deliberately out of scope for this feature to avoid an unreviewed
  external dependency.

## Decision: Design tokens via CSS custom properties, no CSS framework

- **Decision**: `css/tokens.css` defines colors, type scale, spacing,
  radii, and shadows as `:root` custom properties; `components.css` and
  `layout.css` consume only tokens, never hard-coded values.
- **Rationale**: Satisfies Constitution Principles I and III (single source
  of truth for styling, consistent look across pages) without pulling in a
  CSS framework/build step.
- **Alternatives considered**: Tailwind or Bootstrap — rejected per
  Principle V (minimal dependencies) and because a small, brand-specific
  token set is easy to hand-maintain at this scope.

**Output**: All Technical Context items resolved — no remaining
`NEEDS CLARIFICATION` markers. Ready for Phase 1 design.
