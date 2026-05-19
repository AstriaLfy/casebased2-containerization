CREATE TABLE IF NOT EXISTS mahasiswa (
    id          SERIAL PRIMARY KEY,
    nim         VARCHAR(20)  NOT NULL UNIQUE,
    nama        VARCHAR(100) NOT NULL,
    jurusan     VARCHAR(100) NOT NULL,
    angkatan    INTEGER      NOT NULL,
    file_url    TEXT,
    file_name   VARCHAR(255),
    created_at  TIMESTAMP DEFAULT NOW(),
    updated_at  TIMESTAMP DEFAULT NOW()
);

-- Insert data contoh
INSERT INTO mahasiswa (nim, nama, jurusan, angkatan)
VALUES
  ('2021001', 'Budi Santoso',    'Teknik Informatika', 2021),
  ('2021002', 'Siti Rahayu',     'Sistem Informasi',   2021),
  ('2022001', 'Ahmad Fauzi',     'Teknik Informatika', 2022)
ON CONFLICT (nim) DO NOTHING;
