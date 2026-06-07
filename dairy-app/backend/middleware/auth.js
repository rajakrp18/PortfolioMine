// middleware/auth.js
// Verifies JWT token from Authorization header.
// Usage: router.get('/protected', auth, (req, res) => { ... })
// Role guard: router.get('/admin-only', auth, authorize('admin'), handler)

const jwt = require('jsonwebtoken');

// ── Verify JWT ────────────────────────────────────────────────
const auth = (req, res, next) => {
  // Expect: "Authorization: Bearer <token>"
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = header.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dairy_secret_key');
    req.user = decoded;   // { id, email, role, name }
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// ── Role-based guard (variadic roles) ─────────────────────────
// Example: authorize('admin', 'farmer')  — allows both roles
const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({
      error: `Access denied. Required role: ${roles.join(' or ')}`
    });
  }
  next();
};

module.exports = { auth, authorize };
