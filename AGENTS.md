# AGENTS.md - Panduan Pengembangan EPresensi

Berkas ini adalah pedoman penuh untuk AI coding assistant yang akan melanjutkan tugas pengembangan pada proyek **EPresensi**. Seluruh aturan, arsitektur, dan instruksi di bawah ini bersifat **wajib** dipatuhi tanpa boleh menyimpang atau berhalusinasi.

---

## 1. Arsitektur Proyek & Aturan Utama

Sistem dikembangkan secara monolitik (Server-Side Rendering) dengan ketentuan berikut:

1. **Struktur Folder Tunggal**:
   - Tidak ada pemisahan folder `frontend` dan `backend`. Seluruh kode diletakkan pada satu tingkat (root folder).
   - Berkas logika server diletakkan di `/config`, `/controllers`, `/middleware`, `/model`.
   - Seluruh berkas tampilan diletakkan di dalam folder `/views` menggunakan ekstensi `.ejs`.

2. **Gaya Tampilan (UI)**:
   - Wajib menggunakan **Bootstrap 5 CDN** dengan **Light Mode default**.
   - Dilarang membuat tema gelap (*dark mode*) atau menggunakan warna-warna gelap kustom di luar skema default Bootstrap.

3. **Sistem Autentikasi & Otorisasi**:
   - Menggunakan **Session Cookie** lewat library `express-session`.
   - **DILARANG** menggunakan JSON Web Token (JWT) atau penyimpanan token di `localStorage`.
   - Sesi dijaga oleh middleware `middleware/authOnly.js` (memeriksa `req.session.userId`).
   - Proteksi rute peranan menggunakan `middleware/roleOnly.js` dengan parameter string role, contoh: `roleOnly('admin')` atau `roleOnly('siswa')`.

4. **Konversi Model (Laravel MVC Adapted)**:
   - Model database harus berupa **Class** dengan method static untuk query database.
   - Contoh pemanggilan model: `const user = await User.findByUsername(username)`.
   - Model yang aktif: `User` ([model/user.js](file:///D:/uemka/smt_4/prakweb/uas-presensi-siswa/model/user.js)), `Presensi` ([model/presensi.js](file:///D:/uemka/smt_4/prakweb/uas-presensi-siswa/model/presensi.js)), dan `Pengaturan` ([model/pengaturan.js](file:///D:/uemka/smt_4/prakweb/uas-presensi-siswa/model/pengaturan.js)).

5. **Penyusutan Tabel Pengaturan**:
   - Tabel untuk konfigurasi dinamai `pengaturan` (bukan *system_settings*).
   - Kolom `nama_pengaturan` dan `deskripsi` telah dihapus.
   - Titik koordinat default diposisikan di Universitas Muria Kudus (UMK): Latitude `-6.793208` dan Longitude `110.865485`.

---

## 2. Aturan Penulisan Kode (Coding Conventions)

1. **Comment Tag Informatif**:
   Setiap fungsi/method baru yang diimplementasikan pada Controller maupun Model/Service **wajib** diawali dengan format komentar persis seperti berikut:
   ```javascript
   /*
   |-------------------------------------------------------------------------------
   | Nama Fungsi
   |-------------------------------------------------------------------------------
   | URL:            /route/path (jika di Controller)
   | Controller:     nama_subfolder/nama_file@nama_method (jika di Controller)
   | Method:         GET / POST / PUT / DELETE (jika di Controller)
   | Description:    Deskripsi singkat fungsionalitas
   */
   ```

2. **Validasi & Sanitasi Data**:
   - Lakukan validasi input request body di sisi Controller untuk memastikan semua field yang diperlukan terisi.
   - Lakukan sanitasi data secara aman (seperti `.trim()` untuk string, `parseInt`/`parseFloat` untuk angka, dll.) sebelum memproses data ke database.

3. **Peta Interaktif**:
   - Gunakan pustaka **Leaflet.js** via CDN untuk peta interaktif pada menu pengaturan admin.
   - Pastikan marker dapat digeser (*draggable*) atau peta dapat diklik untuk memperbarui input latitude & longitude secara dinamis.

## 3. Aturan Commit Message (Commit Conventions)

Setiap commit wajib mengikuti format **Conventional Commits** demi kerapian riwayat perubahan repositori:
- **Format**: `<type>(<scope>): <description>`
  - `<type>`: `feat` (fitur baru), `fix` (perbaikan bug), `docs` (dokumentasi), `style` (perubahan formatting/UI tanpa merubah kode logic), `refactor` (restrukturisasi kode), `test` (unit/integration test).
  - `<scope>`: Cakupan perubahan (misal: `auth`, `presensi`, `pengaturan`, `siswa`, `laporan`, `profile`).
  - `<description>`: Penjelasan perubahan singkat dan berorientasi tindakan.
- **Contoh**: `feat(auth): implement session-based authentication and login page`

---

## 4. Daftar Progres & Tugas Selanjutnya (Task List)

Gunakan daftar ini untuk mengetahui fitur apa saja yang sudah selesai (`[x]`) dan apa saja yang harus diselesaikan berikutnya (`[ ]`). **Fokuskan pengerjaan secara bertahap hanya pada item yang bertanda `[ ]`**.

### **Dendi' Setiawan (Sistem Login & Presensi GPS)**
- [x] Rancang Schema Database
- [x] Fitur Autentikasi: Rancang middleware session (`authOnly`, `roleOnly`), logic login/logout controller, & enkripsi multi-hash
- [x] Fitur Presensi: Logic controller, model, & rute API presensi masuk & pulang berbasis validasi GPS (rumus Haversine)
- [x] Fitur Presensi Izin: Logic pengajuan izin/sakit tanpa GPS

### **Naufal Rizqi Ilham Gibran (Pengaturan & Rekap Presensi (Admin))**
- [x] Rancang Schema Database & Membuat Flowchart
- [x] Desain UI Login: Rancang halaman masuk web (`login.ejs`) light mode
- [x] Fitur Pengaturan Global: Query model & API controller pengaturan sekolah (`pengaturan` table)
- [x] Design UI Dashboard Admin & Pengaturan: View pengaturan EJS & integrasi Leaflet map
- [x] Desain UI Dashboard Siswa: Tampilan antarmuka gawai & pendeteksi jarak GPS
- [ ] Fitur Rekap Presensi: Tabel riwayat absensi pada role admin, cetak PDF, ekspor CSV, & filter data presensi (Logic server dan ui frontend)

### **Alvina Salsabilla (Manajemen Siswa CRUD)**
- [ ] Fitur Manajemen Siswa: Controller & Model API CRUD siswa
- [ ] Design UI Manajemen Siswa: Halaman tabel siswa, form tambah, dan form ubah EJS

### **Labibah Rohmah (Profil & Rekap Presensi (Siswa))**
- [x] Fitur Update Profil Diri: Logic model & API update nama dan kontak No. HP
- [x] Design UI Halaman Profil Diri: Halaman form ubah data profil & reset kata sandi EJS
- [ ] Fitur Rekap Presensi: Tabel riwayat absensi pada role siswa, cetak PDF, ekspor CSV, & filter data presensi (Logic server dan ui frontend)
