# Phase 1 Data Model: Waffle Nibbles Storefront

This feature has no database — the entities below describe the shape of the
static product data module and the runtime (in-memory/`localStorage`)
structures used by the client-side JavaScript.

## Product

Represents one waffle snack item, defined in `js/data/products.js`.

| Field | Type | Notes |
|---|---|---|
| `id` | string | Unique, URL-safe slug (e.g., `"almond-crunch-waffle"`). Used as the `?id=` value on `product.html` and as the cart's `productId`. |
| `name` | string | Display name. |
| `price` | number | Price in the site's base currency unit (e.g., rupees), as a plain number — no currency symbol embedded. |
| `image` | string | Relative path to the product image under `assets/images/products/`. |
| `shortDescription` | string | 1-2 sentence summary shown on catalog/home cards. |
| `fullDescription` | string | Longer description shown on the product detail page. |
| `ingredients` | string[] | List of ingredient names. |
| `allergens` | string[] | List of allergen callouts (can be empty array). |
| `nutrition` | object | `{ calories: number, protein: string, carbs: string, fat: string, fiber: string }` (units embedded in the string values, e.g., `"8g"`). |
| `category` | string | Optional grouping label (e.g., `"Classic"`, `"Gluten-Free"`, `"Protein"`), used only for display/badging. |
| `featured` | boolean | Whether this product appears in the homepage's featured section. |

**Validation rules**:
- `id`, `name`, `price`, `image` are required for every product; a product
  missing any of these is a data-authoring error, not a runtime state to
  handle defensively beyond a console warning.
- `price` MUST be a positive number.

## Cart Item (persisted)

The actual structure written to `localStorage` — intentionally minimal;
all display data is resolved from `Product` at render time.

| Field | Type | Notes |
|---|---|---|
| `productId` | string | References `Product.id`. |
| `quantity` | integer | MUST be ≥ 1. A cart item with `quantity` reduced to 0 is removed entirely rather than stored as zero. |

## Cart (runtime, derived)

Not itself persisted as one object — it's the resolved view of all Cart
Items joined against `Product` data, computed by `js/cart.js` for
rendering.

| Field | Type | Notes |
|---|---|---|
| `items` | `{ product: Product, quantity: number, lineTotal: number }[]` | One entry per Cart Item, with `product` looked up live and `lineTotal = product.price * quantity`. |
| `subtotal` | number | Sum of all `lineTotal` values. |
| `itemCount` | number | Sum of all `quantity` values (shown in the nav cart badge). |

**State transitions**:
- `addItem(productId, quantity)`: if `productId` already exists in the
  cart, increments its `quantity`; otherwise appends a new Cart Item.
- `updateQuantity(productId, quantity)`: sets quantity directly; if the
  resulting `quantity < 1`, the item is removed (never stored as 0 or
  negative).
- `removeItem(productId)`: deletes the Cart Item entirely.
- `clearCart()`: empties the cart (called after a successful checkout
  submission).

## Customer Info (checkout form, not persisted beyond the session)

| Field | Type | Notes |
|---|---|---|
| `name` | string | Required, non-empty. |
| `email` | string | Required, must match a standard email pattern. |
| `phone` | string | Required, must match a standard phone-number pattern (digits, optional `+`/spaces/dashes, reasonable length). |
| `address` | string | Required, non-empty (single delivery-address field; may be a multi-line textarea). |

## Order (ephemeral, confirmation-only)

Not persisted to any storage/backend — constructed only to render the
on-page confirmation after a successful checkout submit.

| Field | Type | Notes |
|---|---|---|
| `referenceNumber` | string | Client-generated display-only reference (e.g., timestamp-based), not a real order ID from a backend. |
| `customer` | Customer Info | Snapshot of the submitted form values. |
| `items` | Cart Item view (as in Cart.items) | Snapshot of the cart at submission time. |
| `subtotal` | number | Snapshot of the cart subtotal at submission time. |

**Relationships**: `Order` and `Cart` both reference `Product` by `id`;
`Order` is a point-in-time snapshot taken immediately before `clearCart()`
runs, so the confirmation view still has data to render after the cart is
emptied.
