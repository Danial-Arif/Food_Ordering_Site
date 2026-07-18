const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("MONGODB_URI is not defined");
  process.exit(1);
}

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
});
const User = mongoose.models.User || mongoose.model("User", userSchema);

// Menu Schema
const menuSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: "" },
  price: { type: Number, required: true },
  image: { type: String, default: "" },
  category: { type: String, required: true },
  discount: { type: Number, default: 0 },
  stock: { type: Number, default: 100 },
  available: { type: Boolean, default: true },
  averageRating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
});
const Menu = mongoose.models.Menu || mongoose.model("Menu", menuSchema);

const menuItems = [
  {
    name: "Wagyu Beef Tartare",
    description: "Hand-cut wagyu beef with quail egg yolk, capers, cornichons, and truffle aioli on toasted brioche.",
    price: 2800, category: "starters",
    image: "https://images.unsplash.com/photo-1625943553852-781c6dd46faa?w=800&q=80",
    averageRating: 4.8, reviewCount: 24, stock: 50,
  },
  {
    name: "Charred Octopus",
    description: "Slow-braised octopus tentacles, charred over open flame, served with chimichurri and roasted potatoes.",
    price: 2400, category: "starters",
    image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&q=80",
    averageRating: 4.6, reviewCount: 18, stock: 40,
  },
  {
    name: "Burrata & Heirloom Tomato",
    description: "Creamy burrata with vine-ripened heirloom tomatoes, basil oil, and aged balsamic reduction.",
    price: 1800, category: "starters",
    image: "https://images.unsplash.com/photo-1608897013039-887f21d8c804?w=800&q=80",
    averageRating: 4.9, reviewCount: 31, stock: 60,
  },
  {
    name: "Truffle Mushroom Risotto",
    description: "Arborio rice slow-cooked with wild mushrooms, finished with black truffle oil and aged parmesan.",
    price: 3200, category: "mains",
    image: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=800&q=80",
    averageRating: 4.7, reviewCount: 42, stock: 30,
  },
  {
    name: "Pan-Seared Salmon",
    description: "Atlantic salmon with crispy skin, served on a bed of saffron risotto with dill cream sauce.",
    price: 3600, category: "mains",
    image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&q=80",
    averageRating: 4.8, reviewCount: 56, stock: 25,
  },
  {
    name: "Lamb Shank Tagine",
    description: "Slow-braised lamb shank with apricots, almonds, and Moroccan spices, served with saffron couscous.",
    price: 3800, category: "mains",
    image: "https://images.unsplash.com/photo-1574484284002-952d92456975?w=800&q=80",
    averageRating: 4.9, reviewCount: 38, stock: 20,
  },
  {
    name: "Grilled Ribeye Steak",
    description: "300g dry-aged ribeye, chargrilled to your preference, with roasted garlic butter and truffle fries.",
    price: 4500, category: "mains",
    image: "https://images.unsplash.com/photo-1558030006-450675393462?w=800&q=80",
    averageRating: 4.8, reviewCount: 67, stock: 15,
  },
  {
    name: "Miso Glazed Chilean Sea Bass",
    description: "White miso marinated sea bass, pan-seared and served with bok choy and ginger-scallion sauce.",
    price: 4200, category: "mains",
    image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&q=80",
    averageRating: 4.7, reviewCount: 29, stock: 20,
  },
  {
    name: "Dark Chocolate Fondant",
    description: "Warm Valrhona chocolate cake with a molten center, served with vanilla bean ice cream and gold leaf.",
    price: 1600, category: "desserts",
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&q=80",
    averageRating: 4.9, reviewCount: 53, stock: 40,
  },
  {
    name: "Saffron Panna Cotta",
    description: "Silky saffron-infused panna cotta with pistachio crumble and rose water syrup.",
    price: 1400, category: "desserts",
    image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&q=80",
    averageRating: 4.6, reviewCount: 22, stock: 35,
  },
  {
    name: "Espresso Martini",
    description: "Freshly pulled espresso shaken with premium vodka, coffee liqueur, and vanilla syrup.",
    price: 1200, category: "drinks",
    image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&q=80",
    averageRating: 4.7, reviewCount: 34, stock: 100,
  },
  {
    name: "Elderflower Spritz",
    description: "Sparkling elderflower tonic with fresh cucumber, mint, and a touch of lime. Non-alcoholic.",
    price: 800, category: "drinks",
    image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=800&q=80",
    averageRating: 4.5, reviewCount: 19, stock: 100,
  },
];

async function run() {
  try {
    const dns = require("dns");
    dns.setServers(["8.8.8.8", "8.8.4.4"]);
    dns.setDefaultResultOrder("ipv4first");

    console.log("Connecting to MongoDB via Mongoose...");
    await mongoose.connect(MONGODB_URI);
    console.log("Connected successfully.");

    // 1. Seed Admin
    const adminEmail = "danialpcr81@gmail.com";
    const salt = bcrypt.genSaltSync(12);
    const hash = bcrypt.hashSync("112223333", salt);

    await User.findOneAndUpdate(
      { email: adminEmail },
      {
        $set: {
          name: "Danial Admin",
          email: adminEmail,
          password: hash,
          role: "admin",
        },
      },
      { upsert: true, new: true }
    );
    console.log("Seeded admin user.");

    // 2. Seed Menu
    for (const item of menuItems) {
      await Menu.findOneAndUpdate(
        { name: item.name },
        { $set: item },
        { upsert: true, new: true }
      );
    }
    console.log("Seeded all menu items.");
  } catch (error) {
    console.error("Seeding failed:", error);
  } finally {
    await mongoose.connection.close();
    console.log("Connection closed.");
  }
}

run();
