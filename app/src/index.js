require('dotenv').config();
const express = require('express');
const { ensureBucket } = require('./config/minio');
const pool = require('./config/db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const mahasiswaRoutes = require('./routes/uploadRoutes');
app.use('/api/mahasiswa', mahasiswaRoutes);

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🎓 Sistem Informasi Akademik - Nusantara Tech',
    endpoints: {
      'GET  /api/mahasiswa': 'List semua mahasiswa',
      'GET  /api/mahasiswa/:id': 'Detail mahasiswa',
      'POST /api/mahasiswa': 'Tambah mahasiswa (dengan upload file)',
      'PUT  /api/mahasiswa/:id': 'Update mahasiswa',
      'DELETE /api/mahasiswa/:id': 'Hapus mahasiswa',
    },
  });
});

app.listen(PORT, async () => {
  console.log(`🚀 Server berjalan di port ${PORT}`);
  // Test koneksi PostgreSQL saat startup
  try {
    await pool.query('SELECT 1');
    console.log('✅ Connected to PostgreSQL');
  } catch (err) {
    console.error('❌ PostgreSQL error:', err.message);
  }
  // Pastikan bucket MinIO ada
  await ensureBucket();
});
