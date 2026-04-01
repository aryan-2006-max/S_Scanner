const { pool, initDatabase } = require('./db');

async function seed() {
  console.log('🌱 Seeding MySQL database...\n');

  try {
    // Initialize tables
    await initDatabase();

    // Clear existing data (order matters for foreign keys)
    await pool.query('DELETE FROM order_items');
    await pool.query('DELETE FROM orders');
    await pool.query('DELETE FROM products');
    await pool.query('DELETE FROM stores');
    await pool.query('DELETE FROM offers');

    // ─── Stores ───
    const stores = [
      ['DMart Hyper', 'DMart', 'Koramangala', 'Bangalore', '80 Feet Road, Koramangala, Bangalore - 560034', 'https://logo.clearbit.com/dmartindia.com', 4.3],
      ['Reliance Fresh', 'Reliance', 'Indiranagar', 'Bangalore', '100 Feet Road, Indiranagar, Bangalore - 560038', 'https://logo.clearbit.com/reliancefresh.co.in', 4.1],
      ['BigBazaar Central', 'BigBazaar', 'MG Road', 'Bangalore', 'MG Road Metro Station, Bangalore - 560001', 'https://logo.clearbit.com/bigbazaar.com', 4.0],
      ['More Supermarket', 'More', 'Whitefield', 'Bangalore', 'ITPL Main Road, Whitefield, Bangalore - 560066', 'https://logo.clearbit.com/moreretail.in', 3.9],
      ['DMart Ready', 'DMart', 'Andheri West', 'Mumbai', 'Lokhandwala Complex, Andheri West, Mumbai - 400053', 'https://logo.clearbit.com/dmartindia.com', 4.2],
      ['Reliance Smart', 'Reliance', 'Powai', 'Mumbai', 'Hiranandani Gardens, Powai, Mumbai - 400076', 'https://logo.clearbit.com/reliancefresh.co.in', 4.0],
      ['Star Bazaar', 'Star Bazaar', 'Banjara Hills', 'Hyderabad', 'Road No 12, Banjara Hills, Hyderabad - 500034', 'https://logo.clearbit.com/starbazaar.com', 4.1],
      ["Spencer's", "Spencer's", 'T Nagar', 'Chennai', 'Usman Road, T Nagar, Chennai - 600017', 'https://logo.clearbit.com/spencers.in', 3.8],
    ];

    const storeIds = {};
    for (const s of stores) {
      const [result] = await pool.query(
        'INSERT INTO stores (name, brand, location, city, address, image_url, rating) VALUES (?, ?, ?, ?, ?, ?, ?)',
        s
      );
      storeIds[s[0]] = result.insertId;
    }
    console.log(`✅ Inserted ${stores.length} stores`);

    // ─── Products (Amazon-style items for testing) ───
    const products = [
      ['8901030793912', 'Aashirvaad Atta (5kg)', 'Whole wheat flour, made from finest grains', 269.00, 'Grocery', 'https://m.media-amazon.com/images/I/71gOLg6eVxL._SX679_.jpg', storeIds['DMart Hyper']],
      ['8901725183004', 'Tata Salt (1kg)', 'Iodized salt for everyday cooking', 28.00, 'Grocery', 'https://m.media-amazon.com/images/I/61MGbMIeJBL._SX679_.jpg', storeIds['DMart Hyper']],
      ['8901063024144', 'Maggi 2-Minute Noodles (Pack of 12)', 'Instant noodles with masala flavor', 168.00, 'Food', 'https://m.media-amazon.com/images/I/81EebGFthvL._SX679_.jpg', storeIds['DMart Hyper']],
      ['8906002830565', 'Fortune Sunflower Oil (1L)', 'Refined sunflower cooking oil', 145.00, 'Grocery', 'https://m.media-amazon.com/images/I/61-B1MtqXhL._SX679_.jpg', storeIds['Reliance Fresh']],
      ['8901102117200', 'Parle-G Gold Biscuits (1kg)', "India's favorite glucose biscuit", 110.00, 'Snacks', 'https://m.media-amazon.com/images/I/51U9HnHdRKL._SX679_.jpg', storeIds['Reliance Fresh']],
      ['8902080700202', 'Coca-Cola (750ml)', 'Refreshing carbonated beverage', 38.00, 'Beverages', 'https://m.media-amazon.com/images/I/51v8nyxSOYL._SX679_.jpg', storeIds['BigBazaar Central']],
      ['8901030719684', 'Amul Taaza Milk (1L)', 'Toned fresh milk', 60.00, 'Dairy', 'https://m.media-amazon.com/images/I/61Qa5MDVBdL._SX679_.jpg', storeIds['BigBazaar Central']],
      ['8901595023052', 'Red Bull Energy (250ml)', 'Energy drink that gives you wings', 125.00, 'Beverages', 'https://m.media-amazon.com/images/I/51SJbYQW+ZL._SX679_.jpg', storeIds['More Supermarket']],
      ['8901314010117', 'Dove Soap (100g)', 'Moisturizing beauty bathing bar', 55.00, 'Personal Care', 'https://m.media-amazon.com/images/I/417VMql59RL._SX679_.jpg', storeIds['DMart Ready']],
      ['8901030020001', 'Colgate MaxFresh Toothpaste', 'Cooling crystals for fresh breath', 95.00, 'Personal Care', 'https://m.media-amazon.com/images/I/51MaTPvuwxL._SX679_.jpg', storeIds['DMart Ready']],
      ['8901057020602', 'Head & Shoulders Shampoo (340ml)', 'Anti-dandruff shampoo', 340.00, 'Personal Care', 'https://m.media-amazon.com/images/I/51A3QCuBKlL._SX679_.jpg', storeIds['Reliance Smart']],
      ['8901491101769', "Lay's Classic Salted (52g)", 'Crispy potato chips', 20.00, 'Snacks', 'https://m.media-amazon.com/images/I/71FmGTV55OL._SX679_.jpg', storeIds['Star Bazaar']],
      ['8901063157002', 'KitKat (50g)', 'Wafer chocolate bar — have a break!', 40.00, 'Snacks', 'https://m.media-amazon.com/images/I/71Lm3h4PgaL._SL1500_.jpg', storeIds['Star Bazaar']],
      ['8902080710591', 'Haldiram Aloo Bhujia (400g)', 'Traditional Indian snack', 90.00, 'Snacks', 'https://m.media-amazon.com/images/I/71RHNQz8dsL._SX679_.jpg', storeIds["Spencer's"]],
      ['8901058850024', 'Vim Dishwash Liquid (500ml)', 'Powerful grease cutting formula', 95.00, 'Home', 'https://m.media-amazon.com/images/I/61b1C2M7D3L._SX679_.jpg', storeIds["Spencer's"]],
      ['8901399115455', 'Surf Excel Liquid (1.05L)', 'Top-load & front-load washing liquid', 259.00, 'Home', 'https://m.media-amazon.com/images/I/61N2K5jdCdL._SX679_.jpg', storeIds['DMart Hyper']],
      ['0012345678905', 'Amazon Echo Dot (5th Gen)', 'Smart speaker with Alexa — Charcoal', 4499.00, 'Electronics', 'https://m.media-amazon.com/images/I/518cRYanpbL._SX679_.jpg', storeIds['Reliance Fresh']],
      ['0012345678912', 'Amazon Fire TV Stick 4K', 'Streaming media player with Alexa voice remote', 3999.00, 'Electronics', 'https://m.media-amazon.com/images/I/51TjJOTfslL._SX679_.jpg', storeIds['BigBazaar Central']],
      ['0012345678929', 'Kindle Paperwhite (16GB)', '6.8" display with adjustable warm light', 13999.00, 'Electronics', 'https://m.media-amazon.com/images/I/61lqSyCm3jL._SX679_.jpg', storeIds['More Supermarket']],
    ];

    for (const p of products) {
      await pool.query(
        'INSERT INTO products (barcode, name, description, price, category, image_url, store_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
        p
      );
    }
    console.log(`✅ Inserted ${products.length} products`);

    // ─── Offers ───
    const offers = [
      ['Welcome Offer 🎉', 'Get 15% off on your first order!', 15, 200, 'WELCOME15', '2026-12-31 23:59:59'],
      ['Summer Sale ☀️', 'Flat 10% off on orders above ₹500', 10, 500, 'SUMMER10', '2026-06-30 23:59:59'],
      ['Mega Saver 💰', '20% discount on orders above ₹1000', 20, 1000, 'MEGA20', '2026-12-31 23:59:59'],
      ['Weekend Special 🛒', '5% off — no minimum order!', 5, 0, 'WEEKEND5', '2026-12-31 23:59:59'],
      ['Express Checkout ⚡', 'Flat 12% off on orders above ₹750', 12, 750, 'EXPRESS12', '2026-09-30 23:59:59'],
    ];

    for (const o of offers) {
      await pool.query(
        'INSERT INTO offers (title, description, discount_percent, min_order, code, valid_until) VALUES (?, ?, ?, ?, ?, ?)',
        o
      );
    }
    console.log(`✅ Inserted ${offers.length} offers`);

    console.log('\n🎉 MySQL database seeded successfully!\n');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding error:', err.message);
    process.exit(1);
  }
}

seed();
