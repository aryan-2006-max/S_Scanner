const express = require('express');
const { pool } = require('../db');

const router = express.Router();

// GET /api/offers — list active offers
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT * FROM offers 
      WHERE active = 1 AND (valid_until IS NULL OR valid_until > NOW())
      ORDER BY discount_percent DESC
    `);
    res.json({ offers: rows });
  } catch (err) {
    console.error('Offers error:', err);
    res.status(500).json({ error: 'Failed to fetch offers.' });
  }
});

// POST /api/offers/validate — check if offer code is valid
router.post('/validate', async (req, res) => {
  try {
    const { code, order_total } = req.body;
    if (!code) return res.status(400).json({ error: 'Offer code is required.' });

    const [rows] = await pool.query(`
      SELECT * FROM offers 
      WHERE code = ? AND active = 1 AND (valid_until IS NULL OR valid_until > NOW())
    `, [code]);

    const offer = rows[0];
    if (!offer) {
      return res.status(404).json({ error: 'Invalid or expired offer code.' });
    }

    if (order_total && order_total < offer.min_order) {
      return res.status(400).json({ 
        error: `Minimum order of ₹${offer.min_order} required for this offer.`,
        min_order: offer.min_order 
      });
    }

    const discount = order_total ? Math.round((order_total * offer.discount_percent) / 100 * 100) / 100 : 0;

    res.json({ 
      valid: true, 
      offer, 
      discount,
      message: `${offer.discount_percent}% off applied! You save ₹${discount}`
    });
  } catch (err) {
    console.error('Offer validation error:', err);
    res.status(500).json({ error: 'Failed to validate offer.' });
  }
});

module.exports = router;
