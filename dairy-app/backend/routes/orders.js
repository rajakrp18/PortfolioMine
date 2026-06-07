// routes/orders.js
// Unified order management for all buyer types
//
// GET  /api/orders           — role-aware: admin gets all, buyers get own
// GET  /api/orders/:id       — single order with items
// POST /api/orders           — place an order
// PUT  /api/orders/:id/status — admin: update order status
// DELETE /api/orders/:id     — buyer: cancel own pending order

const express = require('express');
const { body, validationResult } = require('express-validator');
const pool    = require('../config/db');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// ── Price selector (mirrors products.js) ─────────────────────
const priceField = (role) => {
  if (role === 'wholesaler') return 'wholesaler_price';
  if (role === 'retailer')   return 'retailer_price';
  return 'consumer_price';
};

// ── GET /api/orders ───────────────────────────────────────────
router.get('/', auth, async (req, res) => {
  const { status, from, to } = req.query;
  const params = [];
  const conditions = [];

  // Non-admin buyers only see own orders
  if (req.user.role !== 'admin') {
    conditions.push(`o.buyer_id = $${params.push(req.user.id)}`);
  }
  if (status) conditions.push(`o.status = $${params.push(status)}`);
  if (from)   conditions.push(`o.created_at >= $${params.push(from)}`);
  if (to)     conditions.push(`o.created_at <= $${params.push(to)}`);

  const where = conditions.length ? 'WHERE ' + conditions.join(' AND ') : '';

  try {
    const { rows } = await pool.query(
      `SELECT o.*,
              u.name  AS buyer_name,
              u.email AS buyer_email,
              u.phone AS buyer_phone,
              COUNT(oi.id)   AS item_count,
              d.status       AS delivery_status,
              da.name        AS agent_name
       FROM orders o
       JOIN users u          ON u.id = o.buyer_id
       LEFT JOIN order_items oi ON oi.order_id = o.id
       LEFT JOIN deliveries d   ON d.order_id  = o.id
       LEFT JOIN users da       ON da.id = d.agent_id
       ${where}
       GROUP BY o.id, u.name, u.email, u.phone, d.status, da.name
       ORDER BY o.created_at DESC`,
      params
    );
    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// ── GET /api/orders/:id — full detail with line items ─────────
router.get('/:id', auth, async (req, res) => {
  try {
    // Main order
    const { rows: order } = await pool.query(
      `SELECT o.*, u.name AS buyer_name, u.email, u.phone
       FROM orders o JOIN users u ON u.id = o.buyer_id
       WHERE o.id = $1`, [req.params.id]
    );
    if (!order.length) return res.status(404).json({ error: 'Order not found' });

    // Security: buyers can only view own orders
    if (req.user.role !== 'admin' && order[0].buyer_id !== req.user.id)
      return res.status(403).json({ error: 'Forbidden' });

    // Line items
    const { rows: items } = await pool.query(
      `SELECT oi.*, p.name AS product_name, p.unit, p.image_url
       FROM order_items oi JOIN products p ON p.id = oi.product_id
       WHERE oi.order_id = $1`, [req.params.id]
    );

    // Delivery info
    const { rows: delivery } = await pool.query(
      `SELECT d.*, u.name AS agent_name, u.phone AS agent_phone
       FROM deliveries d LEFT JOIN users u ON u.id = d.agent_id
       WHERE d.order_id = $1`, [req.params.id]
    );

    res.json({ ...order[0], items, delivery: delivery[0] || null });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ── POST /api/orders — place order ────────────────────────────
router.post(
  '/',
  auth,
  authorize('wholesaler','retailer','consumer','admin'),
  [
    body('delivery_address').notEmpty(),
    body('items').isArray({ min: 1 }),
    body('items.*.product_id').notEmpty(),
    body('items.*.quantity').isFloat({ min: 0.01 }),
    body('payment_method').isIn(['cod','upi','netbanking','credit','credit_line']),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });

    const { delivery_address, delivery_date, items, payment_method, notes } = req.body;
    const buyerRole = req.user.role;
    const pf = priceField(buyerRole);

    // Use a transaction — order + items must succeed atomically
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      let totalAmount = 0;

      // Validate products + prices
      const enriched = [];
      for (const item of items) {
        const { rows } = await client.query(
          `SELECT id, ${pf} AS price, name,
                  COALESCE(
                    (SELECT SUM(quantity) FROM inventory WHERE product_id=p.id), 0
                  ) AS stock
           FROM products p WHERE id=$1 AND is_active=TRUE`,
          [item.product_id]
        );
        if (!rows.length)
          throw new Error(`Product ${item.product_id} not found`);

        const prod = rows[0];

        // Stock check
        if (parseFloat(prod.stock) < item.quantity)
          throw new Error(`Insufficient stock for ${prod.name}`);

        const subtotal = parseFloat(prod.price) * parseFloat(item.quantity);
        totalAmount += subtotal;
        enriched.push({ ...item, unit_price: prod.price });
      }

      const tax     = parseFloat((totalAmount * 0.05).toFixed(2)); // 5% GST
      const final   = parseFloat((totalAmount + tax).toFixed(2));

      // Insert order
      const { rows: orderRows } = await client.query(
        `INSERT INTO orders
         (buyer_id,buyer_role,delivery_address,delivery_date,
          total_amount,tax,final_amount,payment_method,notes)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
        [req.user.id, buyerRole, delivery_address, delivery_date,
         totalAmount, tax, final, payment_method, notes]
      );
      const order = orderRows[0];

      // Insert line items + deduct inventory
      for (const item of enriched) {
        await client.query(
          `INSERT INTO order_items (order_id,product_id,quantity,unit_price)
           VALUES ($1,$2,$3,$4)`,
          [order.id, item.product_id, item.quantity, item.unit_price]
        );

        // FIFO inventory deduction — deduct from oldest batch first
        let remaining = parseFloat(item.quantity);
        const { rows: batches } = await client.query(
          `SELECT id, quantity FROM inventory WHERE product_id=$1 AND quantity > 0
           ORDER BY expiry_date ASC NULLS LAST, id ASC`,
          [item.product_id]
        );
        for (const batch of batches) {
          if (remaining <= 0) break;
          const deduct = Math.min(remaining, parseFloat(batch.quantity));
          await client.query(
            'UPDATE inventory SET quantity=quantity-$1,updated_at=NOW() WHERE id=$2',
            [deduct, batch.id]
          );
          remaining -= deduct;
        }
      }

      await client.query('COMMIT');

      // Notify admin (fire-and-forget — don't await)
      pool.query(
        `INSERT INTO notifications (user_id, title, message, type)
         SELECT id, 'New Order', $1, 'order' FROM users WHERE role='admin'`,
        [`Order #${order.id.slice(0,8)} placed by ${buyerRole}`]
      ).catch(() => {});

      res.status(201).json(order);
    } catch (err) {
      await client.query('ROLLBACK');
      console.error('Order error:', err.message);
      res.status(400).json({ error: err.message });
    } finally {
      client.release();
    }
  }
);

// ── PUT /api/orders/:id/status — admin update status ──────────
router.put('/:id/status', auth, authorize('admin'), async (req, res) => {
  const { status, agent_id } = req.body;
  const validStatuses = ['confirmed','processing','dispatched','delivered','cancelled'];
  if (!validStatuses.includes(status))
    return res.status(422).json({ error: 'Invalid status' });

  try {
    const { rows } = await pool.query(
      `UPDATE orders SET status=$1, updated_at=NOW()
       WHERE id=$2 RETURNING *`,
      [status, req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Order not found' });

    // If dispatched — assign delivery agent
    if (status === 'dispatched' && agent_id) {
      const existing = await pool.query(
        'SELECT id FROM deliveries WHERE order_id=$1', [req.params.id]
      );
      if (existing.rows.length) {
        await pool.query(
          'UPDATE deliveries SET agent_id=$1,status=\'assigned\' WHERE order_id=$2',
          [agent_id, req.params.id]
        );
      } else {
        await pool.query(
          'INSERT INTO deliveries (order_id,agent_id) VALUES ($1,$2)',
          [req.params.id, agent_id]
        );
      }
    }

    // Notify buyer
    pool.query(
      `INSERT INTO notifications (user_id,title,message,type) VALUES ($1,$2,$3,'order')`,
      [rows[0].buyer_id, `Order ${status}`, `Your order has been ${status}`]
    ).catch(() => {});

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ── DELETE /api/orders/:id — cancel own pending order ─────────
router.delete('/:id', auth, async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM orders WHERE id=$1', [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Order not found' });
    const order = rows[0];

    // Only buyer or admin can cancel
    if (req.user.role !== 'admin' && order.buyer_id !== req.user.id)
      return res.status(403).json({ error: 'Forbidden' });

    // Can only cancel pending/confirmed orders
    if (!['pending','confirmed'].includes(order.status))
      return res.status(400).json({ error: 'Cannot cancel order at this stage' });

    await pool.query(
      'UPDATE orders SET status=\'cancelled\',updated_at=NOW() WHERE id=$1',
      [req.params.id]
    );
    res.json({ message: 'Order cancelled' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
