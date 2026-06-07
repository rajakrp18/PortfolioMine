// routes/auth.js
// POST /api/auth/register  — create any role account
// POST /api/auth/login     — returns JWT
// GET  /api/auth/me        — returns current user profile

const express  = require('express');
const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const pool     = require('../config/db');
const { auth } = require('../middleware/auth');

const router = express.Router();
const JWT_SECRET  = process.env.JWT_SECRET  || 'dairy_secret_key';
const JWT_EXPIRES = process.env.JWT_EXPIRES || '7d';

// ── Helper: generate token ────────────────────────────────────
const signToken = (user) =>
  jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.name },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES }
  );

// ── POST /api/auth/register ───────────────────────────────────
router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 6 }).withMessage('Min 6 chars'),
    body('role').isIn([
      'farmer','wholesaler','retailer','consumer','delivery_agent'
    ]).withMessage('Invalid role'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });

    const { name, email, password, role, phone, address, city, state, pincode } = req.body;

    try {
      // Check email uniqueness
      const existing = await pool.query(
        'SELECT id FROM users WHERE email = $1', [email]
      );
      if (existing.rows.length)
        return res.status(409).json({ error: 'Email already registered' });

      // Hash password with bcrypt (salt rounds = 10)
      const hashed = await bcrypt.hash(password, 10);

      // Insert user
      const { rows } = await pool.query(
        `INSERT INTO users (name,email,password,role,phone,address,city,state,pincode)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id,name,email,role`,
        [name, email, hashed, role, phone, address, city, state, pincode]
      );
      const user = rows[0];

      // If farmer — create blank farmer_profile row
      if (role === 'farmer') {
        await pool.query(
          'INSERT INTO farmer_profiles (user_id) VALUES ($1)', [user.id]
        );
      }

      const token = signToken(user);
      res.status(201).json({ token, user });
    } catch (err) {
      console.error('Register error:', err.message);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// ── POST /api/auth/login ──────────────────────────────────────
router.post(
  '/login',
  [
    body('email').isEmail(),
    body('password').notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });

    const { email, password } = req.body;

    try {
      const { rows } = await pool.query(
        'SELECT * FROM users WHERE email = $1 AND is_active = TRUE', [email]
      );
      if (!rows.length)
        return res.status(401).json({ error: 'Invalid credentials' });

      const user = rows[0];
      const valid = await bcrypt.compare(password, user.password);
      if (!valid)
        return res.status(401).json({ error: 'Invalid credentials' });

      const token = signToken(user);
      // Never return password hash
      delete user.password;
      res.json({ token, user });
    } catch (err) {
      console.error('Login error:', err.message);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// ── GET /api/auth/me ──────────────────────────────────────────
router.get('/me', auth, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT id,name,email,role,phone,address,city,state,pincode,
              is_active,created_at
       FROM users WHERE id = $1`,
      [req.user.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'User not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ── PUT /api/auth/me — update profile ─────────────────────────
router.put('/me', auth, async (req, res) => {
  const { name, phone, address, city, state, pincode } = req.body;
  try {
    const { rows } = await pool.query(
      `UPDATE users SET name=$1,phone=$2,address=$3,city=$4,state=$5,
       pincode=$6,updated_at=NOW()
       WHERE id=$7
       RETURNING id,name,email,role,phone,address,city,state,pincode`,
      [name, phone, address, city, state, pincode, req.user.id]
    );
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
