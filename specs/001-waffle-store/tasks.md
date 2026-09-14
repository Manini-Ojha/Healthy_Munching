---
description: "Task list template for feature implementation"
---

# Tasks: Waffle Nibbles Storefront

**Input**: Design documents from `/specs/001-waffle-store/`

**Prerequisites**: [plan.md](./plan.md) (required), [spec.md](./spec.md) (required for user stories), [research.md](./research.md), [data-model.md](./data-model.md), [quickstart.md](./quickstart.md)

**Tests**: Not explicitly requested in the feature specification — no automated test tasks are included. Per Constitution Principle II ("Test Before Ship"), manual cross-browser/responsive verification is covered instead in Phase 7 (Polish) via `quickstart.md`.

**Organization**: Tasks are grouped by user story (from spec.md) to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3, US4)
- File paths are relative to the repository root

## Path Conventions

Single static-site project at the repository root (per [plan.md](./plan.md) Project Structure — no `src/`, no backend):

```text
index.html, catalog.html, product.html, cart.html, checkout.html
css/tokens.css, css/base.css, css/layout.css, css/components.css
js/data/products.js, js/cart.js, js/nav.js, js/home.js, js/catalog.js, js/product.js, js/cart-page.js, js/checkout.js
assets/images/products/
```

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Create the repository folder structure: `css/`, `js/`, `js/data/`, `assets/images/products/` at the repository root, per [plan.md](./plan.md) Project Structure
- [X] T002 [P] Create `css/tokens.css` with design-token custom properties (color palette, type scale, spacing scale, radii, shadows) on `:root`, per [research.md](./research.md) "Design tokens" decision
- [X] T003 [P] Create `css/base.css` with a CSS reset and base typography/element styles that consume only `tokens.css` variables

**Checkpoint**: Folder structure and shared style foundation exist.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core data, cart logic, shared nav, and shared layout/component styles that every page depends on

**⚠️ CRITICAL**: No user story page can be completed until this phase is done — every page loads `products.js`, `cart.js`, `nav.js`, and the shared CSS files

- [X] T004 Create `js/data/products.js` exporting an array of 8-12 Product objects (`id`, `name`, `price`, `image`, `shortDescription`, `fullDescription`, `ingredients`, `allergens`, `nutrition`, `category`, `featured`) per the Product schema in [data-model.md](./data-model.md)
- [X] T005 [P] Implement `js/cart.js`: `getCart()`, `addItem(productId, quantity)`, `updateQuantity(productId, quantity)`, `removeItem(productId)`, `clearCart()`, `getSubtotal()`, `getItemCount()` — reading/writing the `waffle-nibbles-cart` `localStorage` key with a try/catch in-memory fallback, per [data-model.md](./data-model.md) Cart Item / Cart and [research.md](./research.md) "Cart state" and "localStorage unavailability" decisions
- [X] T006 [P] Implement `js/nav.js`: renders/updates the shared header navigation's cart badge (item count from `js/cart.js`) and highlights the active page link; exposes an init function callable from every page
- [X] T007 [P] Create `css/layout.css`: header/nav/footer layout, page containers, responsive grid/breakpoints (mobile ~375px, tablet ~768px, desktop ~1440px) consuming `tokens.css`
- [X] T008 [P] Create `css/components.css`: shared product card, primary/secondary buttons, quantity stepper, cart line item row, and form field/error styles, all consuming `tokens.css` (no page-specific one-off styles)
- [X] T009 Draft the shared header (logo, nav links to Home/Shop/Cart with badge) and footer (brand blurb, links) markup once, to be copy-consistent across all 5 HTML pages created in later phases

**Checkpoint**: Foundation ready — product data, cart logic, shared nav behavior, and shared CSS all exist; user story pages can now be built.

---

## Phase 3: User Story 1 - Browse Products and Discover the Brand (Priority: P1) 🎯 MVP

**Goal**: A visitor can load the homepage, understand the brand's value proposition, see featured products, and browse the full catalog grid.

**Independent Test**: Open `index.html`, confirm hero + featured products render; click through to `catalog.html` and confirm the full product grid renders with image/name/price/short description per product, each linking to a detail page.

### Implementation for User Story 1

- [X] T010 [P] [US1] Create `index.html` with the shared header/nav/footer (from T009), a hero section (value proposition), and an empty featured-products container; link `tokens.css`, `base.css`, `layout.css`, `components.css`, and load `nav.js` + `cart.js` + `home.js`
- [X] T011 [P] [US1] Create `catalog.html` with the shared header/nav/footer, page heading, and an empty product-grid container; link the same shared CSS and load `nav.js` + `cart.js` + `catalog.js`
- [X] T012 [US1] Implement `js/home.js`: read `featured: true` products from `js/data/products.js` and render each as a product card (image, name, price, short description, link to `product.html?id=...`) into `index.html`'s featured container (depends on T004, T006, T010)
- [X] T013 [US1] Implement `js/catalog.js`: render all products from `js/data/products.js` as product cards into `catalog.html`'s grid container, each linking to `product.html?id=...` (depends on T004, T006, T011)
- [X] T014 [US1] Style the hero section, featured-products row, and catalog product grid in `css/components.css`/`css/layout.css`, confirming responsive wrapping at all three breakpoints

**Checkpoint**: User Story 1 is fully functional and independently testable — homepage and catalog browse flow work end-to-end.

---

## Phase 4: User Story 2 - View Product Details and Add to Cart (Priority: P1)

**Goal**: A shopper can open a product's detail page, see full description/ingredients/allergens/nutrition, choose a quantity, and add it to the cart.

**Independent Test**: Navigate directly to `product.html?id=<a-real-product-id>`, confirm all product info renders, adjust the quantity selector (never below 1), click "Add to Cart", and confirm the nav's cart badge count increases.

### Implementation for User Story 2

- [X] T015 [US2] Create `product.html` with the shared header/nav/footer and placeholder sections for image, name, price, full description, ingredients/allergens, nutrition table, quantity selector, and "Add to Cart" button; link shared CSS and load `nav.js` + `cart.js` + `product.js`
- [X] T016 [US2] Implement `js/product.js`: parse the `id` query-string parameter, look up the product in `js/data/products.js`, and render its image/name/price/full description/ingredients/allergens/nutrition into `product.html`; render a "product not found" state with a link back to `catalog.html` when the id doesn't match any product (depends on T004, T015)
- [X] T017 [US2] Implement the quantity selector logic in `js/product.js` (increment/decrement buttons, direct input clamped to a minimum of 1)
- [X] T018 [US2] Implement the "Add to Cart" handler in `js/product.js`: call `cart.addItem(productId, quantity)`, refresh the nav cart badge via `js/nav.js`, and show a visible confirmation (e.g., inline message or button state change) (depends on T005, T006, T016, T017)
- [X] T019 [US2] Style the product detail layout (image/info split, nutrition table, quantity stepper, add-to-cart button, not-found state) in `css/components.css`, confirming responsive behavior

**Checkpoint**: User Stories 1 and 2 both work independently — browsing plus the core "view + add to cart" conversion flow are complete.

---

## Phase 5: User Story 3 - Manage Cart Contents (Priority: P2)

**Goal**: A shopper can view their cart, adjust quantities, remove items, see an accurate subtotal, and have their cart persist across reloads/sessions.

**Independent Test**: With items already in the cart (via US2 or seeded directly), open `cart.html`, change a quantity, remove an item, confirm the subtotal recalculates correctly each time, then reload the page and confirm the cart contents persist.

### Implementation for User Story 3

- [X] T020 [P] [US3] Create `cart.html` with the shared header/nav/footer, an empty cart-items container, a subtotal summary area, and an empty-cart message container (hidden by default); link shared CSS and load `nav.js` + `cart.js` + `cart-page.js`
- [X] T021 [US3] Implement `js/cart-page.js`: render each cart item (image, name, unit price, quantity, line total) resolved from `js/cart.js` + `js/data/products.js`, and render the subtotal; show the empty-cart state (with a link to `catalog.html`) when the cart has no items (depends on T005, T020)
- [X] T022 [US3] Implement quantity-update controls in `js/cart-page.js` wired to `cart.updateQuantity()`, re-rendering line totals/subtotal immediately after each change
- [X] T023 [US3] Implement the remove-item control in `js/cart-page.js` wired to `cart.removeItem()`, re-rendering the list (and empty-cart state if the cart becomes empty) after removal
- [X] T024 [US3] Style cart line items, quantity controls, subtotal summary, and empty-cart state in `css/components.css`, confirming responsive behavior on mobile widths

**Checkpoint**: User Stories 1-3 all work independently — browsing, add-to-cart, and full cart management are complete, with persistence verified via reload.

---

## Phase 6: User Story 4 - Complete Checkout (Priority: P2)

**Goal**: A shopper with items in their cart can fill out a validated customer-info form, review an order summary, submit, and see an order confirmation (no live payment).

**Independent Test**: With items in the cart, navigate to `checkout.html`, confirm the order summary matches the cart, submit with missing/invalid fields and confirm inline errors block submission, then submit valid data and confirm an order confirmation appears and the cart is cleared; also confirm an empty cart redirects/prompts back to the catalog instead of allowing checkout.

### Implementation for User Story 4

- [X] T025 [P] [US4] Create `checkout.html` with the shared header/nav/footer, a customer-info form (name, email, phone, address fields with associated error-message elements), an order-summary container, and an order-confirmation container (hidden by default); link shared CSS and load `nav.js` + `cart.js` + `checkout.js`
- [X] T026 [US4] Implement the order-summary rendering in `js/checkout.js`: display cart items and subtotal from `js/cart.js` + `js/data/products.js` into `checkout.html`'s summary container (depends on T005, T025)
- [X] T027 [US4] Implement the empty-cart guard in `js/checkout.js`: on page load, if the cart has no items, redirect (or show a prompt with a link) back to `catalog.html` instead of rendering a submittable form (depends on T005, T025)
- [X] T028 [US4] Implement client-side form validation in `js/checkout.js`: required-field checks plus email-format and phone-format checks, rendering inline error messages next to each offending field and preventing submission until resolved
- [X] T029 [US4] Implement the submit handler in `js/checkout.js`: on valid submit, build an Order snapshot (per [data-model.md](./data-model.md) Order), render the on-page order confirmation (reference number, submitted info, item/subtotal summary), disable further submission, and call `cart.clearCart()` (depends on T005, T028)
- [X] T030 [US4] Style the checkout form (including inline validation error states), order summary, and confirmation view in `css/components.css`, confirming responsive behavior

**Checkpoint**: All four user stories are independently functional — the full browse → detail → cart → checkout journey works end-to-end.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Quality, performance, and consistency gates that span every page (Constitution Principles I-IV)

- [X] T031 [P] Source/create optimized product images (compressed, appropriately sized, modern format such as WebP with a fallback) in `assets/images/products/` and reference them from `js/data/products.js`
- [X] T032 [P] Add `loading="lazy"` to all below-the-fold product images across `index.html`, `catalog.html`, and `product.html`
- [X] T033 [P] Ensure all `<script>` tags use `defer` (or `type="module"`), and add `font-display: swap` for any Google Font usage, across all 5 HTML pages, per Constitution Principle IV
- [X] T034 Audit all 5 pages (`index.html`, `catalog.html`, `product.html`, `cart.html`, `checkout.html`) for consistent header/nav/footer markup, shared button/card/form styles, and exclusive use of `tokens.css` values (no hard-coded colors/spacing), per Constitution Principles I and III
- [X] T035 Run the full [quickstart.md](./quickstart.md) validation pass: all 5 scenarios, in at least one Chromium-based and one WebKit/Firefox browser, plus mobile/tablet/desktop widths — fix any console errors, broken links, contrast issues, or keyboard-navigation gaps found
- [X] T036 Minify `css/*.css` and `js/*.js` (or document the minification step used) for production deployment, per Constitution Principle IV

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Setup — BLOCKS all user stories (every page needs `products.js`, `cart.js`, `nav.js`, shared CSS)
- **User Stories (Phase 3-6)**: All depend on Foundational completion
  - US1 and US2 are both P1 and have no dependency on each other's UI, but US2's product data and US1's catalog links naturally pair well done in order
  - US3 (cart page) reads cart state that US2 writes — build US2 before US3 to test end-to-end, though US3's own code has no hard dependency on US2's files
  - US4 (checkout) reads cart state exactly like US3 — build after US3 to test the full flow, though it has no hard file dependency on US3
- **Polish (Phase 7)**: Depends on all four user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational — no dependency on other stories
- **User Story 2 (P1)**: Can start after Foundational — no dependency on other stories (independently reachable via direct URL)
- **User Story 3 (P2)**: Can start after Foundational — independently testable with seeded cart data, but end-to-end testing is most natural after US2 exists
- **User Story 4 (P2)**: Can start after Foundational — independently testable with seeded cart data, but end-to-end testing is most natural after US2/US3 exist

### Within Each User Story

- Page skeleton (HTML) before its rendering script
- Rendering/read logic before interactive handlers (quantity, add/remove, submit)
- Story's JS/HTML complete before that story's dedicated styling task

### Parallel Opportunities

- T002, T003 (Setup) can run in parallel
- T005, T006, T007, T008 (Foundational) can run in parallel once T004 exists (different files)
- T010 and T011 (US1 page skeletons) can run in parallel
- T015 (US2), T020 (US3), and T025 (US4) page skeletons can each be started in parallel once Foundational is done, since they are different files
- T031, T032, T033 (Polish) can run in parallel

---

## Parallel Example: Foundational Phase

```bash
# After T004 (products.js) is done, launch these together:
Task: "Implement js/cart.js per data-model.md Cart Item/Cart"
Task: "Implement js/nav.js cart-badge + active-link rendering"
Task: "Create css/layout.css header/nav/footer/grid/breakpoints"
Task: "Create css/components.css shared card/button/stepper/form styles"
```

## Parallel Example: User Story 1

```bash
Task: "Create index.html with header/nav/footer, hero, featured container"
Task: "Create catalog.html with header/nav/footer, product-grid container"
```

---

## Implementation Strategy

### MVP First (User Story 1 + User Story 2)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL — blocks all stories)
3. Complete Phase 3: User Story 1 (browse) — **STOP and VALIDATE** independently
4. Complete Phase 4: User Story 2 (detail + add to cart) — **STOP and VALIDATE** independently
5. Together, US1 + US2 form a demonstrable MVP: a browsable catalog where visitors can view rich product detail and add items to a cart

### Incremental Delivery

1. Setup + Foundational → foundation ready
2. Add User Story 1 → validate → demo (browsable catalog)
3. Add User Story 2 → validate → demo (MVP: browse + add to cart)
4. Add User Story 3 → validate → demo (full cart management)
5. Add User Story 4 → validate → demo (complete purchase journey)
6. Polish phase → cross-browser/responsive/performance sign-off before calling the feature done

---

## Notes

- [P] tasks touch different files and have no unmet dependencies
- [Story] label maps each task to its user story for traceability back to [spec.md](./spec.md)
- No automated tests were requested; Phase 7's `quickstart.md` pass is the required manual quality gate per the constitution
- Commit after each task or logical group
- Stop at any checkpoint to validate a story independently before moving on
- Avoid: giving pages one-off inline styles/scripts, duplicating cart logic outside `js/cart.js`, or skipping the shared header/nav/footer pattern
