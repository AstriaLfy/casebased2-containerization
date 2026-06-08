# 🎓 Sistem Informasi Akademik - Nusantara Tech

> Tugas Case Based 2: Containerization
> Mata Kuliah: Administrasi Sistem
> Topik: Standardisasi Lingkungan Development Terintegrasi (App, Database, & Object Storage)

---

## 📦 Daftar Berkas

| Berkas/Folder | Keterangan |
|---------------|------------|
| `docker-compose.yml` | Orkestrasi seluruh service (App, Database, Storage, pgAdmin) |
| `app/Dockerfile` | Dockerfile untuk Web/App Service (Node.js 20 Alpine) |
| `app/src/` | Source code aplikasi Express.js |
| `.env.example` | Contoh konfigurasi environment (tanpa password asli) |
| `postgres/init.sql` | Script inisialisasi tabel dan data awal PostgreSQL |
| `README.md` | Dokumentasi lengkap proyek |

---

## 🧱 Arsitektur Sistem

Semua service berkomunikasi menggunakan service name Docker (bukan localhost), karena berada dalam satu custom bridge network bernama casebased2_net.

    [User/Browser]
          |
          | http://localhost:3000
          v
    +------------------------------------------+
    |        Docker Network: casebased2_net    |
    |                                          |
    |  +--------+  postgres:5432  +---------+  |
    |  |  app   | --------------> | postgres|  |
    |  | :3000  |                 |  :5432  |  |
    |  |        |  minio:9000     +---------+  |
    |  |        | --------------> +---------+  |
    |  +--------+                 |  minio  |  |
    |                             |  :9000  |  |
    |  +---------+                +---------+  |
    |  | pgadmin |                             |
    |  |  :5050  |                             |
    |  +---------+                             |
    +------------------------------------------+

---

## ⚙️ Stack Teknologi

| Service | Image | Port |
|---------|-------|------|
| Web App (Node.js + Express) | node:20-alpine | 3000 |
| Database | postgres:16-alpine | 5432 |
| Object Storage | minio/minio:latest | 9000, 9001 |
| GUI Database | dpage/pgadmin4:latest | 5050 |

---

## 🚀 Cara Menjalankan dari Nol

### Langkah 1 — Clone Repository

    git clone <URL_REPO>
    cd casebased2

### Langkah 2 — Buat File .env

    cp .env.example .env
    nano .env

Isi file `.env` dengan konfigurasi berikut:

    # PostgreSQL
    DB_HOST=postgres
    DB_PORT=5432
    DB_NAME=akademik_db
    DB_USER=admin
    DB_PASSWORD=your_password

    # MinIO
    MINIO_ACCESS_KEY=minioadmin
    MINIO_SECRET_KEY=your_minio_secret
    MINIO_BUCKET=mahasiswa-files
    MINIO_ENDPOINT=minio
    MINIO_PORT=9000

    # pgAdmin
    PGADMIN_EMAIL=admin@nusantara.com
    PGADMIN_PASSWORD=your_pgadmin_password

### Langkah 3 — Build dan Jalankan Semua Container

    docker-compose up -d --build

### Langkah 4 — Verifikasi Semua Container Berjalan

    docker-compose ps

Output yang diharapkan:

    Name                    State     Ports
    ----------------------------------------------------
    casebased2_app          Up        0.0.0.0:3000->3000/tcp
    casebased2_postgres     Up        0.0.0.0:5432->5432/tcp
    casebased2_minio        Up        0.0.0.0:9000->9000/tcp, 0.0.0.0:9001->9001/tcp
    casebased2_pgadmin      Up        0.0.0.0:5050->80/tcp

### Langkah 5 — Cek Log Aplikasi

    docker-compose logs app

Output yang diharapkan:

    app_1  | 🚀 Server berjalan di port 3000
    app_1  | ✅ Connected to PostgreSQL
    app_1  | ✅ MinIO bucket "mahasiswa-files" already exists

---

## 🌐 Cara Mengakses Aplikasi Web

| Layanan | URL |
|---------|-----|
| API App | http://localhost:3000 |
| MinIO Dashboard | http://localhost:9001 |
| pgAdmin | http://localhost:5050 |

### Endpoint API Mahasiswa

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | /api/mahasiswa | List semua mahasiswa |
| GET | /api/mahasiswa/:id | Detail mahasiswa |
| POST | /api/mahasiswa | Tambah mahasiswa + upload file |
| PUT | /api/mahasiswa/:id | Update data mahasiswa |
| DELETE | /api/mahasiswa/:id | Hapus mahasiswa |

### Contoh Request

Tambah mahasiswa dengan upload file:

    curl -X POST http://localhost:3000/api/mahasiswa \
      -F "nim=2024001" \
      -F "nama=Dewi Lestari" \
      -F "jurusan=Teknik Informatika" \
      -F "angkatan=2024" \
      -F "file=@/path/ke/foto.jpg"

Tambah mahasiswa tanpa file:

    curl -X POST http://localhost:3000/api/mahasiswa \
      -H "Content-Type: application/json" \
      -d '{"nim":"2024002","nama":"Rizky Maulana","jurusan":"Sistem Informasi","angkatan":2024}'

Lihat semua mahasiswa:

    curl http://localhost:3000/api/mahasiswa

---

## 🪣 Cara Mengakses Dashboard MinIO

MinIO adalah object storage untuk menyimpan file yang diupload (foto/dokumen mahasiswa).

1. Buka browser, akses: http://localhost:9001
2. Login dengan kredensial dari file `.env`:
   - Username: nilai MINIO_ACCESS_KEY
   - Password: nilai MINIO_SECRET_KEY
3. Bucket mahasiswa-files dibuat otomatis saat app pertama dijalankan
4. Semua file yang diupload tersimpan di dalam bucket tersebut

---

## 🗄️ Cara Mengakses Database PostgreSQL

### Cara 1 — pgAdmin via Browser (Docker)

1. Buka browser, akses: http://localhost:5050
2. Login dengan kredensial dari file `.env`:
   - Email: nilai PGADMIN_EMAIL
   - Password: nilai PGADMIN_PASSWORD
3. Klik kanan Servers → Register → Server
4. Tab General → Name: Nusantara DB
5. Tab Connection:
   - Host: postgres
   - Port: 5432
   - Database: nilai DB_NAME
   - Username: nilai DB_USER
   - Password: nilai DB_PASSWORD
6. Klik Save

Catatan: Host menggunakan postgres (service name Docker) karena pgAdmin dan PostgreSQL berada dalam satu Docker network yang sama.

### Cara 2 — pgAdmin Desktop (Aplikasi di Laptop)

1. Download dan install pgAdmin di: https://www.pgadmin.org/download/
2. Cek IP VM di terminal VM:

    ip addr show | grep "inet " | grep -v 127.0.0.1

3. Buka pgAdmin Desktop → klik kanan Servers → Register → Server
4. Tab General → Name: Nusantara DB
5. Tab Connection:
   - Host: isi dengan IP VM (contoh: 192.168.1.10), atau 127.0.0.1 jika pakai port forwarding NAT
   - Port: 5432
   - Database: nilai DB_NAME
   - Username: nilai DB_USER
   - Password: nilai DB_PASSWORD
6. Centang Save password → klik Save

Catatan: Jika VM menggunakan mode NAT di VirtualBox, tambahkan port forwarding 5432 ke 5432 di VirtualBox → Settings → Network → Port Forwarding, lalu gunakan 127.0.0.1 sebagai Host.

### Cara 3 — PostgreSQL CLI

    # Masuk ke container PostgreSQL
    docker exec -it casebased2_postgres psql -U admin -d akademik_db

    # Perintah dasar di dalam psql
    \dt                        -- lihat semua tabel
    SELECT * FROM mahasiswa;   -- lihat semua data
    \d mahasiswa               -- lihat struktur tabel
    \q                         -- keluar

---

## 💾 Persistensi Data (Volume)

Data tidak akan hilang saat container dihentikan dengan docker-compose down.

| Volume | Berisi |
|--------|--------|
| postgres_data | Seluruh data tabel PostgreSQL |
| minio_data | Seluruh file yang diupload ke MinIO |

Test persistensi:

    # Matikan container
    docker-compose down

    # Cek volume masih ada
    docker volume ls | grep casebased2

    # Nyalakan lagi
    docker-compose up -d

    # Data tetap ada
    curl http://localhost:3000/api/mahasiswa

---

## 🔍 Bukti Pengujian

### 1. Semua Container Berjalan

    docker-compose ps

### 2. Aplikasi Terhubung ke Database dan MinIO

    docker-compose logs app

### 3. Komunikasi Antar Container via Service Name

    docker exec casebased2_app env | grep -E "DB_HOST|MINIO_ENDPOINT"

### 4. API Terhubung ke Database

    curl http://localhost:3000/api/mahasiswa

### 5. Upload File ke MinIO

    curl -X POST http://localhost:3000/api/mahasiswa \
      -F "nim=2024011" \
      -F "nama=Upload Test" \
      -F "jurusan=Sistem Informasi" \
      -F "angkatan=2024" \
      -F "file=@/tmp/test.pdf"

---

## 🛑 Menghentikan Container

    # Hentikan container — data TETAP tersimpan di volume
    docker-compose down

    # Hentikan + hapus semua data (volume ikut terhapus)
    docker-compose down -v

---

## 🔧 Troubleshooting

Container app restart terus:

    docker-compose logs app
    docker-compose restart app

Port sudah dipakai:

    sudo lsof -i :3000
    sudo lsof -i :9000
    sudo lsof -i :5050

Reset total:

    docker-compose down -v
    docker-compose up -d --build
