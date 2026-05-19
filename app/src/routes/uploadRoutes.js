const express = require('express');
const router = express.Router();
const multer = require('multer');
const controller = require('../controllers/uploadController');

// Gunakan memoryStorage agar file bisa langsung dikirim ke MinIO (tidak perlu disk)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // max 10MB
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'application/pdf'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipe file tidak diizinkan. Gunakan JPG, PNG, atau PDF.'));
    }
  },
});

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', upload.single('file'), controller.create);
router.put('/:id', upload.single('file'), controller.update);
router.delete('/:id', controller.delete);

module.exports = router;
