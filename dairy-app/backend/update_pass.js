require('dotenv').config();
const pool = require('./config/db');

async function updatePassword() {
  try {
    await pool.query(
      "UPDATE users SET password = $1 WHERE email = 'admin@dairyfresh.com'",
      ['$2a$10$KdkUuOHkbMUw/UbfEV9lyetzyB2q.xHjOkoay2fuM9iRrMF0zbDnG']
    );
    console.log('Password updated successfully');
  } catch (err) {
    console.error('Failed to update password:', err);
  } finally {
    pool.end();
  }
}
updatePassword();
