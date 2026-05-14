const pool = require('../db/pool');

const Plan = {
  async create({ userId, deconstructionId, track, referenceUrl }) {
    const { rows } = await pool.query(
      `INSERT INTO plans (user_id, deconstruction_id, track, reference_url, status) VALUES ($1, $2, $3, $4, 'pending') RETURNING *`,
      [userId, deconstructionId, track, referenceUrl]
    );
    return rows[0];
  },

  async update(id, status, result) {
    await pool.query(
      `UPDATE plans SET status = $2, result = $3 WHERE id = $1`,
      [id, status, result ? JSON.stringify(result) : null]
    );
  },

  async findByUser(userId) {
    const { rows } = await pool.query(
      `SELECT * FROM plans WHERE user_id = $1 ORDER BY created_at DESC LIMIT 20`,
      [userId]
    );
    return rows;
  },

  async findById(id) {
    const { rows } = await pool.query('SELECT * FROM plans WHERE id = $1', [id]);
    return rows[0] || null;
  },
};

module.exports = Plan;
