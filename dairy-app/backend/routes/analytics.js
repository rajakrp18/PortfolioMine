// routes/analytics.js
// Admin-only analytics & dashboard data
//
// GET /api/analytics/dashboard   — KPI summary cards
// GET /api/analytics/revenue     — revenue over time (daily/monthly)
// GET /api/analytics/top-products — best sellers
// GET /api/analytics/farmers     — farmer performance
// GET /api/analytics/buyers      — buyer breakdown

const express = require('express');
const pool    = require('../config/db');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// ── GET /api/analytics/dashboard ─────────────────────────────
router.get('/dashboard', auth, authorize('admin'), async (req, res) => {
  try {
    const [
      todayMilk, pendingOrders, totalRevenue,
      activeAgents, lowStock, farmerPayable, newUsers
    ] = await Promise.all([
      // Today's milk collected (liters)
      pool.query(
        `SELECT COALESCE(SUM(quantity_liters),0) AS value
         FROM milk_collections WHERE collection_date = CURRENT_DATE`
      ),
      // Pending orders count
      pool.query(
        `SELECT COUNT(*) AS value FROM orders
         WHERE status IN ('pending','confirmed','processing')`
      ),
      // Total revenue this month
      pool.query(
        `SELECT COALESCE(SUM(final_amount),0) AS value FROM orders
         WHERE status != 'cancelled'
         AND DATE_TRUNC('month',created_at) = DATE_TRUNC('month',NOW())`
      ),
      // Active delivery agents
      pool.query(
        `SELECT COUNT(*) AS value FROM users
         WHERE role='delivery_agent' AND is_active=TRUE`
      ),
      // Low stock products (< 20 units)
      pool.query(
        `SELECT COUNT(*) AS value FROM (
           SELECT p.id FROM products p
           LEFT JOIN inventory inv ON inv.product_id = p.id
           WHERE p.is_active=TRUE
           GROUP BY p.id
           HAVING COALESCE(SUM(inv.quantity),0) < 20
         ) sq`
      ),
      // Pending farmer payments
      pool.query(
        `SELECT COALESCE(SUM(amount),0) AS value FROM milk_collections
         WHERE payment_status = 'pending'`
      ),
      // New users this week
      pool.query(
        `SELECT COUNT(*) AS value FROM users
         WHERE created_at >= NOW() - INTERVAL '7 days'`
      ),
    ]);

    res.json({
      today_milk_liters:     parseFloat(todayMilk.rows[0].value),
      pending_orders:        parseInt(pendingOrders.rows[0].value),
      monthly_revenue:       parseFloat(totalRevenue.rows[0].value),
      active_agents:         parseInt(activeAgents.rows[0].value),
      low_stock_products:    parseInt(lowStock.rows[0].value),
      pending_farmer_payout: parseFloat(farmerPayable.rows[0].value),
      new_users_week:        parseInt(newUsers.rows[0].value),
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// ── GET /api/analytics/revenue?period=daily|monthly ──────────
router.get('/revenue', auth, authorize('admin'), async (req, res) => {
  const period = req.query.period === 'monthly' ? 'month' : 'day';
  const days   = parseInt(req.query.days || 30);

  try {
    const { rows } = await pool.query(
      `SELECT
         DATE_TRUNC($1, created_at) AS period,
         COALESCE(SUM(final_amount),0) AS revenue,
         COUNT(*) AS orders
       FROM orders
       WHERE status != 'cancelled'
         AND created_at >= NOW() - INTERVAL '${days} days'
       GROUP BY DATE_TRUNC($1, created_at)
       ORDER BY period`,
      [period]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ── GET /api/analytics/top-products ──────────────────────────
router.get('/top-products', auth, authorize('admin'), async (req, res) => {
  const limit = parseInt(req.query.limit || 10);
  try {
    const { rows } = await pool.query(
      `SELECT p.name, p.sku, p.unit,
              SUM(oi.quantity)             AS total_sold,
              SUM(oi.subtotal)             AS total_revenue,
              COUNT(DISTINCT o.buyer_id)   AS unique_buyers
       FROM order_items oi
       JOIN products p ON p.id = oi.product_id
       JOIN orders o   ON o.id = oi.order_id
       WHERE o.status != 'cancelled'
       GROUP BY p.id
       ORDER BY total_revenue DESC
       LIMIT $1`,
      [limit]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ── GET /api/analytics/buyers ─────────────────────────────────
router.get('/buyers', auth, authorize('admin'), async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT buyer_role,
              COUNT(DISTINCT buyer_id)   AS buyer_count,
              COUNT(*)                   AS order_count,
              COALESCE(SUM(final_amount),0) AS total_revenue,
              COALESCE(AVG(final_amount),0) AS avg_order_value
       FROM orders
       WHERE status != 'cancelled'
       GROUP BY buyer_role
       ORDER BY total_revenue DESC`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ── GET /api/analytics/milk-trend ────────────────────────────
router.get('/milk-trend', auth, authorize('admin'), async (req, res) => {
  const days = parseInt(req.query.days || 14);
  try {
    const { rows } = await pool.query(
      `SELECT collection_date,
              SUM(CASE WHEN shift='AM' THEN quantity_liters ELSE 0 END) AS am_liters,
              SUM(CASE WHEN shift='PM' THEN quantity_liters ELSE 0 END) AS pm_liters,
              SUM(quantity_liters)    AS total_liters,
              AVG(fat_percentage)     AS avg_fat,
              COUNT(DISTINCT farmer_id) AS farmers
       FROM milk_collections
       WHERE collection_date >= CURRENT_DATE - $1
       GROUP BY collection_date
       ORDER BY collection_date`,
      [days]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
