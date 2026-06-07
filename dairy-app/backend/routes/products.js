// routes/products.js
// Product catalog + inventory management
//
// GET  /api/products                 — public: list products (role-based pricing)
// GET  /api/products/:id             — product details
// POST /api/products                 — admin: create product
// PUT  /api/products/:id             — admin: update product
// DELETE /api/products/:id           — admin: soft delete
//
// GET  /api/products/:id/inventory   — stock for a product
// POST /api/products/:id/inventory   — admin: add stock batch

const express = require('express');
const { body, validationResult } = require('express-validator');
const pool    = require('../config/db');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// ── Price selector based on buyer role ───────────────────────
const priceField = (role) => {
  if (role === 'wholesaler') return 'wholesaler_price';
  if (role === 'retailer')   return 'retailer_price';
  return 'consumer_price';              // default: consumer / public
};

// ── GET /api/products ─────────────────────────────────────────
router.get('/', async (req, res) => {
  const role     = req.headers['x-user-role'] || 'consumer';
  const price    = priceField(role);
  const { category_id, search } = req.query;

  const params = [];
  let where = 'WHERE p.is_active = TRUE';
  if (category_id) { where += ` AND p.category_id = $${params.push(parseInt(category_id))}`; }
  if (search)      { where += ` AND p.name ILIKE $${params.push('%' + search + '%')}`; }

  try {
    const { rows } = await pool.query(
      `SELECT p.id, p.name, p.sku, p.description, p.unit,
              p.${price}        AS price,
              p.consumer_price  AS mrp,
              p.image_url,
              c.name            AS category,
              COALESCE(SUM(inv.quantity), 0) AS stock
       FROM products p
       LEFT JOIN categories c   ON c.id = p.category_id
       LEFT JOIN inventory inv  ON inv.product_id = p.id
       ${where}
       GROUP BY p.id, c.name
       ORDER BY c.name, p.name`,
      params
    );
    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// ── GET /api/products/:id ─────────────────────────────────────
router.get('/:id', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT p.*, c.name AS category,
              COALESCE(SUM(inv.quantity), 0) AS stock
       FROM products p
       LEFT JOIN categories c  ON c.id = p.category_id
       LEFT JOIN inventory inv ON inv.product_id = p.id
       WHERE p.id = $1
       GROUP BY p.id, c.name`,
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Product not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ── POST /api/products — admin create ─────────────────────────
router.post(
  '/',
  auth, authorize('admin'),
  [
    body('name').notEmpty(),
    body('unit').notEmpty(),
    body('consumer_price').isFloat({ min: 0 }),
    body('retailer_price').isFloat({ min: 0 }),
    body('wholesaler_price').isFloat({ min: 0 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });

    const {
      category_id, name, sku, description, unit,
      consumer_price, retailer_price, wholesaler_price, image_url
    } = req.body;

    try {
      const { rows } = await pool.query(
        `INSERT INTO products
         (category_id,name,sku,description,unit,
          consumer_price,retailer_price,wholesaler_price,image_url)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
        [category_id, name, sku, description, unit,
         consumer_price, retailer_price, wholesaler_price, image_url]
      );
      res.status(201).json(rows[0]);
    } catch (err) {
      if (err.code === '23505')
        return res.status(409).json({ error: 'SKU already exists' });
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// ── PUT /api/products/:id — admin update ──────────────────────
router.put('/:id', auth, authorize('admin'), async (req, res) => {
  const {
    category_id, name, sku, description, unit,
    consumer_price, retailer_price, wholesaler_price, image_url, is_active
  } = req.body;

  try {
    const { rows } = await pool.query(
      `UPDATE products SET
         category_id=$1, name=$2, sku=$3, description=$4, unit=$5,
         consumer_price=$6, retailer_price=$7, wholesaler_price=$8,
         image_url=$9, is_active=$10
       WHERE id=$11 RETURNING *`,
      [category_id, name, sku, description, unit,
       consumer_price, retailer_price, wholesaler_price,
       image_url, is_active, req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Product not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ── DELETE /api/products/:id — soft delete ────────────────────
router.delete('/:id', auth, authorize('admin'), async (req, res) => {
  await pool.query('UPDATE products SET is_active=FALSE WHERE id=$1', [req.params.id]);
  res.json({ message: 'Product deactivated' });
});

// ── GET /api/products/:id/inventory ──────────────────────────
router.get('/:id/inventory', auth, authorize('admin'), async (req, res) => {
  const { rows } = await pool.query(
    `SELECT * FROM inventory WHERE product_id=$1 ORDER BY expiry_date`,
    [req.params.id]
  );
  res.json(rows);
});

// ── POST /api/products/:id/inventory — add stock batch ────────
router.post(
  '/:id/inventory',
  auth, authorize('admin'),
  [
    body('quantity').isFloat({ min: 0.1 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });

    const { quantity, batch_no, manufacture_date, expiry_date, location } = req.body;
    try {
      const { rows } = await pool.query(
        `INSERT INTO inventory
         (product_id,quantity,batch_no,manufacture_date,expiry_date,location,updated_by)
         VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
        [req.params.id, quantity, batch_no, manufacture_date, expiry_date, location, req.user.id]
      );
      res.status(201).json(rows[0]);
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// ── GET /api/products/inventory/low-stock — alert admin ───────
router.get('/inventory/low-stock', auth, authorize('admin'), async (req, res) => {
  const threshold = parseFloat(req.query.threshold || 10);
  const { rows } = await pool.query(
    `SELECT p.id, p.name, p.sku, p.unit,
            COALESCE(SUM(inv.quantity), 0) AS stock
     FROM products p
     LEFT JOIN inventory inv ON inv.product_id = p.id
     WHERE p.is_active = TRUE
     GROUP BY p.id
     HAVING COALESCE(SUM(inv.quantity), 0) < $1
     ORDER BY stock`,
    [threshold]
  );
  res.json(rows);
});

module.exports = router;
