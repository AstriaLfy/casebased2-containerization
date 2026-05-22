const Minio = require('minio');

const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_ENDPOINT || 'minio',
  port: parseInt(process.env.MINIO_PORT) || 9000,
  useSSL: false,
  accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
  secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin',
});

const BUCKET_NAME = process.env.MINIO_BUCKET || 'mahasiswa-files';

async function ensureBucket(retries = 5, delay = 3000) {
  for (let i = 1; i <= retries; i++) {
    try {
      const exists = await minioClient.bucketExists(BUCKET_NAME);
      if (!exists) {
        await minioClient.makeBucket(BUCKET_NAME, 'us-east-1');
        console.log(`✅ MinIO bucket "${BUCKET_NAME}" created`);
      } else {
        console.log(`✅ MinIO bucket "${BUCKET_NAME}" already exists`);
      }
      return; // sukses, keluar dari loop
    } catch (err) {
      console.warn(`⏳ MinIO belum ready, retry ${i}/${retries}...`);
      if (i === retries) {
        console.error('❌ MinIO bucket error:', err.message);
      } else {
        await new Promise(res => setTimeout(res, delay));
      }
    }
  }
}

module.exports = { minioClient, BUCKET_NAME, ensureBucket };
