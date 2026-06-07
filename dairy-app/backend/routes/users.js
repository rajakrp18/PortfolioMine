// routes/users.js
// Admin user management + notifications
//
// GET  /api/users                — admin: list all users (filterable by role)
// GET  /api/users/:id            — admin: single user
// PUT  /api/users/:id/toggle     — admin: activate / deactivate user
// GET  /api/users/notifications  — current user's notifications
// PUT  /api/users/notifications/read — mark all as read

const express = require('express');
const pool    = require('../config/db');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// ── GET /api/users — admin ────────────────────────────────────
router.get('/', auth, authorize('admin'), async (req, res) => {
  const { role, search } = req.query;
  const params = [];
  let where = 'WHERE 1=1';

  if (role)   where += ` AND role = $${params.push(role)}`;
  if (search) where += ` AND (name ILIKE $${params.push('%'+search+'%')} OR email ILIKE $${params.push('%'+search+'%')})`;

  try {
    const { rows } = await pool.query(
      `SELECT id,name,email,role,phone,city,state,is_active,created_at
       FROM users ${where} ORDER BY created_at DESC`,
      params
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ── GET /api/users/:id — admin ────────────────────────────────
router.get('/:id', auth, authorize('admin'), async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT u.id,u.name,u.email,u.role,u.phone,u.address,
              u.city,u.state,u.pincode,u.is_active,u.created_at,
              fp.farm_name,fp.farm_location,fp.cattle_count,
              fp.land_acres,fp.verified AS farmer_verified
       FROM users u
       LEFT JOIN farmer_profiles fp ON fp.user_id = u.id
       WHERE u.id = $1`,
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'User not found' });

    // Order stats
    const { rows: stats } = await pool.query(
      `SELECT COUNT(*) AS total_orders, COALESCE(SUM(final_amount),0) AS total_spent
       FROM orders WHERE buyer_id = $1 AND status != 'cancelled'`,
      [req.params.id]
    );

    res.json({ ...rows[0], ...stats[0] });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ── PUT /api/users/:id/toggle — admin activate/deactivate ─────
router.put('/:id/toggle', auth, authorize('admin'), async (req, res) => {
  try {
    const { rows } = await pool.query(
      `UPDATE users SET is_active = NOT is_active, updated_at=NOW()
       WHERE id = $1 RETURNING id, name, is_active`,
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'User not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ── PUT /api/users/:id/verify-farmer — admin verify farmer ────
router.put('/:id/verify-farmer', auth, authorize('admin'), async (req, res) => {
  try {
    await pool.query(
      'UPDATE farmer_profiles SET verified=TRUE WHERE user_id=$1',
      [req.params.id]
    );
    res.json({ message: 'Farmer verified' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ── GET /api/users/notifications — current user ───────────────
router.get('/notifications/me', auth, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT * FROM notifications WHERE user_id=$1
       ORDER BY created_at DESC LIMIT 50`,
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ── PUT /api/users/notifications/read — mark all read ─────────
router.put('/notifications/read', auth, async (req, res) => {
  await pool.query(
    'UPDATE notifications SET is_read=TRUE WHERE user_id=$1',
    [req.user.id]
  );
  res.json({ message: 'All notifications marked as read' });
});

module.exports = router;
