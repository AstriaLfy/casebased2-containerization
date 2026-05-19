# 🎓 Sistem Informasi Akademik - Nusantara Tech

Proyek containerization menggunakan Docker Compose untuk standardisasi
lingkungan development terintegrasi (App, Database, Object Storage).

## Stack

| Service | Image | Port |
|---------|-------|------|
| App (Node.js) | node:20-alpine | 3000 |
| Database | postgres:16-alpine | 5432 (internal) |
| Object Storage | minio/minio:latest | 9000, 9001 |

## Cara Menjalankan

### 1. Clone repository
```bash
git clone <URL_REPO>
cd casebased2
```

### 2. Buat file .env
```bash
cp .env.example .env
# Edit .env sesuai konfigurasi kamu
nano .env
```

### 3. Build dan jalankan semua container
```bash
docker-compose up -d --build
```

### 4. Cek status container
```bash
docker-compose ps
docker-compose logs -f app
```

---

## Akses Layanan

| Layanan | URL |
|---------|-----|
| API App | http://localhost:3000 |
| MinIO Dashboard | http://localhost:9001 |

---

## Endpoint API Mahasiswa

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | /api/mahasiswa | List semua mahasiswa |
| GET | /api/mahasiswa/:id | Detail mahasiswa |
| POST | /api/mahasiswa | Tambah mahasiswa + upload file |
| PUT | /api/mahasiswa/:id | Update mahasiswa |
| DELETE | /api/mahasiswa/:id | Hapus mahasiswa |

### Contoh Request POST (dengan file upload)

```bash
curl -X POST http://localhost:3000/api/mahasiswa \
  -F "nim=2024001" \
  -F "nama=Dewi Lestari" \
  -F "jurusan=Teknik Informatika" \
  -F "angkatan=2024" \
  -F "file=@/path/ke/foto.jpg"
```

### Contoh Request POST (tanpa file)

```bash
curl -X POST http://localhost:3000/api/mahasiswa \
  -H "Content-Type: application/json" \
  -d '{"nim":"2024002","nama":"Rizky Maulana","jurusan":"Sistem Informasi","angkatan":2024}'
```

---

## MinIO Dashboard

1. Buka http://localhost:9001
2. Login dengan:
   - Username: `minioadmin` (sesuai `MINIO_ACCESS_KEY` di `.env`)
   - Password: `MinioSecret123!` (sesuai `MINIO_SECRET_KEY` di `.env`)
3. Bucket bernama `mahasiswa-files` akan otomatis dibuat saat app pertama kali dijalankan

---

## Menghentikan Container

```bash
# Hentikan container (data tetap tersimpan di volume)
docker-compose down

# Hentikan + hapus volume (data hilang!)
docker-compose down -v
```

---

## Screenshots Pengujian

> *(Isi bagian ini dengan screenshot setelah testing)*

- [ ] `docker-compose ps` menampilkan semua container Running
- [ ] `GET /api/mahasiswa` mengembalikan data dari PostgreSQL
- [ ] `POST /api/mahasiswa` dengan file berhasil upload ke MinIO
- [ ] MinIO dashboard menampilkan file di bucket `mahasiswa-files`
