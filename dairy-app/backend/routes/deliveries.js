// routes/deliveries.js
// Delivery agent task management
//
// GET  /api/deliveries               — agent: own tasks | admin: all
// GET  /api/deliveries/:id           — single delivery detail
// PUT  /api/deliveries/:id/status    — agent: update own delivery status
// GET  /api/deliveries/agents/list   — admin: list all delivery agents

const express = require('express');
const pool    = require('../config/db');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// ── GET /api/deliveries — role-aware list ─────────────────────
router.get('/', auth, async (req, res) => {
  const { status } = req.query;
  const params = [];
  const conditions = [];

  // Delivery agents only see their own assignments
  if (req.user.role === 'delivery_agent') {
    conditions.push(`d.agent_id = $${params.push(req.user.id)}`);
  } else if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden' });
  }

  if (status) conditions.push(`d.status = $${params.push(status)}`);

  const where = conditions.length ? 'WHERE ' + conditions.join(' AND ') : '';

  try {
    const { rows } = await pool.query(
      `SELECT d.*,
              o.buyer_role,
              o.delivery_address,
              o.final_amount,
              o.payment_method,
              o.payment_status,
              buyer.name  AS buyer_name,
              buyer.phone AS buyer_phone,
              agent.name  AS agent_name,
              agent.phone AS agent_phone
       FROM deliveries d
       JOIN orders o      ON o.id = d.order_id
       JOIN users buyer   ON buyer.id = o.buyer_id
       LEFT JOIN users agent ON agent.id = d.agent_id
       ${where}
       ORDER BY d.assigned_at DESC`,
      params
    );
    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// ── GET /api/deliveries/:id ───────────────────────────────────
router.get('/:id', auth, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT d.*,
              o.*, o.id AS order_id,
              buyer.name  AS buyer_name,
              buyer.phone AS buyer_phone,
              buyer.email AS buyer_email,
              agent.name  AS agent_name,
              agent.phone AS agent_phone
       FROM deliveries d
       JOIN orders o      ON o.id = d.order_id
       JOIN users buyer   ON buyer.id = o.buyer_id
       LEFT JOIN users agent ON agent.id = d.agent_id
       WHERE d.id = $1`,
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Delivery not found' });

    // Security check
    const delivery = rows[0];
    if (req.user.role === 'delivery_agent' && delivery.agent_id !== req.user.id)
      return res.status(403).json({ error: 'Forbidden' });

    // Items for this order
    const { rows: items } = await pool.query(
      `SELECT oi.*, p.name AS product_name, p.unit, p.image_url
       FROM order_items oi JOIN products p ON p.id = oi.product_id
       WHERE oi.order_id = $1`, [delivery.order_id]
    );

    res.json({ ...delivery, items });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ── PUT /api/deliveries/:id/status ────────────────────────────
router.put('/:id/status', auth, authorize('delivery_agent','admin'), async (req, res) => {
  const { status, delivery_proof, failure_reason, route_notes } = req.body;
  const validStatuses = ['picked_up','in_transit','delivered','failed','returned'];

  if (!validStatuses.includes(status))
    return res.status(422).json({ error: 'Invalid delivery status' });

  try {
    const { rows: existing } = await pool.query(
      'SELECT * FROM deliveries WHERE id=$1', [req.params.id]
    );
    if (!existing.length) return res.status(404).json({ error: 'Not found' });

    // Agents can only update their own deliveries
    if (req.user.role === 'delivery_agent' && existing[0].agent_id !== req.user.id)
      return res.status(403).json({ error: 'Forbidden' });

    const now = new Date().toISOString();
    const updates = {
      status,
      delivery_proof: delivery_proof || existing[0].delivery_proof,
      failure_reason: failure_reason || existing[0].failure_reason,
      route_notes:    route_notes    || existing[0].route_notes,
      picked_up_at:   status === 'picked_up'  ? now : existing[0].picked_up_at,
      delivered_at:   status === 'delivered'  ? now : existing[0].delivered_at,
    };

    const { rows } = await pool.query(
      `UPDATE deliveries SET
         status=$1, delivery_proof=$2, failure_reason=$3,
         route_notes=$4, picked_up_at=$5, delivered_at=$6
       WHERE id=$7 RETURNING *`,
      [updates.status, updates.delivery_proof, updates.failure_reason,
       updates.route_notes, updates.picked_up_at, updates.delivered_at,
       req.params.id]
    );

    // Sync order status when delivery is completed
    if (status === 'delivered') {
      await pool.query(
        "UPDATE orders SET status='delivered',updated_at=NOW() WHERE id=$1",
        [existing[0].order_id]
      );
      // Mark COD payments as paid
      await pool.query(
        "UPDATE orders SET payment_status='paid' WHERE id=$1 AND payment_method='cod'",
        [existing[0].order_id]
      );
    }

    res.json(rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// ── GET /api/deliveries/agents/list — admin ───────────────────
router.get('/agents/list', auth, authorize('admin'), async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT u.id, u.name, u.phone, u.email,
              COUNT(d.id) FILTER (WHERE d.status NOT IN ('delivered','returned','failed'))
                AS active_deliveries,
              COUNT(d.id) FILTER (WHERE d.status = 'delivered')
                AS completed_deliveries
       FROM users u
       LEFT JOIN deliveries d ON d.agent_id = u.id
       WHERE u.role = 'delivery_agent' AND u.is_active = TRUE
       GROUP BY u.id
       ORDER BY u.name`,
      []
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
