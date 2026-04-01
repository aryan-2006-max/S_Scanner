const express = require('express');
const { pool } = require('../db');
const auth = require('../middleware/auth');
const crypto = require('crypto');

const router = express.Router();

// POST /api/orders — create a new order
router.post('/', auth, async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const { items, store_id, payment_method, offer_code } = req.body;

    if (!items || !items.length) {
      return res.status(400).json({ error: 'Cart is empty.' });
    }
    if (!payment_method) {
      return res.status(400).json({ error: 'Payment method is required.' });
    }

    await conn.beginTransaction();

    // Calculate totals
    let subtotal = 0;
    for (const item of items) {
      const [rows] = await conn.query('SELECT * FROM products WHERE id = ?', [item.product_id]);
      if (rows.length === 0) {
        await conn.rollback();
        return res.status(404).json({ error: `Product ID ${item.product_id} not found.` });
      }
      const qty = item.quantity || 1;
      subtotal += rows[0].price * qty;
    }

    // Apply offer discount
    let discount = 0;
    if (offer_code) {
      const [offerRows] = await conn.query(
        'SELECT * FROM offers WHERE code = ? AND active = 1', [offer_code]
      );
      const offer = offerRows[0];
      if (offer && subtotal >= (offer.min_order || 0)) {
        discount = Math.round((subtotal * offer.discount_percent) / 100 * 100) / 100;
      }
    }

    // GST calculation (18% — 9% CGST + 9% SGST)
    const gstRate = 0.18;
    const taxableAmount = subtotal - discount;
    const gst_amount = Math.round(taxableAmount * gstRate * 100) / 100;
    const grand_total = Math.round((taxableAmount + gst_amount) * 100) / 100;

    const transaction_id = 'TXN' + Date.now() + crypto.randomBytes(3).toString('hex').toUpperCase();

    // Insert order
    const [orderResult] = await conn.query(`
      INSERT INTO orders (user_id, store_id, subtotal, gst_amount, discount, grand_total, payment_method, payment_status, transaction_id, offer_code)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'completed', ?, ?)
    `, [
      req.user.id,
      store_id || null,
      Math.round(subtotal * 100) / 100,
      gst_amount,
      Math.round(discount * 100) / 100,
      grand_total,
      payment_method,
      transaction_id,
      offer_code || null
    ]);

    const orderId = orderResult.insertId;

    // Insert order items
    for (const item of items) {
      const [prodRows] = await conn.query('SELECT price FROM products WHERE id = ?', [item.product_id]);
      await conn.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
        [orderId, item.product_id, item.quantity || 1, prodRows[0].price]
      );
    }

    await conn.commit();

    // Fetch complete order
    const [orderRows] = await pool.query('SELECT * FROM orders WHERE id = ?', [orderId]);
    const [orderItems] = await pool.query(`
      SELECT oi.*, p.name, p.barcode, p.category, p.image_url
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ?
    `, [orderId]);

    res.status(201).json({
      message: 'Order placed successfully!',
      order: { ...orderRows[0], items: orderItems }
    });
  } catch (err) {
    await conn.rollback();
    console.error('Order creation error:', err);
    res.status(500).json({ error: 'Failed to create order.' });
  } finally {
    conn.release();
  }
});

// GET /api/orders — list user's orders
router.get('/', auth, async (req, res) => {
  try {
    const [orders] = await pool.query(`
      SELECT o.*, s.name as store_name, s.brand as store_brand,
        (SELECT COUNT(*) FROM order_items WHERE order_id = o.id) as item_count
      FROM orders o
      LEFT JOIN stores s ON o.store_id = s.id
      WHERE o.user_id = ?
      ORDER BY o.created_at DESC
    `, [req.user.id]);

    res.json({ orders });
  } catch (err) {
    console.error('Orders fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch orders.' });
  }
});

// GET /api/orders/:id — get order detail
router.get('/:id', auth, async (req, res) => {
  try {
    const [orderRows] = await pool.query(`
      SELECT o.*, s.name as store_name, s.brand as store_brand, s.address as store_address
      FROM orders o
      LEFT JOIN stores s ON o.store_id = s.id
      WHERE o.id = ? AND o.user_id = ?
    `, [req.params.id, req.user.id]);

    if (orderRows.length === 0) {
      return res.status(404).json({ error: 'Order not found.' });
    }

    const [items] = await pool.query(`
      SELECT oi.*, p.name, p.barcode, p.category, p.image_url, p.description
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ?
    `, [orderRows[0].id]);

    res.json({ order: { ...orderRows[0], items } });
  } catch (err) {
    console.error('Order detail error:', err);
    res.status(500).json({ error: 'Failed to fetch order details.' });
  }
});

module.exports = router;
