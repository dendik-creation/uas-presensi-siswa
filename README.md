````md
# EPresensi

EPresensi merupakan proyek tugas akhir (UAS) mata kuliah Praktikum Web yang bertujuan untuk melakukan digitalisasi sistem presensi siswa di lingkungan sekolah. Sistem ini dirancang untuk menggantikan proses presensi konvensional dengan validasi lokasi berbasis GPS serta pengisian jurnal kegiatan harian.

## Daftar Isi

1. [Latar Belakang](#latar-belakang)
2. [Tujuan Proyek](#tujuan-proyek)
3. [Teknologi yang Digunakan](#teknologi-yang-digunakan)
4. [Fitur Utama](#fitur-utama)
5. [Alur Presensi](#alur-presensi)
6. [Skema Database](#skema-database)
7. [Pembagian Tugas Tim](#pembagian-tugas-tim)
8. [Struktur Sistem](#struktur-sistem)
9. [Instalasi](#instalasi)
10. [Catatan Pengembangan](#catatan-pengembangan)

---

## Latar Belakang

Presensi siswa pada lingkungan sekolah umumnya masih dilakukan secara konvensional, baik menggunakan pencatatan manual maupun verifikasi sederhana yang rentan terhadap manipulasi data kehadiran. Oleh karena itu, proyek **EPresensi** dikembangkan sebagai bentuk implementasi digitalisasi presensi siswa dengan memanfaatkan validasi lokasi berbasis GPS untuk meningkatkan keakuratan data kehadiran.

Selain pencatatan kehadiran, sistem ini juga menyediakan fitur jurnal harian sebagai dokumentasi aktivitas siswa setelah kegiatan belajar berlangsung.

## Tujuan Proyek

Tujuan dari pengembangan sistem EPresensi adalah:

- Mengimplementasikan sistem presensi siswa berbasis web.
- Memanfaatkan validasi lokasi menggunakan GPS untuk proses kehadiran.
- Mendokumentasikan aktivitas siswa melalui jurnal harian.
- Menerapkan konsep pengembangan aplikasi web menggunakan arsitektur frontend, backend, dan database pada tugas akhir mata kuliah Praktikum Web.

## Teknologi yang Digunakan

### Backend

- Node.js
- Express JS
- MySQL Driver (`mysql2`)

### Frontend

- HTML
- CSS
- JavaScript (Vanilla JS)
- Bootstrap
- SweetAlert2 (PopUp feedback)
- Fetch API

### Database

- MySQL

## Fitur Utama

Sistem EPresensi memiliki beberapa fitur utama sebagai berikut:

### 1. Sistem Login dan Autentikasi

Pengguna dapat masuk ke sistem menggunakan akun yang telah terdaftar berdasarkan hak akses masing-masing.

Hak akses yang tersedia:

- Admin
- Siswa

### 2. Presensi Berbasis GPS

Sistem melakukan validasi lokasi pengguna berdasarkan koordinat sekolah dan batas radius yang ditentukan.

### 3. Presensi Hadir Masuk

Siswa wajib mengaktifkan GPS untuk melakukan validasi lokasi sebelum presensi berhasil direkam.

### 4. Presensi Hadir Pulang

Siswa wajib:

- Mengaktifkan GPS.
- Berada pada radius lokasi sekolah.
- Mengisi jurnal kegiatan harian.

### 5. Presensi Sakit dan Izin

Status **Sakit** dan **Izin** tidak memerlukan validasi GPS dan akan langsung tercatat untuk satu hari penuh.

### 6. Pengelolaan Data Siswa

Admin dapat melakukan pengelolaan data siswa melalui fitur CRUD:

- Menambah data siswa
- Menampilkan data siswa
- Memperbarui data siswa
- Menghapus data siswa

### 7. Pengaturan Sistem

Admin dapat mengelola konfigurasi global sistem, meliputi:

- Radius validasi presensi
- Koordinat sekolah
- Jam operasional presensi

### 8. Laporan Presensi

Admin dapat melakukan rekapitulasi data presensi dan mengekspor laporan ke:

- Excel
- PDF

### 9. Profil Pengguna

Pengguna dapat:

- Melihat profil
- Memperbarui informasi profil
- Mengubah kata sandi

### 10. Riwayat Presensi

Siswa dapat melihat histori presensi pribadi yang telah dilakukan.

## Alur Presensi

### Presensi Hadir Masuk

1. Siswa login ke sistem.
2. Sistem meminta akses lokasi (GPS).
3. Lokasi siswa divalidasi menggunakan koordinat sekolah.
4. Sistem menghitung jarak menggunakan rumus Haversine.
5. Jika siswa berada dalam radius yang diizinkan, presensi masuk berhasil direkam.

### Presensi Hadir Pulang

1. Siswa melakukan validasi lokasi GPS.
2. Siswa mengisi jurnal kegiatan harian.
3. Sistem menyimpan data jam pulang beserta jurnal kegiatan.

### Presensi Sakit atau Izin

1. Siswa memilih status kehadiran.
2. Data langsung tercatat tanpa validasi lokasi GPS.
3. Status berlaku untuk satu hari penuh.

## Skema Database

Sistem menggunakan tiga tabel utama:

### 1. `users`

Menyimpan data kredensial pengguna untuk proses autentikasi dan hak akses sistem.

Fungsi:

- Login pengguna
- Penyimpanan role Admin dan Siswa

### 2. `presensi`

Menyimpan data log presensi harian siswa.

Informasi yang disimpan:

- Jam masuk
- Jam pulang
- Koordinat lokasi
- Status kehadiran
- Jurnal kegiatan harian

### 3. `settings`

Menyimpan konfigurasi global sistem.

Informasi yang disimpan:

- Jam operasional presensi
- Radius validasi lokasi
- Koordinat lintang sekolah
- Koordinat bujur sekolah

## Pembagian Tugas Tim

| Penanggung Jawab          | Tugas                                                                                                                          |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Dendi' Setiawan           | Sistem login dan autentikasi, validasi jarak presensi menggunakan rumus Haversine, antarmuka Login, dan Dasbor Siswa.          |
| Naufal Rizqi Ilham Gibran | Pengelolaan pengaturan global, ekspor laporan ke Excel dan PDF, antarmuka Pengaturan, dan antarmuka Laporan pada Dasbor Admin. |
| Alvina Salsabila          | Fitur CRUD data siswa dan antarmuka Manajemen Siswa pada Dasbor Admin.                                                         |
| Labibah Rohmah            | Fitur profil pengguna, perubahan kata sandi, histori presensi siswa, serta antarmuka Profil dan Histori Presensi.              |

## Struktur Sistem

Arsitektur sistem terdiri atas:

```text
Frontend (HTML, CSS, JS)
        ↓ Fetch API
Backend API (Express JS)
        ↓ mysql2
Database (MySQL)
```
````

## Instalasi

Berikut langkah menjalankan proyek dari hasil clone repository.

### 1. Clone Repository

```bash
git clone <repository-url>
```

Masuk ke direktori proyek dan masuk ke backend:

```bash
cd uas-presensi-siswa/backend
```

### 2. Install Dependency

Pastikan Node.js telah terpasang, kemudian jalankan:

```bash
npm install
```

### 3. Konfigurasi Database

Buat database MySQL sesuai kebutuhan proyek, kemudian sesuaikan konfigurasi koneksi database pada backend.

Lakukan copy file .env.example ke .env dan sesuaikan nilai tiap variablenya :

```bash
cp .env.example .env
```

### 4. Jalankan Server

Jalankan aplikasi menggunakan:

```bash
npm run dev
```

atau

```bash
node app.js
```

### 5. Akses Aplikasi

Buka file yang ada di folder frontend/index.html di browser

## Catatan Pengembangan

EPresensi dikembangkan sebagai proyek **Ujian Akhir Semester (UAS) Mata Kuliah Praktikum Web** dengan fokus implementasi teknologi web berbasis frontend, backend, database, dan integrasi validasi lokasi menggunakan GPS.

```

```
