const express = require('express');
const { pool } = require('../db');

const router = express.Router();

// GET /api/products/barcode/:code — lookup product by barcode
router.get('/barcode/:code', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT p.*, s.name as store_name, s.brand as store_brand
      FROM products p
      LEFT JOIN stores s ON p.store_id = s.id
      WHERE p.barcode = ?
    `, [req.params.code]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Product not found. Please check the barcode.' });
    }
    res.json({ product: rows[0] });
  } catch (err) {
    console.error('Barcode lookup error:', err);
    res.status(500).json({ error: 'Failed to lookup product.' });
  }
});

// GET /api/products/store/:storeId — list products by store
router.get('/store/:storeId', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM products WHERE store_id = ? ORDER BY category, name', [req.params.storeId]);
    res.json({ products: rows });
  } catch (err) {
    console.error('Products error:', err);
    res.status(500).json({ error: 'Failed to fetch products.' });
  }
});

// GET /api/products — list all products
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT p.*, s.name as store_name
      FROM products p
      LEFT JOIN stores s ON p.store_id = s.id
      ORDER BY p.name
    `);
    res.json({ products: rows });
  } catch (err) {
    console.error('Products error:', err);
    res.status(500).json({ error: 'Failed to fetch products.' });
  }
});

module.exports = router;
