# Quickstart: Waffle Nibbles Storefront

Validation guide for confirming the feature works end-to-end once
implemented. No build step is required — this is a static site.

## Prerequisites

- Any modern browser (Chrome/Edge/Firefox/Safari).
- A local static file server (recommended over `file://` so relative
  fetches/paths behave like production). Any of the following work:
  - VS Code "Live Server" extension
  - `npx serve .` (Node, if available)
  - `python -m http.server 8080` (Python, if available)

## Run

From the repository root, start a static server and open `index.html`
(e.g., `http://localhost:8080/index.html`).

## Validation Scenarios

Each scenario maps to an acceptance scenario in [spec.md](./spec.md).

1. **Homepage → Catalog (User Story 1)**
   - Open `index.html`. Confirm the hero/value-proposition text and a row
     of featured products render with image, name, and price.
   - Click the nav's catalog/"Shop" link. Confirm `catalog.html` loads with
     a full grid of products, each showing image, name, price, and short
     description.

2. **Catalog → Product Detail → Add to Cart (User Story 2)**
   - From the catalog, click a product card. Confirm `product.html` loads
     with that product's full description, ingredients, allergens, and
     nutrition info.
   - Use the quantity selector: confirm it cannot go below 1.
   - Set quantity to 2 and click "Add to Cart". Confirm the nav's cart
     badge/count updates to reflect the new item(s).

3. **Cart Management (User Story 3)**
   - Open `cart.html`. Confirm the item added above appears with correct
     unit price, quantity (2), and line total (price × 2), plus a correct
     subtotal.
   - Change the quantity in the cart; confirm the line total and subtotal
     recalculate immediately.
   - Remove the item; confirm the cart shows the "cart is empty" state
     with a link back to the catalog.
   - Reload the page after re-adding an item; confirm the cart still shows
     that item (persistence).
   - Optional: in a private/incognito window with storage blocked,
     repeat add/update/remove and confirm no crash occurs (in-session
     fallback).

4. **Checkout (User Story 4)**
   - With an item in the cart, navigate to `checkout.html`. Confirm the
     order summary matches the cart, and a form asks for name, email,
     phone, and address.
   - Submit with an empty required field, then with an invalid email and
     an invalid phone number. Confirm inline error messages appear next to
     each offending field and the form does not submit.
   - Fill all fields validly and submit. Confirm an order confirmation
     appears (summary of items + a reference), and that revisiting
     `cart.html` afterward shows an empty cart.
   - Empty the cart, then navigate directly to `checkout.html`. Confirm the
     user is redirected/prompted back to the catalog instead of seeing a
     submittable checkout form.

5. **Responsive & Quality Gates (Constitution Principles II-IV)**
   - Resize/emulate mobile (~375px), tablet (~768px), and desktop
     (~1440px) widths on every page. Confirm no horizontal scrolling and
     no overlapping content.
   - Open the browser devtools console on every page; confirm zero errors
     or warnings.
   - Tab through each page using only the keyboard; confirm all
     interactive elements (nav links, quantity buttons, add-to-cart,
     cart update/remove, checkout fields/submit) are reachable and show a
     visible focus state.
   - Confirm images below the fold use `loading="lazy"` and that no
     render-blocking third-party script is present.

**Expected outcome**: All scenarios above pass without manual workarounds,
satisfying spec.md's Success Criteria SC-001 through SC-006.
