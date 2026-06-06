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

CREATE TABLE `system_settings` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `nama_pengaturan` varchar(255) UNIQUE NOT NULL,
  `deskripsi` text,
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

ALTER TABLE `system_settings` ADD FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`);
