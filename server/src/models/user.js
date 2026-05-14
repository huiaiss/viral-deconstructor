const pool = require('../db/pool');
const bcrypt = require('bcryptjs');

const User = {
  async create({ email, password, nickname }) {
    const hash = await bcrypt.hash(password, 12);
    const { rows } = await pool.query(
      `INSERT INTO users (email, password_hash, nickname) VALUES ($1, $2, $3) RETURNING id, email, nickname, free_uses, subscription_status, created_at`,
      [email, hash, nickname || email.split('@')[0]]
    );
    return rows[0];
  },

  async findByEmail(email) {
    const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return rows[0] || null;
  },

  async findById(id) {
    const { rows } = await pool.query('SELECT id, email, nickname, free_uses, subscription_status, subscription_expires_at, created_at FROM users WHERE id = $1', [id]);
    return rows[0] || null;
  },

  async incrementFreeUses(userId) {
    await pool.query('UPDATE users SET free_uses = free_uses + 1 WHERE id = $1', [userId]);
  },
};

module.exports = User;
