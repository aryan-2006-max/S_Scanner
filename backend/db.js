const mysql = require('mysql2/promise');
require('dotenv').config();

const DB_NAME = process.env.DB_NAME || 'smart_checkout';

// ─── MySQL Connection Pool ───
const poolConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 30000,
};

// Add SSL for remote databases (Railway, PlanetScale, etc.)
if (process.env.DB_HOST && process.env.DB_HOST !== 'localhost' && process.env.DB_HOST !== '127.0.0.1') {
  poolConfig.ssl = { rejectUnauthorized: false };
  console.log('🔒 SSL enabled for remote MySQL');
}

const pool = mysql.createPool(poolConfig);

// ─── Initialize Database Tables ───
async function initDatabase() {
  console.log(`📡 Connecting to MySQL at ${poolConfig.host}:${poolConfig.port}...`);

  // Step 1: Connect WITHOUT database to create it
  const initConfig = { ...poolConfig };
  delete initConfig.database;
  delete initConfig.connectionLimit;
  delete initConfig.waitForConnections;
  delete initConfig.queueLimit;

  const tempConn = await mysql.createConnection(initConfig);
  await tempConn.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\``);
  await tempConn.end();
  console.log(`📁 Database '${DB_NAME}' ready`);

  // Step 2: Create tables
  const conn = await pool.getConnection();
  try {
    await conn.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(20),
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS stores (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        brand VARCHAR(255) NOT NULL,
        location VARCHAR(255),
        city VARCHAR(100) NOT NULL,
        address VARCHAR(500),
        image_url VARCHAR(500),
        rating DECIMAL(2,1) DEFAULT 4.0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        barcode VARCHAR(50) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10,2) NOT NULL,
        category VARCHAR(100),
        image_url VARCHAR(500),
        store_id INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE SET NULL
      )
    `);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        store_id INT,
        subtotal DECIMAL(10,2) NOT NULL,
        gst_amount DECIMAL(10,2) NOT NULL,
        discount DECIMAL(10,2) DEFAULT 0,
        grand_total DECIMAL(10,2) NOT NULL,
        payment_method VARCHAR(50) NOT NULL,
        payment_status VARCHAR(50) DEFAULT 'completed',
        transaction_id VARCHAR(100),
        offer_code VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE SET NULL
      )
    `);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_id INT NOT NULL,
        product_id INT NOT NULL,
        quantity INT NOT NULL DEFAULT 1,
        price DECIMAL(10,2) NOT NULL,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
      )
    `);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS offers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        discount_percent DECIMAL(5,2) NOT NULL,
        min_order DECIMAL(10,2) DEFAULT 0,
        code VARCHAR(50) UNIQUE NOT NULL,
        valid_until DATETIME,
        active TINYINT(1) DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('✅ All tables created successfully');
  } finally {
    conn.release();
  }
}

module.exports = { pool, initDatabase };
