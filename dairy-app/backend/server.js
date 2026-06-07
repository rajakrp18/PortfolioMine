// server.js — Dairy Management System API
// Entry point — mounts all routes and starts Express server

require('dotenv').config();
const express = require('express');
const cors    = require('cors');

// ── Route modules ─────────────────────────────────────────────
const authRoutes        = require('./routes/auth');
const userRoutes        = require('./routes/users');
const collectionRoutes  = require('./routes/collections');
const productRoutes     = require('./routes/products');
const orderRoutes       = require('./routes/orders');
const deliveryRoutes    = require('./routes/deliveries');
const analyticsRoutes   = require('./routes/analytics');

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ────────────────────────────────────────────────
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Request logger (dev only) ─────────────────────────────────
if (process.env.NODE_ENV !== 'production') {
  app.use((req, _res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
  });
}

// ── Health check ──────────────────────────────────────────────
app.get('/health', (_req, res) => res.json({ status: 'ok', version: '2.0.0' }));

// ── API Routes ────────────────────────────────────────────────
app.use('/api/auth',        authRoutes);
app.use('/api/users',       userRoutes);
app.use('/api/collections', collectionRoutes);  // milk sourcing
app.use('/api/products',    productRoutes);      // catalog + inventory
app.use('/api/orders',      orderRoutes);        // all buyer orders
app.use('/api/deliveries',  deliveryRoutes);     // agent tasks
app.use('/api/analytics',   analyticsRoutes);    // admin reports

// ── 404 handler ───────────────────────────────────────────────
app.use((_req, res) => res.status(404).json({ error: 'Route not found' }));

// ── Global error handler ──────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// ── Start ─────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🥛 Dairy API running on port ${PORT}`);
  console.log(`📊 Dashboard: http://localhost:${PORT}/health`);
});
