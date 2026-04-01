const express = require('express');
const { pool } = require('../db');

const router = express.Router();

// GET /api/stores — list all stores, optionally filter by city
router.get('/', async (req, res) => {
  try {
    const { city } = req.query;
    let rows;
    if (city) {
      [rows] = await pool.query('SELECT * FROM stores WHERE LOWER(city) = LOWER(?) ORDER BY name', [city]);
    } else {
      [rows] = await pool.query('SELECT * FROM stores ORDER BY city, name');
    }
    res.json({ stores: rows });
  } catch (err) {
    console.error('Stores error:', err);
    res.status(500).json({ error: 'Failed to fetch stores.' });
  }
});

// GET /api/stores/cities — list unique cities
router.get('/cities', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT DISTINCT city FROM stores ORDER BY city');
    res.json({ cities: rows.map(c => c.city) });
  } catch (err) {
    console.error('Cities error:', err);
    res.status(500).json({ error: 'Failed to fetch cities.' });
  }
});

// GET /api/stores/:id — get single store
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM stores WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Store not found.' });
    res.json({ store: rows[0] });
  } catch (err) {
    console.error('Store error:', err);
    res.status(500).json({ error: 'Failed to fetch store.' });
  }
});

module.exports = router;
