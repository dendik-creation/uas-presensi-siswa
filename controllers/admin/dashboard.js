const db = require("../../config/db");
const Pengaturan = require("../../model/pengaturan");

/*
|-------------------------------------------------------------------------------
| getDashboardPage
|-------------------------------------------------------------------------------
| URL:            /
| Controller:     admin/dashboard@getDashboardPage
| Method:         GET
| Description:    Renders the administrator main overview statistics and recent logs
*/
const getDashboardPage = async (req, res, next) => {
  try {
    // 1. Query total active students
    const [siswaRows] = await db.query("SELECT COUNT(*) AS total FROM users WHERE role = 'siswa' AND is_active = 1");
    const totalSiswa = siswaRows[0].total;

    // 2. Query today's presence counts
    const [hadirRows] = await db.query("SELECT COUNT(*) AS total FROM presensi WHERE jenis_presensi = 'hadir' AND DATE(created_at) = CURDATE()");
    const [izinRows] = await db.query("SELECT COUNT(*) AS total FROM presensi WHERE jenis_presensi = 'izin' AND DATE(created_at) = CURDATE()");
    const [sakitRows] = await db.query("SELECT COUNT(*) AS total FROM presensi WHERE jenis_presensi = 'sakit' AND DATE(created_at) = CURDATE()");

    const totalHadir = hadirRows[0].total;
    const totalIzin = izinRows[0].total;
    const totalSakit = sakitRows[0].total;
    const totalAlpa = Math.max(0, totalSiswa - (totalHadir + totalIzin + totalSakit));

    // 3. Query 10 latest presence logs with student information
    const [recentRows] = await db.query(
      `SELECT p.*, u.nama AS nama_siswa, u.kelas 
       FROM presensi p
       JOIN users u ON p.siswa_id = u.id
       ORDER BY p.created_at DESC
       LIMIT 10`
    );

    // 4. Query settings fallback
    const dbSettings = await Pengaturan.getSettings();
    const settings = dbSettings || {
      radius_gps_meter: 100,
      latitude_sekolah: -6.793208,
      longitude_sekolah: 110.865485,
      jam_masuk_mulai: "07:00:00",
      jam_masuk_selesai: "08:00:00",
      jam_pulang_mulai: "14:00:00",
      jam_pulang_selesai: "15:00:00"
    };

    return res.render("admin/dashboard", {
      title: "Dashboard Admin - EPresensi",
      activePage: "dashboard",
      stats: {
        totalSiswa,
        totalHadir,
        totalIzin,
        totalSakit,
        totalAlpa
      },
      recentPresensi: recentRows,
      settings
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getDashboardPage,
};
