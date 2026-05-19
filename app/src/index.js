require('dotenv').config();
const express = require('express');
const { ensureBucket } = require('./config/minio');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const mahasiswaRoutes = require('./routes/uploadRoutes');
app.use('/api/mahasiswa', mahasiswaRoutes);

// Health check
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

// Start server
app.listen(PORT, async () => {
  console.log(`🚀 Server berjalan di port ${PORT}`);
  await ensureBucket();
});
