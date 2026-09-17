/**
 * Static product catalog for Waffle Nibbles.
 * Single source of truth for product data - no fetch/backend involved
 * (see research.md "Product data as a static JS module" decision).
 *
 * @typedef {Object} Nutrition
 * @property {number} calories
 * @property {string} protein
 * @property {string} carbs
 * @property {string} fat
 * @property {string} fiber
 *
 * @typedef {Object} Product
 * @property {string} id
 * @property {string} name
 * @property {number} price
 * @property {string} image
 * @property {string} shortDescription
 * @property {string} fullDescription
 * @property {string[]} ingredients
 * @property {string[]} allergens
 * @property {Nutrition} nutrition
 * @property {string} category
 * @property {boolean} featured
 */

/** @type {Product[]} */
const PRODUCTS = [
  {
    id: "honey-vanilla-waffle-nibbles",
    name: "Honey Vanilla Waffle Nibbles",
    price: 155,
    image: "assets/images/products/honey-vanilla-waffle-nibbles.png",
    shortDescription: "Bite-sized waffle nibbles with honey and real vanilla.",
    fullDescription: "Light, bite-sized waffle nibbles baked from a whole-wheat batter and sweetened with honey and real vanilla for a warm, comforting snack you can share or take on the go.",
    ingredients: ["Whole wheat flour", "Honey", "Vanilla extract", "Eggs", "Milk", "Baking powder", "Sea salt"],
    allergens: ["Gluten (wheat)", "Egg", "Milk"],
    nutrition: { calories: 155, protein: "4g", carbs: "19g", fat: "6g", fiber: "2g" },
    category: "Classic",
    featured: true
  },
  {
    id: "honey-chocolate-waffle-nibbles",
    name: "Honey Chocolate Waffle Nibbles",
    price: 159,
    image: "assets/images/products/honey-chocolate-waffle-nibbles.png",
    shortDescription: "Bite-sized waffle nibbles drizzled with honey and dark chocolate.",
    fullDescription: "Crisp, bite-sized waffle nibbles baked from a whole-wheat batter, drizzled with honey and dark chocolate for a sweet-and-crunchy snack you can share or take on the go.",
    ingredients: ["Whole wheat flour", "Honey", "Dark chocolate", "Eggs", "Milk", "Baking powder", "Sea salt"],
    allergens: ["Gluten (wheat)", "Egg", "Milk", "May contain traces of tree nuts"],
    nutrition: { calories: 160, protein: "4g", carbs: "20g", fat: "7g", fiber: "2g" },
    category: "Classic",
    featured: true
  },
  {
    id: "banana-dough-waffle",
    name: "Banana Dough Waffle",
    price: 155,
    image: "assets/images/products/banana-dough-waffle.png",
    shortDescription: "Soft banana-infused waffle dough baked fresh, no refined sugar.",
    fullDescription: "A soft, moist waffle made with real mashed banana folded into the dough, naturally sweetened and baked fresh for a comforting everyday snack.",
    ingredients: ["Whole wheat flour", "Mashed banana", "Eggs", "Milk", "Baking powder", "Cinnamon"],
    allergens: ["Gluten (wheat)", "Egg", "Milk"],
    nutrition: { calories: 170, protein: "5g", carbs: "23g", fat: "6g", fiber: "3g" },
    category: "Classic",
    featured: false
  },
  {
    id: "chocolate-dough-waffle",
    name: "Chocolate Dough Waffle",
    price: 165,
    image: "assets/images/products/chocolate-dough-waffle.png",
    shortDescription: "Rich cocoa waffle dough baked fresh, no refined sugar.",
    fullDescription: "A rich, chocolatey waffle made from a cocoa-infused dough, baked fresh and lightly sweetened for a satisfying treat without the sugar crash.",
    ingredients: ["Whole wheat flour", "Cocoa powder", "Eggs", "Milk", "Baking powder", "Date paste"],
    allergens: ["Gluten (wheat)", "Egg", "Milk"],
    nutrition: { calories: 190, protein: "5g", carbs: "25g", fat: "8g", fiber: "3g" },
    category: "Classic",
    featured: false
  },
  {
    id: "vanilla-waffle",
    name: "Vanilla Waffle",
    price: 149,
    image: "assets/images/products/vanilla-waffle.png",
    shortDescription: "Classic vanilla waffle, lightly sweetened and baked fresh.",
    fullDescription: "A simple, classic waffle flavored with real vanilla, lightly sweetened and baked fresh for a clean, comforting everyday snack.",
    ingredients: ["Whole wheat flour", "Vanilla extract", "Eggs", "Milk", "Baking powder", "Sea salt"],
    allergens: ["Gluten (wheat)", "Egg", "Milk"],
    nutrition: { calories: 165, protein: "4g", carbs: "21g", fat: "6g", fiber: "2g" },
    category: "Classic",
    featured: false
  },
  {
    id: "bajara-cookies",
    name: "Bajara Cookies",
    price: 145,
    image: "assets/images/products/Bajara-cookies.png",
    shortDescription: "Crisp pearl millet cookies, lightly sweetened and baked fresh.",
    fullDescription: "Wholesome cookies made with bajara (pearl millet) flour, naturally gluten-free grain goodness baked into a crisp, lightly sweetened bite.",
    ingredients: ["Bajara (pearl millet) flour", "Jaggery", "Ghee", "Baking powder", "Sea salt"],
    allergens: ["Milk (ghee)"],
    nutrition: { calories: 150, protein: "3g", carbs: "20g", fat: "6g", fiber: "2g" },
    category: "Gluten-Free",
    featured: false
  },
  {
    id: "jowar-cookies",
    name: "Jowar Cookies",
    price: 145,
    image: "assets/images/products/Jowar-cookies.png",
    shortDescription: "Crisp sorghum cookies, lightly sweetened and baked fresh.",
    fullDescription: "Wholesome cookies made with jowar (sorghum) flour, a naturally gluten-free grain baked into a crisp, lightly sweetened bite.",
    ingredients: ["Jowar (sorghum) flour", "Jaggery", "Ghee", "Baking powder", "Sea salt"],
    allergens: ["Milk (ghee)"],
    nutrition: { calories: 148, protein: "3g", carbs: "19g", fat: "6g", fiber: "2g" },
    category: "Gluten-Free",
    featured: false
  },
  {
    id: "dark-chocolate-oat-waffle",
    name: "Dark Chocolate Oat Waffle",
    price: 159,
    image: "assets/images/products/dark-chocolate-oat-waffle.svg",
    shortDescription: "Rolled oats and 70% dark chocolate chips, no refined sugar.",
    fullDescription: "A hearty oat-based waffle folded with 70% dark chocolate chips and sweetened only with dates - no refined sugar. High in fiber from rolled oats, this one satisfies a chocolate craving without the sugar crash.",
    ingredients: ["Rolled oats", "Whole wheat flour", "70% dark chocolate chips", "Date paste", "Eggs", "Milk", "Baking powder"],
    allergens: ["Gluten (wheat, oats)", "Egg", "Milk", "May contain traces of tree nuts"],
    nutrition: { calories: 195, protein: "5g", carbs: "26g", fat: "8g", fiber: "4g" },
    category: "Classic",
    featured: true
  },
  {
    id: "banana-walnut-waffle",
    name: "Banana Walnut Waffle",
    price: 155,
    image: "assets/images/products/banana-walnut-waffle.svg",
    shortDescription: "Mashed banana and crushed walnuts for natural sweetness.",
    fullDescription: "Ripe mashed bananas do the sweetening here, paired with crushed walnuts for omega-3s and texture. A soft, moist waffle that works as breakfast or an afternoon pick-me-up.",
    ingredients: ["Whole wheat flour", "Mashed banana", "Crushed walnuts", "Eggs", "Milk", "Baking powder", "Cinnamon"],
    allergens: ["Tree nuts (walnuts)", "Gluten (wheat)", "Egg", "Milk"],
    nutrition: { calories: 175, protein: "5g", carbs: "24g", fat: "6g", fiber: "3g" },
    category: "Classic",
    featured: false
  },
  {
    id: "gluten-free-cinnamon-waffle",
    name: "Gluten-Free Cinnamon Waffle",
    price: 175,
    image: "assets/images/products/gluten-free-cinnamon-waffle.svg",
    shortDescription: "Warm cinnamon-spiced waffle on a rice-and-oat gluten-free base.",
    fullDescription: "A cozy cinnamon-spiced waffle built on a certified gluten-free rice-and-oat flour blend, lightly sweetened with jaggery for a warm, caramel-like note.",
    ingredients: ["Gluten-free oat flour", "Rice flour", "Jaggery", "Cinnamon", "Eggs", "Milk", "Baking powder"],
    allergens: ["Egg", "Milk", "Certified gluten-free oats"],
    nutrition: { calories: 170, protein: "4g", carbs: "21g", fat: "7g", fiber: "3g" },
    category: "Gluten-Free",
    featured: false
  }
];

// Expose on a single shared namespace so plain <script> tags (no build step,
// no bundler) can access it consistently across every page.
if (typeof window !== "undefined") {
  window.WaffleNibbles = window.WaffleNibbles || {};
  window.WaffleNibbles.PRODUCTS = PRODUCTS;
}

// Also usable from Node (server-side seed script) without a bundler.
if (typeof module !== "undefined" && module.exports) {
  module.exports = PRODUCTS;
}
