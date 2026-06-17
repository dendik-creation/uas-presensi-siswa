# EPresensi

EPresensi merupakan proyek tugas akhir (UAS) mata kuliah Praktikum Web yang bertujuan untuk melakukan digitalisasi sistem presensi siswa di lingkungan sekolah. Sistem ini menggunakan arsitektur monolitik Server-Side Rendering (SSR) berbasis Express.js dengan template engine EJS dan penyimpanan basis data MySQL.

## Daftar Isi

1. [Latar Belakang](#latar-belakang)
2. [Tujuan Proyek](#tujuan-proyek)
3. [Teknologi yang Digunakan](#teknologi-yang-digunakan)
4. [Fitur Utama](#fitur-utama)
5. [Skema Database](#skema-database)
6. [Struktur Sistem](#struktur-sistem)
7. [Daftar Tugas Tim (Task List)](#daftar-tugas-tim-task-list)
8. [Instalasi](#instalasi)
9. [Akun Pengujian Awal](#akun-pengujian-awal)

---

## Latar Belakang

Presensi siswa pada lingkungan sekolah umumnya masih dilakukan secara konvensional, baik menggunakan pencatatan manual maupun verifikasi sederhana yang rentan terhadap manipulasi data kehadiran. Oleh karena itu, proyek **EPresensi** dikembangkan sebagai bentuk implementasi digitalisasi presensi siswa dengan memanfaatkan validasi lokasi berbasis GPS untuk meningkatkan keakuratan data kehadiran.

Selain pencatatan kehadiran, sistem ini juga menyediakan fitur jurnal harian sebagai dokumentasi aktivitas siswa setelah kegiatan belajar berlangsung sebelum diperbolehkan melakukan presensi pulang.

## Tujuan Proyek

Tujuan dari pengembangan sistem EPresensi adalah:

- Mengimplementasikan sistem presensi siswa berbasis web yang terintegrasi.
- Memanfaatkan validasi lokasi menggunakan GPS (rumus Haversine) untuk proses kehadiran.
- Mendokumentasikan aktivitas harian siswa melalui pengisian jurnal harian saat pulang.
- Menerapkan arsitektur monolitik Server-Side Rendering (SSR) menggunakan Express.js, EJS, dan MySQL pada tugas akhir mata kuliah Praktikum Web.

## Teknologi yang Digunakan

### Core & Server (Monolith SSR)

- **Node.js**: Lingkungan runtime JavaScript.
- **Express.js**: Framework web backend.
- **Express Session (`express-session`)**: Penyimpanan session berbasis cookie di sisi server untuk login/logout pengguna.
- **EJS (Embedded JavaScript)**: Template engine untuk merender halaman HTML dinamis.
- **MySQL Driver (`mysql2`)**: Penghubung aplikasi dengan basis data MySQL.

### Antarmuka & Frontend

- **Bootstrap 5 CDN (Light Mode)**: Library CSS & JS untuk tampilan responsif, bersih, dan modern.
- **FontAwesome CDN**: Library ikon grafis berkualitas.
- **SweetAlert2 CDN**: Library popup interaktif untuk memberikan feedback aksi pengguna.
- **HTML5 Geolocation API**: Mengambil koordinat GPS siswa secara realtime via browser.
- **Leaflet.js CDN**: Peta interaktif untuk mapping koordinat lokasi sekolah oleh admin.

### Basis Data

- **MySQL**: Penyimpanan data terstruktur (siswa, presensi, pengaturan).

---

## Fitur Utama

Sistem EPresensi memiliki beberapa fitur utama sebagai berikut:

### 1. Autentikasi Pengguna & Cookie Session
Sistem masuk (login) menggunakan form HTML terintegrasi. Sesi login dikelola di server menggunakan `express-session`. Dilengkapi dengan proteksi rute halaman menggunakan middleware `authOnly` dan otorisasi peranan (role-check) menggunakan `roleOnly(role)`.

### 2. Presensi Berbasis GPS (Haversine Formula)
Sistem melakukan validasi lokasi siswa saat melakukan presensi masuk dan pulang berdasarkan koordinat lintang (*latitude*) dan bujur (*longitude*) sekolah dengan batas radius toleransi (meter) tertentu.

### 3. Presensi Hadir Masuk & Pulang
Siswa wajib mengaktifkan GPS dan berada di dalam radius sekolah sebelum dapat mengirim presensi. Untuk presensi pulang, siswa juga diwajibkan menulis jurnal kegiatan harian.

### 4. Presensi Sakit dan Izin
Status sakit dan izin tidak memerlukan akses lokasi GPS. Siswa hanya perlu mengunggah keterangan alasan sakit/izin dan status kehadirannya langsung tercatat untuk satu hari penuh.

### 5. Manajemen Siswa (CRUD Admin)
Admin dapat mengelola data siswa: Menambah siswa, menampilkan daftar, mengedit detail (termasuk mengganti password), dan menghapus data siswa beserta log kehadirannya.

### 6. Pengaturan Sistem Global (Admin)
Admin dapat mengonfigurasi parameter operasional sekolah (batas radius GPS, waktu mulai/selesai presensi masuk & pulang, dan koordinat latitude/longitude sekolah) secara interaktif menggunakan peta Leaflet.js (geser pin/klik lokasi).

### 7. Laporan & Rekapitulasi Presensi (Admin)
Admin dapat melihat rekapitulasi data presensi siswa, memfilternya, serta mencetaknya ke format PDF.

---

## Skema Database

Sistem EPresensi menggunakan tiga tabel utama:

1. **`users`**: Menyimpan kredensial pengguna, nama lengkap, kelas (khusus siswa), No. HP, peran (*role* admin/siswa), dan status keaktifan akun.
2. **`presensi`**: Log kehadiran harian siswa, memuat jam masuk, jam pulang, koordinat lokasi masuk/pulang, jarak dari sekolah, jurnal, status GPS, serta alasan izin.
3. **`pengaturan`**: Menyimpan konfigurasi operasional global sekolah (jam mulai/selesai presensi masuk & pulang, radius GPS, dan koordinat latitude/longitude sekolah).

---

## Struktur Sistem

Sistem ini dikembangkan secara monolitik menggunakan arsitektur folder tunggal (tanpa pemisahan direktori frontend dan backend):

```text
uas-presensi-siswa/
├── config/             # Konfigurasi koneksi MySQL pool
├── controllers/        # Logika bisnis EJS Views & API Endpoints
├── middleware/         # Autentikasi Cookie Session & validasi role
├── model/              # Abstraksi query database (User, Presensi, Pengaturan)
├── views/              # Berkas template EJS (HTML dinamis)
│   ├── admin/          # Tampilan khusus Admin
│   ├── siswa/          # Tampilan khusus Siswa
│   └── partials/       # Komponen global header & footer
├── .env                # Variabel lingkungan (port, database)
├── app.js              # Entry point utama Express server
├── database.sql        # Struktur & data awal basis data MySQL
├── package.json        # Manajer dependensi npm
└── README.md           # Dokumentasi proyek
```

---

## Daftar Tugas Tim (Task List)

Berikut adalah detail pembagian tugas tim dari Notion yang telah disesuaikan dengan arsitektur monolitik baru:
- [x] Tugas yang sudah selesai
- [ ] Tugas yang masih dalam proses pengerjaan

### **Dendi' Setiawan**
- [x] Rancang Schema Database
- [x] Fitur Autentikasi: Rancang middleware session (`authOnly`, `roleOnly`), logic login/logout controller, & enkripsi multi-hash
- [x] Fitur Presensi: Logic controller, model, & rute API presensi masuk & pulang berbasis validasi GPS (rumus Haversine)
- [x] Fitur Presensi Izin: Logic pengajuan izin/sakit tanpa GPS

### **Naufal Rizqi Ilham Gibran**
- [x] Rancang Schema Database & Membuat Flowchart
- [x] Desain UI Login: Rancang halaman masuk web (`login.ejs`) light mode
- [x] Fitur Pengaturan Global: Query model & API controller pengaturan sekolah (`pengaturan` table)
- [x] Design UI Dashboard Admin & Pengaturan: View pengaturan EJS & integrasi Leaflet map
- [x] Desain UI Dashboard Siswa: Tampilan antarmuka gawai & pendeteksi jarak GPS
- [x] Fitur Rekap Presensi: Tabel riwayat absensi pada role admin, cetak PDF, & filter data presensi (Logic server dan ui frontend)

### **Alvina Salsabilla (Salsa)**
- [x] Fitur Manajemen Siswa: Controller & Model API CRUD siswa
- [x] Design UI Manajemen Siswa: Halaman tabel siswa, form tambah, dan form ubah EJS

### **Labibah Rohmah**
- [x] Fitur Update Profil Diri: Logic model & API update nama dan kontak No. HP
- [x] Design UI Halaman Profil Diri: Halaman form ubah data profil & reset kata sandi EJS
- [x] Fitur Rekap Presensi: Tabel riwayat absensi pada role siswa, cetak PDF, & filter data presensi (Logic server dan ui frontend)

---

## Instalasi

Ikuti langkah-langkah di bawah ini untuk memasang dan menjalankan proyek di komputer lokal Anda.

### 1. Clone Repository

```bash
git clone https://github.com/dendik-creation/uas-presensi-siswa
cd uas-presensi-siswa
```

### 2. Pasang Dependency

```bash
npm install
```

### 3. Konfigurasi Basis Data (MySQL)

1. Buat database baru bernama `e_presensi`.
2. Impor struktur tabel dari database.sql ke database Anda.
3. Salin berkas `.env.example` menjadi `.env`:
   ```bash
   cp .env.example .env
   ```
4. Sesuaikan variabel konfigurasi koneksi database Anda di dalam berkas `.env`.

### 4. Jalankan Aplikasi

```bash
npm run dev
```

Aplikasi dapat diakses melalui browser pada alamat:
[http://localhost:3000](http://localhost:3000)

---

## Akun Pengujian Awal

Gunakan akun berikut untuk menguji login pada portal EPresensi:

- **Admin**:
  - **Username**: `admin`
  - **Password**: `12345`
- **Siswa 1**:
  - **Username**: `siswa1`
  - **Password**: `12345`
- **Siswa 2**:
  - **Username**: `siswa2`
  - **Password**: `12345`
