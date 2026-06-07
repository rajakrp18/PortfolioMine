// routes/collections.js
// Handles daily milk sourcing from farmers (AM + PM shifts)
//
// GET  /api/collections            — admin: all collections (filterable)
// GET  /api/collections/my         — farmer: own collections
// POST /api/collections            — admin/agent: record a collection
// GET  /api/collections/summary    — admin: aggregate by farmer/date
// POST /api/collections/payment    — admin: mark collections as paid
// GET  /api/collections/rates      — get current rate cards

const express   = require('express');
const { body, query, validationResult } = require('express-validator');
const pool      = require('../config/db');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// ── GET /api/collections — admin view all ─────────────────────
router.get('/', auth, authorize('admin'), async (req, res) => {
  const { farmer_id, from, to, payment_status, shift } = req.query;

  // Build WHERE clauses dynamically
  const conditions = [];
  const params     = [];
  let   idx        = 1;

  if (farmer_id)       { conditions.push(`mc.farmer_id = $${idx++}`);      params.push(farmer_id); }
  if (from)            { conditions.push(`mc.collection_date >= $${idx++}`); params.push(from); }
  if (to)              { conditions.push(`mc.collection_date <= $${idx++}`); params.push(to); }
  if (payment_status)  { conditions.push(`mc.payment_status = $${idx++}`);  params.push(payment_status); }
  if (shift)           { conditions.push(`mc.shift = $${idx++}`);           params.push(shift); }

  const where = conditions.length ? 'WHERE ' + conditions.join(' AND ') : '';

  try {
    const { rows } = await pool.query(
      `SELECT mc.*,
              u.name  AS farmer_name,
              u.phone AS farmer_phone
       FROM milk_collections mc
       JOIN users u ON u.id = mc.farmer_id
       ${where}
       ORDER BY mc.collection_date DESC, mc.shift`,
      params
    );
    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// ── GET /api/collections/my — farmer sees own records ─────────
router.get('/my', auth, authorize('farmer'), async (req, res) => {
  const { from, to } = req.query;
  const params = [req.user.id];
  let where = 'WHERE farmer_id = $1';

  if (from) { where += ` AND collection_date >= $${params.push(from)}`; }
  if (to)   { where += ` AND collection_date <= $${params.push(to)}`; }

  try {
    const { rows } = await pool.query(
      `SELECT * FROM milk_collections ${where}
       ORDER BY collection_date DESC, shift`,
      params
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ── GET /api/collections/summary — admin dashboard aggregate ──
router.get('/summary', auth, authorize('admin'), async (req, res) => {
  const { from, to } = req.query;
  const params = [];
  let where = '';
  if (from) { where += ` AND mc.collection_date >= $${params.push(from)}`; }
  if (to)   { where += ` AND mc.collection_date <= $${params.push(to)}`; }

  try {
    const { rows } = await pool.query(
      `SELECT u.id AS farmer_id,
              u.name,
              COUNT(mc.id)              AS entries,
              SUM(mc.quantity_liters)   AS total_liters,
              SUM(mc.amount)            AS total_amount,
              AVG(mc.fat_percentage)    AS avg_fat,
              SUM(CASE WHEN mc.payment_status='paid' THEN mc.amount ELSE 0 END) AS paid_amount,
              SUM(CASE WHEN mc.payment_status='pending' THEN mc.amount ELSE 0 END) AS pending_amount
       FROM milk_collections mc
       JOIN users u ON u.id = mc.farmer_id
       WHERE 1=1 ${where}
       GROUP BY u.id, u.name
       ORDER BY total_liters DESC`,
      params
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ── POST /api/collections — record milk collection ────────────
router.post(
  '/',
  auth,
  authorize('admin'),
  [
    body('farmer_id').notEmpty(),
    body('collection_date').isDate(),
    body('shift').isIn(['AM','PM']),
    body('quantity_liters').isFloat({ min: 0.1 }),
    body('rate_per_liter').isFloat({ min: 1 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });

    const {
      farmer_id, collection_date, shift,
      quantity_liters, fat_percentage, snf_percentage,
      rate_per_liter, quality_grade, notes
    } = req.body;

    try {
      // Prevent duplicate entry for same farmer/date/shift
      const dup = await pool.query(
        `SELECT id FROM milk_collections
         WHERE farmer_id=$1 AND collection_date=$2 AND shift=$3`,
        [farmer_id, collection_date, shift]
      );
      if (dup.rows.length)
        return res.status(409).json({ error: 'Duplicate entry for this farmer/date/shift' });

      const { rows } = await pool.query(
        `INSERT INTO milk_collections
         (farmer_id,collection_date,shift,quantity_liters,fat_percentage,
          snf_percentage,rate_per_liter,quality_grade,collected_by,notes)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
         RETURNING *`,
        [farmer_id, collection_date, shift, quantity_liters, fat_percentage,
         snf_percentage, rate_per_liter, quality_grade, req.user.id, notes]
      );
      res.status(201).json(rows[0]);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// ── POST /api/collections/payment — bulk mark as paid ─────────
router.post('/payment', auth, authorize('admin'), async (req, res) => {
  // collection_ids: array of UUIDs to mark paid
  const { farmer_id, period_from, period_to, payment_method, transaction_ref } = req.body;

  try {
    // Fetch pending collections for this farmer in range
    const { rows: collections } = await pool.query(
      `SELECT id, amount FROM milk_collections
       WHERE farmer_id=$1 AND collection_date BETWEEN $2 AND $3
       AND payment_status != 'paid'`,
      [farmer_id, period_from, period_to]
    );

    if (!collections.length)
      return res.status(404).json({ error: 'No pending collections found' });

    const totalAmount = collections.reduce((s, c) => s + parseFloat(c.amount), 0);
    const totalLiters = await pool.query(
      `SELECT SUM(quantity_liters) AS liters FROM milk_collections
       WHERE farmer_id=$1 AND collection_date BETWEEN $2 AND $3`,
      [farmer_id, period_from, period_to]
    );

    // Mark collections as paid
    const ids = collections.map(c => c.id);
    await pool.query(
      `UPDATE milk_collections SET payment_status='paid'
       WHERE id = ANY($1::uuid[])`,
      [ids]
    );

    // Record farmer payment
    const { rows: payment } = await pool.query(
      `INSERT INTO farmer_payments
       (farmer_id,period_from,period_to,total_liters,total_amount,
        payment_method,transaction_ref,paid_at,status,created_by)
       VALUES ($1,$2,$3,$4,$5,$6,$7,NOW(),'paid',$8)
       RETURNING *`,
      [farmer_id, period_from, period_to,
       totalLiters.rows[0].liters, totalAmount,
       payment_method, transaction_ref, req.user.id]
    );

    res.json({ payment: payment[0], collections_count: ids.length, total_amount: totalAmount });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
