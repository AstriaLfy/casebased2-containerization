const MahasiswaModel = require('../models/mahasiswaModel');
const { minioClient, BUCKET_NAME } = require('../config/minio');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

// GET all mahasiswa
exports.getAll = async (req, res) => {
  try {
    const data = await MahasiswaModel.getAll();
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET mahasiswa by ID
exports.getById = async (req, res) => {
  try {
    const data = await MahasiswaModel.getById(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: 'Mahasiswa tidak ditemukan' });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST create mahasiswa
exports.create = async (req, res) => {
  try {
    const { nim, nama, jurusan, angkatan } = req.body;
    let file_url = null;
    let file_name = null;

    if (req.file) {
      const ext = path.extname(req.file.originalname);
      const objectName = `${uuidv4()}-${req.file.originalname}`;

      await minioClient.putObject(
        BUCKET_NAME,
        objectName,
        req.file.buffer,
        req.file.size,
        { 'Content-Type': req.file.mimetype }
      );

      file_url = `http://${process.env.MINIO_ENDPOINT || 'minio'}:9000/${BUCKET_NAME}/${objectName}`;
      file_name = req.file.originalname;
    }

    const mahasiswa = await MahasiswaModel.create({ nim, nama, jurusan, angkatan, file_url, file_name });
    res.status(201).json({ success: true, data: mahasiswa });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT update mahasiswa
exports.update = async (req, res) => {
  try {
    const { nim, nama, jurusan, angkatan } = req.body;
    let file_url = null;
    let file_name = null;

    if (req.file) {
      const ext = path.extname(req.file.originalname);
      const objectName = `${uuidv4()}-${req.file.originalname}`;

      await minioClient.putObject(
        BUCKET_NAME,
        objectName,
        req.file.buffer,
        req.file.size,
        { 'Content-Type': req.file.mimetype }
      );

      file_url = `http://${process.env.MINIO_ENDPOINT || 'minio'}:9000/${BUCKET_NAME}/${objectName}`;
      file_name = req.file.originalname;
    }

    const mahasiswa = await MahasiswaModel.update(req.params.id, { nim, nama, jurusan, angkatan, file_url, file_name });
    if (!mahasiswa) return res.status(404).json({ success: false, message: 'Mahasiswa tidak ditemukan' });
    res.json({ success: true, data: mahasiswa });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE mahasiswa
exports.delete = async (req, res) => {
  try {
    const mahasiswa = await MahasiswaModel.delete(req.params.id);
    if (!mahasiswa) return res.status(404).json({ success: false, message: 'Mahasiswa tidak ditemukan' });
    res.json({ success: true, message: 'Mahasiswa berhasil dihapus', data: mahasiswa });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
