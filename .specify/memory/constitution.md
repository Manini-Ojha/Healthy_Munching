# Waffle Nibbles Constitution

## Core Principles

### I. Semantic, Maintainable Code
All markup MUST use semantic HTML5 elements (`header`, `nav`, `main`, `section`,
`article`, `footer`, `form`, etc.) instead of generic `div`/`span` soup. CSS MUST
be organized with a single source of truth for design tokens (colors, spacing,
type scale, radii) defined as CSS custom properties — no magic numbers duplicated
across files. JavaScript MUST be written as small, named, single-purpose
functions, kept in external `.js` files (no inline `<script>` blocks or
inline `style=`/`onclick=` attributes). Naming MUST be consistent (kebab-case
for files and CSS classes, camelCase for JS variables/functions). Every new
page or component reuses existing tokens, classes, and utility functions
before introducing new ones.
**Rationale**: A small team (or solo founder) maintaining this site long-term
needs code that is easy to re-read six months later; duplication and inline
logic are the fastest way to make a static site unmaintainable.

### II. Test Before Ship (NON-NEGOTIABLE)
No page or feature (product listing, product detail, cart, checkout form,
navigation) is considered done until it passes a manual verification pass:
zero console errors/warnings, all links resolve, all images load, and all
interactive flows (add to cart, update quantity, remove item, checkout form
validation) work end-to-end. Every form MUST validate required fields,
email format, and phone/pincode format (as applicable) before submission,
with visible inline error messages. Every interactive feature (cart, filters,
search, quantity steppers) MUST be checked in at least one Chromium browser
and one WebKit/Firefox browser, plus one mobile-width viewport (≤480px),
before merging. Regressions found after ship MUST be logged and fixed before
new features are added on top of the broken area.
**Rationale**: Without an automated test suite, discipline about manual
verification is the only thing standing between customers and a broken cart
or checkout — which directly costs sales.

### III. Consistent, On-Brand User Experience
Every page MUST share the same header/navigation, footer, color palette,
typography, and button/card styles, driven by the shared CSS tokens from
Principle I — no page invents its own one-off styling. The product card,
price display, "Add to Cart" button, and cart drawer/page MUST look and
behave identically wherever they appear on the site. All interactive
elements MUST have visible hover/focus/active states and meet WCAG AA
color-contrast minimums; images MUST have descriptive `alt` text; the site
MUST be fully usable via keyboard alone. Layouts MUST be responsive-first
(mobile, tablet, desktop breakpoints) with no horizontal scrolling or
overlapping content at any supported width.
**Rationale**: This is a consumer food brand — visual inconsistency or
inaccessible/broken layouts erode trust and directly hurt conversion, which
matters more here than in an internal tool.

### IV. Performance by Default
Pages MUST reach a usable, styled state quickly on a mid-range mobile
connection: images MUST be compressed and served in modern formats
(WebP/AVIF with a fallback) and MUST use `loading="lazy"` for any image
below the fold. External dependencies (fonts, libraries, icon sets) MUST be
kept to the minimum necessary and loaded without blocking first render
(e.g., `defer`/`async` on scripts, `font-display: swap`). CSS and JS MUST be
minified for production. No feature may add a render-blocking third-party
script without an explicit justification recorded in the relevant plan.
**Rationale**: Shoppers abandon slow food-ordering sites almost
instantly; performance is a conversion feature, not a nice-to-have.

### V. Simplicity & No Backend Assumptions
The site is plain HTML/CSS/JS with no framework and no server-side backend
unless a future amendment explicitly introduces one. Cart and preference
state MUST be handled client-side (e.g., `localStorage`) using the simplest
approach that works; checkout MUST NOT assume a live payment/backend
integration unless that capability is explicitly speced and approved.
Prefer solving problems with built-in browser APIs before reaching for a
new library or build tool.
**Rationale**: Keeping the stack simple and dependency-free matches the
project's actual scope (a small e-commerce storefront) and keeps it easy for
a solo founder to host, understand, and change.

## Design & Content Standards

Reference the storefronts named as inspiration (thebelgianwaffle.co,
dzurtjaipur.com, thehealthfactory.in) for structure only — clean product
grid/collection pages, a clear hero/value proposition on the homepage, a
product detail view with price/description/nutrition info, and a visible
cart. All copy, imagery, and branding MUST be original to Waffle Nibbles;
do not copy text or images from reference sites. Product data (name, price,
description, ingredients/allergens, image) MUST live in a single structured
source (e.g., a JS/JSON data file) that pages read from, rather than being
hand-duplicated across HTML files.

## Development Workflow

Every feature proceeds through spec → plan → tasks → implementation using
this project's Spec-Kit workflow. Before marking a task complete, the
author MUST self-review the diff against Principles I–V above. Commits
should be small and scoped to one feature or fix at a time so regressions
are easy to bisect.

## Governance

This constitution supersedes ad-hoc styling or scripting decisions made
during implementation. Any change that violates a principle above (e.g.,
introducing a framework, skipping responsive design, shipping an
unvalidated form) MUST either be brought into compliance or the
constitution MUST be amended first, with the reason recorded in the
amendment history below. Amendments require updating the version number
per semantic versioning (MAJOR: principle removed/redefined incompatibly;
MINOR: new principle or materially expanded guidance; PATCH: wording/typo
clarifications) and updating the Last Amended date.

**Version**: 1.0.0 | **Ratified**: 2026-09-14 | **Last Amended**: 2026-09-14
