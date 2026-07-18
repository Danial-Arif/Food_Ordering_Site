const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
const path = require('path');
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
dns.setDefaultResultOrder('ipv4first');

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error('MONGODB_URI is not defined in env');
  process.exit(1);
}

const menuItems = [
  {
    name: 'Wagyu Beef Tartare',
    description: 'Hand-cut wagyu beef with quail egg yolk, capers, cornichons, and truffle aioli on toasted brioche.',
    price: 2800,
    category: 'starters',
    image: 'https://images.unsplash.com/photo-1625943553852-781c6dd46faa?w=800&q=80',
    averageRating: 4.8,
    reviewCount: 24,
    available: true,
  },
  {
    name: 'Charred Octopus',
    description: 'Slow-braised octopus tentacles, charred over open flame, served with chimichurri and roasted potatoes.',
    price: 2400,
    category: 'starters',
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&q=80',
    averageRating: 4.6,
    reviewCount: 18,
    available: true,
  },
  {
    name: 'Burrata & Heirloom Tomato',
    description: 'Creamy burrata with vine-ripened heirloom tomatoes, basil oil, and aged balsamic reduction.',
    price: 1800,
    category: 'starters',
    image: 'https://images.unsplash.com/photo-1608897013039-887f21d8c804?w=800&q=80',
    averageRating: 4.9,
    reviewCount: 31,
    available: true,
  },
  {
    name: 'Truffle Mushroom Risotto',
    description: 'Arborio rice slow-cooked with wild mushrooms, finished with black truffle oil and aged parmesan.',
    price: 3200,
    category: 'mains',
    image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=800&q=80',
    averageRating: 4.7,
    reviewCount: 42,
    available: true,
  },
  {
    name: 'Pan-Seared Salmon',
    description: 'Atlantic salmon with crispy skin, served on a bed of saffron risotto with dill cream sauce.',
    price: 3600,
    category: 'mains',
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&q=80',
    averageRating: 4.8,
    reviewCount: 56,
    available: true,
  },
  {
    name: 'Lamb Shank Tagine',
    description: 'Slow-braised lamb shank with apricots, almonds, and Moroccan spices, served with saffron couscous.',
    price: 3800,
    category: 'mains',
    image: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=800&q=80',
    averageRating: 4.9,
    reviewCount: 38,
    available: true,
  },
  {
    name: 'Grilled Ribeye Steak',
    description: '300g dry-aged ribeye, chargrilled to your preference, with roasted garlic butter and truffle fries.',
    price: 4500,
    category: 'mains',
    image: 'https://images.unsplash.com/photo-1558030006-450675393462?w=800&q=80',
    averageRating: 4.8,
    reviewCount: 67,
    available: true,
  },
  {
    name: 'Miso Glazed Chilean Sea Bass',
    description: 'White miso marinated sea bass, pan-seared and served with bok choy and ginger-scallion sauce.',
    price: 4200,
    category: 'mains',
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&q=80',
    averageRating: 4.7,
    reviewCount: 29,
    available: true,
  },
  {
    name: 'Dark Chocolate Fondant',
    description: 'Warm Valrhona chocolate cake with a molten center, served with vanilla bean ice cream and gold leaf.',
    price: 1600,
    category: 'desserts',
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&q=80',
    averageRating: 4.9,
    reviewCount: 53,
    available: true,
  },
  {
    name: 'Saffron Panna Cotta',
    description: 'Silky saffron-infused panna cotta with pistachio crumble and rose water syrup.',
    price: 1400,
    category: 'desserts',
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&q=80',
    averageRating: 4.6,
    reviewCount: 22,
    available: true,
  },
  {
    name: 'Espresso Martini',
    description: 'Freshly pulled espresso shaken with premium vodka, coffee liqueur, and vanilla syrup.',
    price: 1200,
    category: 'drinks',
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&q=80',
    averageRating: 4.7,
    reviewCount: 34,
    available: true,
  },
  {
    name: 'Elderflower Spritz',
    description: 'Sparkling elderflower tonic with fresh cucumber, mint, and a touch of lime. Non-alcoholic.',
    price: 800,
    category: 'drinks',
    image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=800&q=80',
    averageRating: 4.5,
    reviewCount: 19,
    available: true,
  },
];

async function seed() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    const db = client.db('foodpanada');

    // 1. Seed Admin User
    const adminEmail = 'danialpcr81@gmail.com';
    const adminPassword = '112223333';
    const adminHash = bcrypt.hashSync(adminPassword, 12);

    await db.collection('users').updateOne(
      { email: adminEmail },
      {
        $set: {
          name: 'Danial Admin',
          email: adminEmail,
          password: adminHash,
          role: 'admin',
          updatedAt: new Date(),
        },
        $setOnInsert: {
          createdAt: new Date(),
        },
      },
      { upsert: true }
    );
    console.log('Seeded Admin User successfully');

    // 2. Seed Menu Items
    for (const item of menuItems) {
      await db.collection('menuItems').updateOne(
        { name: item.name },
        {
          $set: {
            ...item,
            updatedAt: new Date(),
          },
          $setOnInsert: {
            createdAt: new Date(),
          },
        },
        { upsert: true }
      );
    }
    console.log('Seeded menu items successfully');
  } catch (err) {
    console.error('Error during seeding:', err);
  } finally {
    await client.close();
    console.log('MongoDB client connection closed.');
  }
}

seed();
