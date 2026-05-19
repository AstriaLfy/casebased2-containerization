const pool = require('../config/db');

const MahasiswaModel = {
  async getAll() {
    const result = await pool.query(
      'SELECT * FROM mahasiswa ORDER BY created_at DESC'
    );
    return result.rows;
  },

  async getById(id) {
    const result = await pool.query(
      'SELECT * FROM mahasiswa WHERE id = $1',
      [id]
    );
    return result.rows[0];
  },

  async create({ nim, nama, jurusan, angkatan, file_url, file_name }) {
    const result = await pool.query(
      `INSERT INTO mahasiswa (nim, nama, jurusan, angkatan, file_url, file_name)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [nim, nama, jurusan, angkatan, file_url || null, file_name || null]
    );
    return result.rows[0];
  },

  async update(id, { nim, nama, jurusan, angkatan, file_url, file_name }) {
    const result = await pool.query(
      `UPDATE mahasiswa
       SET nim=$1, nama=$2, jurusan=$3, angkatan=$4,
           file_url=COALESCE($5, file_url),
           file_name=COALESCE($6, file_name),
           updated_at=NOW()
       WHERE id=$7 RETURNING *`,
      [nim, nama, jurusan, angkatan, file_url || null, file_name || null, id]
    );
    return result.rows[0];
  },

  async delete(id) {
    const result = await pool.query(
      'DELETE FROM mahasiswa WHERE id = $1 RETURNING *',
      [id]
    );
    return result.rows[0];
  },
};

module.exports = MahasiswaModel;
