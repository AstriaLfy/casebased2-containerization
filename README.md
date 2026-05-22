# 🎓 Sistem Informasi Akademik - Nusantara Tech

Proyek containerization menggunakan Docker Compose untuk standardisasi
lingkungan development terintegrasi (App, Database, Object Storage).

## Stack

| Service | Image | Port |
|---------|-------|------|
| App (Node.js) | node:20-alpine | 3000 |
| Database | postgres:16-alpine | 5432 |
| Object Storage | minio/minio:latest | 9000, 9001 |
| GUI Database | dpage/pgadmin4:latest | 5050 |

---

## Cara Menjalankan

### 1. Clone repository
```bash
git clone <URL_REPO>
cd casebased2
```

### 2. Buat file .env
```bash
cp .env.example .env
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
| pgAdmin (Browser) | http://localhost:5050 |

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

## Akses MinIO Dashboard

1. Buka **http://localhost:9001** di browser
2. Login dengan kredensial dari file `.env`:
   - **Username**: nilai `MINIO_ACCESS_KEY`
   - **Password**: nilai `MINIO_SECRET_KEY`
3. Bucket **mahasiswa-files** otomatis dibuat saat app pertama kali dijalankan
4. File yang diupload tersimpan di dalam bucket tersebut

---

## Akses Database PostgreSQL

Ada 2 cara untuk mengakses database PostgreSQL:

---

### Cara 1 — pgAdmin via Browser (Docker)

pgAdmin sudah berjalan sebagai container dan bisa diakses langsung lewat browser.

1. Buka **http://localhost:5050** di browser
2. Login dengan kredensial dari file `.env`:
   - **Email**: nilai `PGADMIN_EMAIL`
   - **Password**: nilai `PGADMIN_PASSWORD`
3. Klik kanan **Servers** → **Register → Server**
4. Isi pada tab **General**:
   - **Name**: `Nusantara DB`
5. Isi pada tab **Connection**:
   - **Host**: `postgres`
   - **Port**: `5432`
   - **Database**: nilai `DB_NAME`
   - **Username**: nilai `DB_USER`
   - **Password**: nilai `DB_PASSWORD`
6. Klik **Save** → database langsung terhubung

> **Catatan**: Host menggunakan `postgres` (service name Docker),
> bukan `localhost`, karena pgAdmin dan PostgreSQL berada
> dalam satu Docker network yang sama.

---

### Cara 2 — pgAdmin Desktop (Aplikasi di Laptop/PC)

Jika ingin mengakses dari aplikasi pgAdmin yang terinstall di laptop/PC host.

#### Langkah 1 — Download dan Install pgAdmin
Download pgAdmin di: **https://www.pgadmin.org/download/**
Pilih sesuai OS (Windows/Mac/Linux), lalu install.

#### Langkah 2 — Cek IP VM
Jalankan di terminal VM:
```bash
ip addr show | grep "inet " | grep -v 127.0.0.1
```
Catat IP-nya, contoh: `192.168.1.10`

#### Langkah 3 — Pastikan Port 5432 Sudah Expose
Cek di terminal VM:
```bash
docker-compose ps | grep postgres
```
Harus ada `0.0.0.0:5432->5432/tcp` di kolom Ports.

#### Langkah 4 — Tambah Server di pgAdmin Desktop
1. Buka pgAdmin di laptop
2. Klik kanan **Servers** → **Register → Server**
3. Isi pada tab **General**:
   - **Name**: `Nusantara DB`
4. Isi pada tab **Connection**:
   - **Host**: `<IP-VM>` (contoh: `192.168.1.10`)
   - **Port**: `5432`
   - **Database**: nilai `DB_NAME`
   - **Username**: nilai `DB_USER`
   - **Password**: nilai `DB_PASSWORD`
5. Centang **Save password** → klik **Save**

> **Catatan**: Jika VM menggunakan mode NAT di VirtualBox,
> tambahkan port forwarding `5432 → 5432` di
> VirtualBox → Settings → Network → Port Forwarding,
> lalu gunakan `127.0.0.1` sebagai Host.

---

## Arsitektur Jaringan Docker

Semua service berjalan dalam satu custom bridge network bernama `casebased2_net`.
Komunikasi antar container menggunakan service name, bukan localhost:
---

## Persistensi Data (Volume)

Data tidak akan hilang saat container dihentikan dengan `docker-compose down`.

| Volume | Isi |
|--------|-----|
| `postgres_data` | Data tabel PostgreSQL |
| `minio_data` | File yang diupload ke MinIO |

```bash
# Hentikan container — data TETAP tersimpan
docker-compose down

# Hentikan + hapus volume — data HILANG
docker-compose down -v
```

---

## Menghentikan Container

```bash
# Hentikan container (data tetap)
docker-compose down

# Hentikan + hapus semua data
docker-compose down -v
```

---

## Screenshots Pengujian

- [ ] `docker-compose ps` — semua container Running
- [ ] `docker-compose logs app` — Connected to PostgreSQL + MinIO
- [ ] `GET /api/mahasiswa` — data dari PostgreSQL
- [ ] `POST /api/mahasiswa` dengan file — upload ke MinIO berhasil
- [ ] MinIO dashboard — file tampil di bucket mahasiswa-files
- [ ] pgAdmin — tabel mahasiswa tampil di database
