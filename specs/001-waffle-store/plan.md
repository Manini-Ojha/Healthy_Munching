# Implementation Plan: Waffle Nibbles Storefront

**Branch**: `001-waffle-store` | **Date**: 2026-09-14 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-waffle-store/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command; its definition describes the execution workflow.

## Summary

Build a static, client-only e-commerce storefront ("Waffle Nibbles") in plain
HTML/CSS/JavaScript covering: homepage (hero + featured products), a product
catalog page, per-product detail pages, a persistent client-side cart, and a
guest checkout page with form validation and an on-page order confirmation.
No backend, no build tooling, and no live payment integration — product data
is a static JS data module, cart/order state lives in `localStorage`, and all
pages share a common header/nav/footer driven by shared CSS design tokens.

## Technical Context

**Language/Version**: HTML5, CSS3, ES2020+ JavaScript (vanilla, no transpilation)

**Primary Dependencies**: None (no framework, no npm build step). Optional:
Google Fonts (loaded with `font-display: swap`) for typography — no other
external runtime dependency.

**Storage**: Browser `localStorage` for cart state (`waffle-nibbles-cart`
key). Product catalog data lives in a static JS module
(`js/data/products.js`) checked into the repo — no database, no server.

**Testing**: Manual verification per Constitution Principle II — a per-page/
per-flow checklist (console-error-free, links resolve, forms validate,
cart math correct) run in at least one Chromium-based browser + one
WebKit/Firefox browser, plus one mobile-width viewport, before each feature
is considered done. No automated test framework is introduced (matches
Principle V: simplicity, no build tooling).

**Target Platform**: Modern evergreen browsers (Chrome, Edge, Firefox,
Safari) on desktop and mobile; static files servable from any static host
(e.g., GitHub Pages, Netlify) with no server runtime required.

**Project Type**: Static single-page-per-route website (multi-page HTML
site, no SPA router, no framework).

**Performance Goals**: First contentful paint on a mid-range mobile
connection quickly perceived as "usable" — no render-blocking scripts,
compressed/responsive images, lazy-loaded below-the-fold images, minified
CSS/JS for production (per Constitution Principle IV).

**Constraints**: No backend/server, no payment gateway (per spec
Assumptions and Constitution Principle V). Must remain fully static/
hostable with zero server-side logic. Cart persistence must degrade
gracefully if `localStorage` is unavailable (spec Edge Cases).

**Scale/Scope**: 5 page types (home, catalog, product detail, cart,
checkout) plus a small hand-curated product catalog (~8-12 products)
sufficient to demonstrate all user stories; single storefront, single
currency, no internationalization in scope.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Check | Status |
|---|---|---|
| I. Semantic, Maintainable Code | Plan uses semantic HTML per page, shared CSS tokens file, external JS modules only (no inline scripts/styles), consistent kebab/camelCase naming | PASS |
| II. Test Before Ship | Manual cross-browser/mobile verification checklist defined per flow in Technical Context → Testing; no automated suite required, matches constitution's non-negotiable manual-test bar | PASS |
| III. Consistent, On-Brand UX | Shared header/nav/footer partial pattern, shared product-card/button/cart components, responsive-first CSS, WCAG AA contrast target carried into design tokens | PASS |
| IV. Performance by Default | Lazy-loaded images, deferred/async scripts, minimal external deps (fonts only, optional), minification noted for production | PASS |
| V. Simplicity & No Backend Assumptions | No framework, no build step required to run, `localStorage`-only state, checkout has no live payment integration | PASS |

No violations. Complexity Tracking table below is not needed.

## Project Structure

### Documentation (this feature)

```text
specs/001-waffle-store/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md         # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

No `contracts/` directory: this feature has no external API/service
interface — the only "contract" is the shape of the static product data
module, which is documented in `data-model.md` instead.

### Source Code (repository root)

```text
index.html              # Homepage: hero + featured products
catalog.html             # Product catalog/collection grid
product.html             # Product detail page (reads ?id= from query string)
cart.html                 # Cart view
checkout.html             # Checkout form + order summary + confirmation

css/
├── tokens.css            # Design tokens: color, type scale, spacing, radii (CSS custom properties)
├── base.css               # Reset + base element styles, typography
├── layout.css             # Header/nav/footer, grid/page layout, responsive breakpoints
└── components.css        # Product card, buttons, quantity stepper, cart line item, form fields

js/
├── data/
│   └── products.js        # Static product catalog data (array of Product objects)
├── cart.js                # Cart module: get/add/update/remove/clear, localStorage read/write, subtotal calc
├── nav.js                 # Shared header/cart-count rendering, active-link highlighting
├── home.js                # Homepage: render featured products
├── catalog.js              # Catalog page: render full product grid
├── product.js              # Product detail page: render product, quantity selector, add-to-cart
├── cart-page.js             # Cart page: render line items, wire update/remove, empty-cart state
└── checkout.js              # Checkout page: render order summary, form validation, submit → confirmation

assets/
└── images/
    └── products/           # Product photos (optimized/responsive formats)

specs/
└── 001-waffle-store/       # This feature's spec-kit artifacts (already present)
```

**Structure Decision**: Single static-site project at the repository root
(no `src/`, no backend/frontend split — Option 1 "single project" from the
template, simplified further since there is no server and no build step).
Each HTML page is a real, directly-loadable file; each page loads only the
CSS/JS modules it needs (`nav.js` + `cart.js` on every page, plus one
page-specific script). `js/cart.js` is the single source of truth for cart
state and is imported by every page that reads or mutates the cart, so
cart logic is never duplicated.

## Complexity Tracking

*No constitution violations — table not needed.*
