const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// CORS Middleware - must be before all routes
const corsOptions = {
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};
app.use(cors(corsOptions));

// Explicitly handle preflight OPTIONS requests for all routes
app.options('*', cors(corsOptions));

app.use(express.json());

// Initialize DB once per cold start
let dbReady = false;
app.use(async (req, res, next) => {
  if (!dbReady) {
    try {
      const { initDatabase } = require('../db');
      await initDatabase();
      dbReady = true;
    } catch (err) {
      console.error('DB init error:', err.message);
      // Don't block - let routes handle their own DB errors
    }
  }
  next();
});

// Routes
app.use('/api/auth', require('../routes/auth'));
app.use('/api/stores', require('../routes/stores'));
app.use('/api/products', require('../routes/products'));
app.use('/api/orders', require('../routes/orders'));
app.use('/api/offers', require('../routes/offers'));

// Health check
app.get('/api/health', async (req, res) => {
  try {
    const { pool } = require('../db');
    await pool.query('SELECT 1');
    res.json({ status: 'ok', database: 'connected', timestamp: new Date().toISOString() });
  } catch (err) {
    res.json({ status: 'ok', database: 'disconnected', error: err.message, timestamp: new Date().toISOString() });
  }
});

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found.', path: req.url });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error.' });
});

// Export for Vercel
module.exports = app;
