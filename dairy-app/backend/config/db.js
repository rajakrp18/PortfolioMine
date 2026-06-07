// config/db.js
// PostgreSQL connection pool using the 'pg' library.
// All queries go through this pool — never open raw connections.

const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host:     process.env.DB_HOST     || 'localhost',
  port:     parseInt(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME     || 'dairy_db',
  user:     process.env.DB_USER     || 'postgres',
  password: process.env.DB_PASS     || '',
  max:      20,                  // max connections in pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Test connection on startup
pool.connect((err, client, done) => {
  if (err) {
    console.error('❌ DB connection failed:', err.message);
  } else {
    console.log('✅ PostgreSQL connected');
    done();
  }
});

module.exports = pool;
