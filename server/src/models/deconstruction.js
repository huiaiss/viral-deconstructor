const pool = require('../db/pool');

const Deconstruction = {
  async create({ userId, platform, sourceUrl, videoS3Key }) {
    const { rows } = await pool.query(
      `INSERT INTO deconstructions (user_id, platform, source_url, video_s3_key, status) VALUES ($1, $2, $3, $4, 'pending') RETURNING *`,
      [userId, platform, sourceUrl, videoS3Key]
    );
    return rows[0];
  },

  async updateStatus(id, status, result) {
    await pool.query(
      `UPDATE deconstructions SET status = $2, result = $3, updated_at = NOW() WHERE id = $1`,
      [id, status, result ? JSON.stringify(result) : null]
    );
  },

  async findByUser(userId, limit = 20) {
    const { rows } = await pool.query(
      `SELECT * FROM deconstructions WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2`,
      [userId, limit]
    );
    return rows;
  },

  async findById(id) {
    const { rows } = await pool.query('SELECT * FROM deconstructions WHERE id = $1', [id]);
    return rows[0] || null;
  },
};

module.exports = Deconstruction;
