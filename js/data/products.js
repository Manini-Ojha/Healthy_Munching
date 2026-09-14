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
    id: "almond-crunch-waffle",
    name: "Almond Crunch Waffle",
    price: 149,
    image: "assets/images/products/almond-crunch-waffle.svg",
    shortDescription: "Toasted almonds folded into a whole-wheat waffle, lightly sweetened with honey.",
    fullDescription: "Our Almond Crunch Waffle starts with a whole-wheat batter, naturally sweetened with honey, and studded with toasted almond slivers for a satisfying crunch in every bite. Baked, not fried, and portioned as a wholesome on-the-go snack.",
    ingredients: ["Whole wheat flour", "Toasted almonds", "Honey", "Eggs", "Milk", "Baking powder", "Cinnamon", "Sea salt"],
    allergens: ["Tree nuts (almonds)", "Gluten (wheat)", "Egg", "Milk"],
    nutrition: { calories: 180, protein: "6g", carbs: "22g", fat: "7g", fiber: "3g" },
    category: "Classic",
    featured: true
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
    id: "peanut-protein-waffle",
    name: "Peanut Protein Waffle",
    price: 169,
    image: "assets/images/products/peanut-protein-waffle.svg",
    shortDescription: "20g of protein per serving with natural peanut butter swirl.",
    fullDescription: "Built for post-workout snacking, the Peanut Protein Waffle packs 20g of protein per serving using a whey-and-oat base, swirled with natural peanut butter. No added sugar, no artificial sweeteners.",
    ingredients: ["Rolled oats", "Whey protein isolate", "Natural peanut butter", "Eggs", "Milk", "Baking powder", "Stevia leaf extract"],
    allergens: ["Peanuts", "Milk", "Egg", "Gluten (oats)"],
    nutrition: { calories: 210, protein: "20g", carbs: "14g", fat: "9g", fiber: "3g" },
    category: "Protein",
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
    id: "gluten-free-berry-waffle",
    name: "Gluten-Free Berry Waffle",
    price: 179,
    image: "assets/images/products/gluten-free-berry-waffle.svg",
    shortDescription: "Almond-and-rice-flour base with real mixed berries, 100% gluten-free.",
    fullDescription: "Made with an almond-and-rice-flour blend instead of wheat, folded with real mixed berries. A gluten-free waffle that doesn't compromise on texture, naturally sweetened with a touch of maple syrup.",
    ingredients: ["Almond flour", "Rice flour", "Mixed berries", "Maple syrup", "Eggs", "Milk", "Baking powder"],
    allergens: ["Tree nuts (almonds)", "Egg", "Milk"],
    nutrition: { calories: 165, protein: "5g", carbs: "18g", fat: "8g", fiber: "3g" },
    category: "Gluten-Free",
    featured: true
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
  },
  {
    id: "vegan-coconut-waffle",
    name: "Vegan Coconut Waffle",
    price: 165,
    image: "assets/images/products/vegan-coconut-waffle.svg",
    shortDescription: "Coconut milk and flax egg, 100% plant-based, no dairy.",
    fullDescription: "A fully plant-based waffle made with coconut milk and a flax-seed egg replacer, finished with toasted coconut flakes. Dairy-free and egg-free without sacrificing richness.",
    ingredients: ["Whole wheat flour", "Coconut milk", "Flaxseed meal", "Toasted coconut flakes", "Coconut sugar", "Baking powder"],
    allergens: ["Gluten (wheat)", "Coconut"],
    nutrition: { calories: 185, protein: "4g", carbs: "23g", fat: "9g", fiber: "4g" },
    category: "Vegan",
    featured: true
  },
  {
    id: "vegan-mixed-seed-waffle",
    name: "Vegan Mixed Seed Waffle",
    price: 172,
    image: "assets/images/products/vegan-mixed-seed-waffle.svg",
    shortDescription: "Chia, flax, and pumpkin seeds in a fully plant-based waffle.",
    fullDescription: "Loaded with chia, flax, and pumpkin seeds for omega-3s, fiber, and a satisfying bite, this fully plant-based waffle is sweetened with date syrup and made without any animal products.",
    ingredients: ["Whole wheat flour", "Chia seeds", "Flaxseed meal", "Pumpkin seeds", "Date syrup", "Plant milk", "Baking powder"],
    allergens: ["Gluten (wheat)", "Seeds"],
    nutrition: { calories: 190, protein: "6g", carbs: "22g", fat: "9g", fiber: "5g" },
    category: "Vegan",
    featured: false
  },
  {
    id: "mango-turmeric-waffle",
    name: "Mango Turmeric Waffle",
    price: 168,
    image: "assets/images/products/mango-turmeric-waffle.svg",
    shortDescription: "Real mango puree with a pinch of turmeric and black pepper.",
    fullDescription: "A seasonal favorite: real mango puree folded into the batter with a pinch of turmeric and black pepper for warmth and color. Naturally sweet, naturally golden.",
    ingredients: ["Whole wheat flour", "Mango puree", "Turmeric", "Black pepper", "Eggs", "Milk", "Baking powder"],
    allergens: ["Gluten (wheat)", "Egg", "Milk"],
    nutrition: { calories: 178, protein: "5g", carbs: "25g", fat: "6g", fiber: "2g" },
    category: "Classic",
    featured: false
  },
  {
    id: "protein-cocoa-waffle",
    name: "Protein Cocoa Waffle",
    price: 175,
    image: "assets/images/products/protein-cocoa-waffle.svg",
    shortDescription: "18g protein with unsweetened cocoa, sweetened naturally.",
    fullDescription: "Rich unsweetened cocoa meets a whey-and-oat protein base for a chocolatey waffle with 18g of protein per serving. Naturally sweetened with monk fruit, no refined sugar.",
    ingredients: ["Rolled oats", "Whey protein isolate", "Unsweetened cocoa powder", "Eggs", "Milk", "Monk fruit extract", "Baking powder"],
    allergens: ["Milk", "Egg", "Gluten (oats)"],
    nutrition: { calories: 205, protein: "18g", carbs: "16g", fat: "8g", fiber: "4g" },
    category: "Protein",
    featured: false
  }
];

// Expose on a single shared namespace so plain <script> tags (no build step,
// no bundler) can access it consistently across every page.
window.WaffleNibbles = window.WaffleNibbles || {};
window.WaffleNibbles.PRODUCTS = PRODUCTS;
