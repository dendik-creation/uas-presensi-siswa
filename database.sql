-- DML
CREATE TABLE `users` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `nama` varchar(255) NOT NULL,
  `username` varchar(255) UNIQUE NOT NULL,
  `password` varchar(255) NOT NULL,
  `nomor_induk` varchar(255) UNIQUE,
  `role` enum('admin','siswa') NOT NULL,
  `kelas` varchar(255) COMMENT 'nullable, hanya untuk siswa',
  `no_hp` varchar(255),
  `profil_foto` varchar(255),
  `is_active` boolean DEFAULT true,
  `created_at` timestamp DEFAULT (now()),
  `updated_at` timestamp
);
CREATE TABLE `pengaturan` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `jam_masuk_mulai` time NOT NULL,
  `jam_masuk_selesai` time NOT NULL,
  `jam_pulang_mulai` time NOT NULL,
  `jam_pulang_selesai` time NOT NULL,
  `radius_gps_meter` int NOT NULL DEFAULT 100,
  `latitude_sekolah` decimal(10,8),
  `longitude_sekolah` decimal(11,8),
  `updated_at` timestamp,
  `updated_by` int
);
CREATE TABLE `presensi` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `siswa_id` int NOT NULL,
  `jenis_presensi` enum('hadir','izin','sakit','alpa') NOT NULL,
  `waktu_masuk` timestamp,
  `waktu_pulang` timestamp,
  `latitude_masuk` decimal(10,8),
  `longitude_masuk` decimal(11,8),
  `latitude_pulang` decimal(10,8),
  `longitude_pulang` decimal(11,8),
  `jarak_masuk` decimal(10,2),
  `jarak_pulang` decimal(10,2),
  `status_gps` boolean COMMENT 'true = GPS aktif, false = tanpa GPS (izin)',
  `alasan_izin` text,
  `isi_jurnal` text COMMENT 'nullable, hanya untuk hadir saat pulang',
  `created_at` timestamp DEFAULT (now()),
  `updated_at` timestamp
);
ALTER TABLE `presensi` ADD FOREIGN KEY (`siswa_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
ALTER TABLE `pengaturan` ADD FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`);

-- DDL
INSERT INTO `users` (`nama`, `username`, `password`, `nomor_induk`, `role`, `kelas`, `no_hp`, `profil_foto`) VALUES
('Admin', 'admin', '$2b$10$VhxYEXZJIRV.yFFq1DypRuRUp0WK2hbcHBbljVgVHHgcZv/n0t8t6', NULL, 'admin', NULL, NULL, NULL),
('Siswa 1', 'siswa1', '$2b$10$VhxYEXZJIRV.yFFq1DypRuRUp0WK2hbcHBbljVgVHHgcZv/n0t8t6', '00001', 'siswa', '10A', '081234567890', NULL),
('Siswa 2', 'siswa2', '$2b$10$VhxYEXZJIRV.yFFq1DypRuRUp0WK2hbcHBbljVgVHHgcZv/n0t8t6', '00002', 'siswa', '10B', '081234567891', NULL);

INSERT INTO `pengaturan` (`jam_masuk_mulai`, `jam_masuk_selesai`, `jam_pulang_mulai`, `jam_pulang_selesai`, `radius_gps_meter`, `latitude_sekolah`, `longitude_sekolah`, `updated_by`) VALUES
('07:00:00', '08:00:00', '14:00:00', '15:00:00', 100, -6.78467362, 110.86582132, 1);
