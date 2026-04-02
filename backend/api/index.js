const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { initDatabase } = require('../db');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(express.json());

// Initialize DB on first request (cold start)
let dbReady = false;
app.use(async (req, res, next) => {
  if (!dbReady) {
    try {
      await initDatabase();
      dbReady = true;
      console.log('✅ Database ready');
    } catch (err) {
      console.error('⚠️ DB init error:', err.message);
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
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', database: 'mysql', timestamp: new Date().toISOString() });
});

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found.' });
});

// Export for Vercel serverless
module.exports = app;
