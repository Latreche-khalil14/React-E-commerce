const mongoose = require("mongoose");
const bcrypt    = require("bcryptjs");
const dotenv    = require("dotenv");
const path      = require("path");

dotenv.config({ path: path.join(__dirname, "../.env") });

const User     = require("../models/User.model");
const Category = require("../models/Category.model");
const Product  = require("../models/Product.model");

// ─── Categories ───────────────────────────────────────────────────────────────
const categoriesData = [
  { name: "Men",         slug: "men",         description: "Men's fashion and clothing" },
  { name: "Women",       slug: "women",       description: "Women's fashion and clothing" },
  { name: "Electronics", slug: "electronics", description: "Gadgets and electronics" },
  { name: "Books",       slug: "books",       description: "Books and educational material" },
  { name: "Bikes",       slug: "bikes",       description: "Bikes and cycling equipment" },
  { name: "Games",       slug: "games",       description: "Video games and gaming accessories" },
  { name: "Kids",        slug: "kids",        description: "Kids clothing and toys" },
  { name: "Sports",      slug: "sports",      description: "Sports and fitness equipment" },
];

// helper for unique slugs
const s = (name, n) => `${name.toLowerCase().replace(/\s+/g,"-")}-${Date.now()+n}`;

// ─── Products ─────────────────────────────────────────────────────────────────
const getProducts = (c) => [
  // ── MEN ──────────────────────────────────────────────────────────────────
  {
    name: "Classic White T-Shirt", slug: s("classic-white-tshirt",1),
    description: "Premium 100% cotton white t-shirt, comfortable and stylish for everyday wear.",
    shortDescription: "100% premium cotton, unisex fit",
    price: 19.99, discountPrice: 14.99, category: c["Men"], brand: "UrbanWear",
    stock: 150, gender: "men", sizes: ["S","M","L","XL","XXL"], colors: ["White","Black","Gray"],
    tags: ["t-shirt","casual","cotton"], isFeatured: true,
    images: [{ url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500", isMain: true }],
  },
  {
    name: "Slim Fit Jeans", slug: s("slim-fit-jeans",2),
    description: "Stylish slim fit jeans made from high-quality stretchable denim.",
    shortDescription: "Slim fit, stretchable denim",
    price: 49.99, discountPrice: 39.99, category: c["Men"], brand: "DenimCo",
    stock: 80, gender: "men", sizes: ["30","32","34","36","38"], colors: ["Blue","Black","Dark Gray"],
    tags: ["jeans","denim","slim-fit"], isFeatured: true,
    images: [{ url: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=500", isMain: true }],
  },
  {
    name: "Men's Hoodie", slug: s("mens-hoodie",3),
    description: "Warm fleece hoodie with kangaroo pocket, perfect for cool weather.",
    shortDescription: "Fleece lined, kangaroo pocket",
    price: 45.99, discountPrice: 35.99, category: c["Men"], brand: "ComfortWear",
    stock: 60, gender: "men", sizes: ["S","M","L","XL"], colors: ["Black","Navy","Gray"],
    tags: ["hoodie","casual","winter"], isFeatured: false,
    images: [{ url: "https://images.unsplash.com/photo-1509942774463-acf339cf87d5?w=500", isMain: true }],
  },
  {
    name: "Men's Chino Pants", slug: s("mens-chino-pants",4),
    description: "Classic chino pants with a modern slim fit. Versatile for office or casual wear.",
    shortDescription: "Slim fit chinos, office-ready",
    price: 55.00, discountPrice: 0, category: c["Men"], brand: "StylePro",
    stock: 45, gender: "men", sizes: ["30","32","34","36"], colors: ["Beige","Navy","Olive"],
    tags: ["chino","pants","office"], isFeatured: false,
    images: [{ url: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=500", isMain: true }],
  },
  {
    name: "Men's Oxford Shirt", slug: s("mens-oxford-shirt",5),
    description: "Classic button-down Oxford shirt in premium cotton. A wardrobe essential.",
    shortDescription: "Premium cotton, button-down collar",
    price: 42.00, discountPrice: 32.00, category: c["Men"], brand: "ClassicMen",
    stock: 70, gender: "men", sizes: ["S","M","L","XL","XXL"], colors: ["White","Light Blue","Pink"],
    tags: ["shirt","oxford","formal"], isFeatured: true,
    images: [{ url: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500", isMain: true }],
  },
  {
    name: "Leather Belt", slug: s("leather-belt",6),
    description: "Genuine leather belt with silver buckle. Fits waist 28-44 inches.",
    shortDescription: "Genuine leather, adjustable",
    price: 25.00, discountPrice: 0, category: c["Men"], brand: "LeatherCraft",
    stock: 120, gender: "men", colors: ["Brown","Black"],
    tags: ["belt","leather","accessory"], isFeatured: false,
    images: [{ url: "https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=500", isMain: true }],
  },
  {
    name: "Men's Running Shoes", slug: s("mens-running-shoes",7),
    description: "Lightweight breathable running shoes with cushioned sole and arch support.",
    shortDescription: "Lightweight, cushioned sole",
    price: 89.99, discountPrice: 69.99, category: c["Men"], brand: "SpeedRun",
    stock: 40, gender: "men", sizes: ["40","41","42","43","44","45"],
    colors: ["Black/White","Blue/White","Red/Black"],
    tags: ["shoes","running","sports"], isFeatured: true,
    images: [{ url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500", isMain: true }],
  },

  // ── WOMEN ────────────────────────────────────────────────────────────────
  {
    name: "Floral Summer Dress", slug: s("floral-summer-dress",8),
    description: "Beautiful floral summer dress, lightweight and breathable. Perfect for warm days.",
    shortDescription: "Lightweight floral print, summer collection",
    price: 35.99, discountPrice: 0, category: c["Women"], brand: "BloomStyle",
    stock: 60, gender: "women", sizes: ["XS","S","M","L","XL"],
    colors: ["Pink","Yellow","Blue"], tags: ["dress","summer","floral"], isFeatured: true,
    images: [{ url: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500", isMain: true }],
  },
  {
    name: "Women's Blazer", slug: s("womens-blazer",9),
    description: "Professional women's blazer, perfect for office and formal occasions.",
    shortDescription: "Formal blazer, office collection",
    price: 79.99, discountPrice: 64.99, category: c["Women"], brand: "FormalElite",
    stock: 45, gender: "women", sizes: ["XS","S","M","L"],
    colors: ["Black","Navy","Beige"], tags: ["blazer","formal","office"], isFeatured: false,
    images: [{ url: "https://images.unsplash.com/photo-1594938298603-c8148c4b4b2d?w=500", isMain: true }],
  },
  {
    name: "Women's Leather Handbag", slug: s("womens-handbag",10),
    description: "Elegant PU leather handbag with multiple compartments and shoulder strap.",
    shortDescription: "PU leather, multiple compartments",
    price: 59.99, discountPrice: 44.99, category: c["Women"], brand: "ChicBag",
    stock: 35, gender: "women", colors: ["Black","Brown","Red","Beige"],
    tags: ["handbag","leather","accessory"], isFeatured: true,
    images: [{ url: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500", isMain: true }],
  },
  {
    name: "Women's High Heels", slug: s("womens-high-heels",11),
    description: "Classic stiletto high heels in genuine leather. 3.5 inch heel height.",
    shortDescription: "Genuine leather, 3.5 inch heel",
    price: 75.00, discountPrice: 55.00, category: c["Women"], brand: "HeelQueen",
    stock: 25, gender: "women", sizes: ["36","37","38","39","40"],
    colors: ["Black","Nude","Red"], tags: ["heels","shoes","formal"], isFeatured: false,
    images: [{ url: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500", isMain: true }],
  },
  {
    name: "Women's Yoga Pants", slug: s("womens-yoga-pants",12),
    description: "High-waist yoga pants made from moisture-wicking fabric. 4-way stretch.",
    shortDescription: "High-waist, 4-way stretch, moisture-wicking",
    price: 38.00, discountPrice: 28.00, category: c["Women"], brand: "FlexFit",
    stock: 90, gender: "women", sizes: ["XS","S","M","L","XL"],
    colors: ["Black","Gray","Navy","Burgundy"], tags: ["yoga","pants","sports"], isFeatured: true,
    images: [{ url: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=500", isMain: true }],
  },
  {
    name: "Women's Knit Sweater", slug: s("womens-knit-sweater",13),
    description: "Cozy oversized knit sweater. Perfect for layering in autumn and winter.",
    shortDescription: "Oversized knit, soft and warm",
    price: 52.00, discountPrice: 0, category: c["Women"], brand: "KnitLux",
    stock: 50, gender: "women", sizes: ["S","M","L","XL"],
    colors: ["Cream","Camel","Light Gray"], tags: ["sweater","knit","winter"], isFeatured: false,
    images: [{ url: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500", isMain: true }],
  },
  {
    name: "Women's Sunglasses", slug: s("womens-sunglasses",14),
    description: "UV400 polarized cat-eye sunglasses. Lightweight acetate frame.",
    shortDescription: "UV400 polarized, cat-eye style",
    price: 29.99, discountPrice: 19.99, category: c["Women"], brand: "SunVibe",
    stock: 100, gender: "women", colors: ["Black","Tortoise","Gold"],
    tags: ["sunglasses","accessory","summer"], isFeatured: false,
    images: [{ url: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500", isMain: true }],
  },

  // ── ELECTRONICS ──────────────────────────────────────────────────────────
  {
    name: "Wireless Headphones Pro", slug: s("wireless-headphones",15),
    description: "Premium wireless headphones with active noise cancellation and 30-hour battery.",
    shortDescription: "ANC, 30hr battery, premium sound",
    price: 129.99, discountPrice: 99.99, category: c["Electronics"], brand: "SoundWave",
    stock: 35, gender: "unisex", colors: ["Black","White","Blue"],
    tags: ["headphones","wireless","audio"], isFeatured: true,
    images: [{ url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500", isMain: true }],
  },
  {
    name: "Smart Watch Series 5", slug: s("smart-watch",16),
    description: "Feature-packed smart watch with health monitoring, GPS, and 5-day battery.",
    shortDescription: "GPS, heart rate, 5-day battery",
    price: 199.99, discountPrice: 159.99, category: c["Electronics"], brand: "TechTime",
    stock: 25, gender: "unisex", colors: ["Black","Silver","Rose Gold"],
    tags: ["smartwatch","fitness","tech"], isFeatured: true,
    images: [{ url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500", isMain: true }],
  },
  {
    name: "Bluetooth Speaker", slug: s("bluetooth-speaker",17),
    description: "Portable waterproof Bluetooth speaker with 360° sound and 12hr battery life.",
    shortDescription: "Waterproof IPX7, 360° sound, 12hr",
    price: 79.99, discountPrice: 59.99, category: c["Electronics"], brand: "SoundWave",
    stock: 50, gender: "unisex", colors: ["Black","Blue","Red"],
    tags: ["speaker","bluetooth","portable"], isFeatured: false,
    images: [{ url: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500", isMain: true }],
  },
  {
    name: "Mechanical Keyboard", slug: s("mechanical-keyboard",18),
    description: "TKL mechanical keyboard with Cherry MX switches and RGB backlight.",
    shortDescription: "Cherry MX switches, RGB, TKL",
    price: 109.99, discountPrice: 89.99, category: c["Electronics"], brand: "TypeMaster",
    stock: 20, gender: "unisex", colors: ["Black","White"],
    tags: ["keyboard","mechanical","gaming"], isFeatured: false,
    images: [{ url: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=500", isMain: true }],
  },
  {
    name: "4K Webcam", slug: s("4k-webcam",19),
    description: "4K Ultra HD webcam with autofocus and built-in noise-cancelling microphone.",
    shortDescription: "4K UHD, autofocus, built-in mic",
    price: 89.99, discountPrice: 69.99, category: c["Electronics"], brand: "ClearView",
    stock: 30, gender: "unisex", colors: ["Black"],
    tags: ["webcam","4k","streaming"], isFeatured: false,
    images: [{ url: "https://images.unsplash.com/photo-1596742578443-7682ef5251cd?w=500", isMain: true }],
  },
  {
    name: "Wireless Mouse", slug: s("wireless-mouse",20),
    description: "Ergonomic wireless mouse with silent clicks and 18-month battery life.",
    shortDescription: "Ergonomic, silent, 18-month battery",
    price: 39.99, discountPrice: 0, category: c["Electronics"], brand: "TypeMaster",
    stock: 80, gender: "unisex", colors: ["Black","White","Silver"],
    tags: ["mouse","wireless","ergonomic"], isFeatured: false,
    images: [{ url: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500", isMain: true }],
  },
  {
    name: "USB-C Hub 7-in-1", slug: s("usbc-hub",21),
    description: "7-in-1 USB-C hub: HDMI 4K, 3×USB 3.0, SD card, PD 100W, Ethernet.",
    shortDescription: "7-in-1, HDMI 4K, PD 100W",
    price: 49.99, discountPrice: 39.99, category: c["Electronics"], brand: "HubMax",
    stock: 60, gender: "unisex", colors: ["Silver","Space Gray"],
    tags: ["usbc","hub","accessories"], isFeatured: false,
    images: [{ url: "https://images.unsplash.com/photo-1625948515291-cb35c5804f90?w=500", isMain: true }],
  },

  // ── SPORTS ───────────────────────────────────────────────────────────────
  {
    name: "Yoga Mat Premium", slug: s("yoga-mat",22),
    description: "Extra thick 6mm yoga mat with non-slip surface and alignment lines.",
    shortDescription: "6mm thick, non-slip, alignment lines",
    price: 34.99, discountPrice: 24.99, category: c["Sports"], brand: "FlexFit",
    stock: 75, gender: "unisex", colors: ["Purple","Blue","Black","Green"],
    tags: ["yoga","mat","fitness"], isFeatured: false,
    images: [{ url: "https://images.unsplash.com/photo-1601925228440-9c6d0af4da1e?w=500", isMain: true }],
  },
  {
    name: "Dumbbell Set 5kg×2", slug: s("dumbbell-set",23),
    description: "Rubber-coated hex dumbbells, sold as a pair. Perfect for home workouts.",
    shortDescription: "Rubber coated, hex design, pair",
    price: 44.99, discountPrice: 0, category: c["Sports"], brand: "IronFlex",
    stock: 40, gender: "unisex", colors: ["Black"],
    tags: ["dumbbell","weights","gym"], isFeatured: false,
    images: [{ url: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500", isMain: true }],
  },
  {
    name: "Running Backpack 20L", slug: s("running-backpack",24),
    description: "Lightweight 20L hydration running backpack with 2L water bladder included.",
    shortDescription: "20L, hydration bladder, lightweight",
    price: 65.00, discountPrice: 49.00, category: c["Sports"], brand: "TrailRun",
    stock: 20, gender: "unisex", colors: ["Black","Blue","Orange"],
    tags: ["backpack","running","outdoor"], isFeatured: false,
    images: [{ url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500", isMain: true }],
  },
  // ── BOOKS ────────────────────────────────────────────────────────────────
  {
    name: "JavaScript: The Good Parts", slug: s("javascript-good-parts",25),
    description: "A classic programming book by Douglas Crockford covering JavaScript best practices.",
    shortDescription: "Essential JS programming guide",
    price: 24.99, discountPrice: 0, category: c["Books"], brand: "O'Reilly",
    stock: 100, gender: "unisex", tags: ["book","javascript","programming"], isFeatured: false,
    images: [{ url: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500", isMain: true }],
  },
  {
    name: "Clean Code", slug: s("clean-code",26),
    description: "Robert C. Martin's guide to writing clean, maintainable software.",
    shortDescription: "Best practices for clean software",
    price: 29.99, discountPrice: 22.99, category: c["Books"], brand: "Prentice Hall",
    stock: 80, gender: "unisex", tags: ["book","programming","clean-code"], isFeatured: true,
    images: [{ url: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500", isMain: true }],
  },
  {
    name: "Atomic Habits", slug: s("atomic-habits",27),
    description: "James Clear's #1 NYT bestseller on building good habits and breaking bad ones.",
    shortDescription: "Build good habits, break bad ones",
    price: 18.99, discountPrice: 0, category: c["Books"], brand: "Avery",
    stock: 150, gender: "unisex", tags: ["book","habits","self-help"], isFeatured: false,
    images: [{ url: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=500", isMain: true }],
  },
  // ── BIKES ────────────────────────────────────────────────────────────────
  {
    name: "Mountain Bike Pro X", slug: s("mountain-bike-pro",28),
    description: "High-performance mountain bike with 21 speeds and hydraulic disc brakes.",
    shortDescription: "21-speed, hydraulic disc brakes",
    price: 549.99, discountPrice: 449.99, category: c["Bikes"], brand: "TrailKing",
    stock: 12, gender: "unisex", colors: ["Red","Blue","Black"],
    tags: ["bike","mountain","outdoor"], isFeatured: true,
    images: [{ url: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=500", isMain: true }],
  },
  {
    name: "City Commuter Bike", slug: s("city-commuter-bike",29),
    description: "7-speed urban commuter bike with fenders, rack, and LED lights included.",
    shortDescription: "7-speed, fenders, rack, LED lights",
    price: 349.99, discountPrice: 299.99, category: c["Bikes"], brand: "CityRide",
    stock: 8, gender: "unisex", colors: ["Matte Black","Pearl White"],
    tags: ["bike","city","commuter"], isFeatured: false,
    images: [{ url: "https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?w=500", isMain: true }],
  },
  {
    name: "Bike Helmet Safety Pro", slug: s("bike-helmet",30),
    description: "CE certified road/MTB helmet with MIPS protection and 20 ventilation channels.",
    shortDescription: "MIPS, CE certified, 20 vents",
    price: 89.99, discountPrice: 69.99, category: c["Bikes"], brand: "SafeRide",
    stock: 30, gender: "unisex", sizes: ["S","M","L"],
    colors: ["Black","White","Red"], tags: ["helmet","safety","bike"], isFeatured: false,
    images: [{ url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500", isMain: true }],
  },
  // ── GAMES ────────────────────────────────────────────────────────────────
  {
    name: "Gaming Controller Pro", slug: s("gaming-controller",31),
    description: "Wireless gaming controller compatible with PC and consoles. Vibration feedback.",
    shortDescription: "Wireless, vibration, multi-platform",
    price: 59.99, discountPrice: 49.99, category: c["Games"], brand: "GameMax",
    stock: 45, gender: "unisex", colors: ["Black","White","Blue"],
    tags: ["controller","gaming","wireless"], isFeatured: true,
    images: [{ url: "https://images.unsplash.com/photo-1592840496694-26d035b52b48?w=500", isMain: true }],
  },
  {
    name: "Gaming Headset 7.1", slug: s("gaming-headset",32),
    description: "7.1 surround sound gaming headset with noise-cancelling mic and RGB lighting.",
    shortDescription: "7.1 surround, RGB, noise-cancelling mic",
    price: 69.99, discountPrice: 54.99, category: c["Games"], brand: "GameMax",
    stock: 30, gender: "unisex", colors: ["Black","White"],
    tags: ["headset","gaming","audio"], isFeatured: false,
    images: [{ url: "https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=500", isMain: true }],
  },
  // ── KIDS ─────────────────────────────────────────────────────────────────
  {
    name: "Kids Colorful T-Shirt Set", slug: s("kids-tshirt-set",33),
    description: "Set of 3 colorful cotton t-shirts for kids aged 4-12. Pre-shrunk, easy care.",
    shortDescription: "Set of 3, 100% cotton, ages 4-12",
    price: 24.99, discountPrice: 18.99, category: c["Kids"], brand: "KidStyle",
    stock: 100, gender: "kids", sizes: ["4Y","6Y","8Y","10Y","12Y"],
    colors: ["Mixed Colors"], tags: ["kids","t-shirt","cotton"], isFeatured: false,
    images: [{ url: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=500", isMain: true }],
  },
  {
    name: "Kids Sneakers", slug: s("kids-sneakers",34),
    description: "Lightweight kids sneakers with velcro closure. Anti-slip sole, ages 3-10.",
    shortDescription: "Velcro closure, anti-slip, ages 3-10",
    price: 34.99, discountPrice: 24.99, category: c["Kids"], brand: "KidStep",
    stock: 60, gender: "kids", sizes: ["25","26","27","28","29","30","31","32","33"],
    colors: ["Blue","Pink","Red"], tags: ["kids","shoes","sneakers"], isFeatured: false,
    images: [{ url: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=500", isMain: true }],
  },
];

// ─── Seed Function ────────────────────────────────────────────────────────────
const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Clear
    await Promise.all([User.deleteMany({}), Category.deleteMany({}), Product.deleteMany({})]);
    console.log("🗑️  Cleared existing data");

    // Users
    const adminHash = await bcrypt.hash("admin123456", 12);
    const userHash  = await bcrypt.hash("user123456",  12);
    await User.insertMany([
      { name: "Admin",     email: "admin@ecommerce.com", password: adminHash, role: "admin" },
      { name: "Test User", email: "user@ecommerce.com",  password: userHash,  role: "user"  },
    ]);
    console.log("👤 2 users created");

    // Categories
    const createdCats = await Category.create(categoriesData);
    const catMap = {};
    createdCats.forEach((cat) => { catMap[cat.name] = cat._id; });
    console.log(`📦 ${createdCats.length} categories created`);

    // Products
    const products = getProducts(catMap);
    const created  = await Product.insertMany(products, { ordered: false });
    console.log(`🛍️  ${created.length} products created`);

    console.log("\n✅ Database seeded successfully!");
    console.log("─".repeat(40));
    console.log("Admin: admin@ecommerce.com / admin123456");
    console.log("User:  user@ecommerce.com  / user123456");
    console.log("─".repeat(40));
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err.message);
    process.exit(1);
  }
};

seed();
