# Waffle Nibbles

A healthy waffle snack e-commerce storefront for **Waffle Nibbles**, the
snack line made by **Healthy Munching** (the company) — plain HTML, CSS,
and JavaScript, no framework, no backend, no build step required to run.
The company's logo lives at
[assets/images/brand/healthy-munching-logo.png](assets/images/brand/healthy-munching-logo.png)
and is used in the site header/footer.

See [specs/001-waffle-store/](specs/001-waffle-store/) for the full
spec-kit feature documentation (spec, plan, tasks, research, data model,
quickstart) and [.specify/memory/constitution.md](.specify/memory/constitution.md)
for the project's guiding principles.

## Run locally

No build tools required. Serve the folder with any static file server so
relative paths behave like production (opening via `file://` can break
some browsers' handling of query strings and fetches):

```sh
python -m http.server 8080
# or: npx serve .
```

Then open `http://localhost:8080/index.html`.

## Project structure

```text
index.html, catalog.html, product.html, cart.html, checkout.html
css/tokens.css        # design tokens (colors, type, spacing, radii)
css/base.css          # reset + base typography
css/layout.css        # header/nav/footer/grid/breakpoints
css/components.css    # product card, buttons, stepper, cart rows, forms
js/data/products.js   # static product catalog (no backend/fetch)
js/cart.js            # single source of truth for cart state (localStorage)
js/nav.js             # shared header cart-badge + active-link behavior
js/home.js, js/catalog.js, js/product.js, js/cart-page.js, js/checkout.js
assets/images/products/  # product images (currently placeholder SVGs)
```

## Production deployment / minification

Per the project constitution (Performance by Default), CSS/JS should be
minified before production deployment. No minifier is bundled in this
repo to keep the project dependency-free for local development; at
deploy time, run one of the following (no project-level `package.json`
is required — these work via `npx` on demand):

```sh
# CSS
npx clean-css-cli -o dist/css/tokens.min.css css/tokens.css
npx clean-css-cli -o dist/css/base.min.css css/base.css
npx clean-css-cli -o dist/css/layout.min.css css/layout.css
npx clean-css-cli -o dist/css/components.min.css css/components.css

# JS
npx terser js/data/products.js -o dist/js/products.min.js -c -m
npx terser js/cart.js -o dist/js/cart.min.js -c -m
npx terser js/nav.js -o dist/js/nav.min.js -c -m
npx terser js/home.js -o dist/js/home.min.js -c -m
npx terser js/catalog.js -o dist/js/catalog.min.js -c -m
npx terser js/product.js -o dist/js/product.min.js -c -m
npx terser js/cart-page.js -o dist/js/cart-page.min.js -c -m
npx terser js/checkout.js -o dist/js/checkout.min.js -c -m
```

Then point each HTML page's `<link>`/`<script>` tags at the `dist/`
versions for the deployed build (keep the unminified `css/`/`js/` files
as the source of truth for development).

## Replacing placeholder product images

`assets/images/products/*.svg` are lightweight vector placeholders
(under 2KB each) so the site is fully functional out of the box. Replace
them with real, compressed product photography (WebP with a JPEG
fallback recommended) and update the `image` field for each product in
`js/data/products.js` — no other code changes are needed.

## Manual testing

Every feature in this project is verified manually (no automated test
framework, per the constitution). See
[specs/001-waffle-store/quickstart.md](specs/001-waffle-store/quickstart.md)
for the full validation checklist to run before shipping changes.
