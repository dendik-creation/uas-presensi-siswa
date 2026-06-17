const db = require("../../config/db");
const Pengaturan = require("../../model/pengaturan");

/*
|-------------------------------------------------------------------------------
| getPresensiPage
|-------------------------------------------------------------------------------
| URL:            /admin/presensi
| Controller:     admin/presensi@getPresensiPage
| Method:         GET
| Description:    Renders all student presence log history with filters
*/
const getPresensiPage = async (req, res, next) => {
  try {
    const { start_date, end_date, kelas, status, keyword } = req.query;

    let queryStr = `
      SELECT p.*, u.nama AS nama_siswa, u.kelas, u.nomor_induk
      FROM presensi p
      JOIN users u ON p.siswa_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (start_date) {
      queryStr += " AND DATE(p.created_at) >= ?";
      params.push(start_date);
    }
    if (end_date) {
      queryStr += " AND DATE(p.created_at) <= ?";
      params.push(end_date);
    }
    if (kelas) {
      queryStr += " AND u.kelas = ?";
      params.push(kelas);
    }
    if (status) {
      queryStr += " AND p.jenis_presensi = ?";
      params.push(status);
    }
    if (keyword) {
      queryStr += " AND (u.nama LIKE ? OR u.nomor_induk LIKE ?)";
      params.push(`%${keyword}%`, `%${keyword}%`);
    }

    queryStr += " ORDER BY p.created_at DESC";

    const [logs] = await db.query(queryStr, params);

    // Get list of all distinct classes for filtering
    const [classRows] = await db.query(
      "SELECT DISTINCT kelas FROM users WHERE role = 'siswa' AND kelas IS NOT NULL AND kelas != '' ORDER BY kelas"
    );
    const classes = classRows.map(row => row.kelas);

    res.render("admin/presensi/index", {
      title: "Rekap Presensi - EPresensi",
      activePage: "presensi",
      logs,
      classes,
      filters: {
        start_date: start_date || "",
        end_date: end_date || "",
        kelas: kelas || "",
        status: status || "",
        keyword: keyword || ""
      },
      user: req.user
    });
  } catch (error) {
    return next(error);
  }
};

/*
|-------------------------------------------------------------------------------
| getPresensiDetailPage
|-------------------------------------------------------------------------------
| URL:            /admin/presensi/detail/{id}
| Controller:     admin/presensi@getPresensiDetailPage
| Method:         GET
| Description:    Renders individual check-in/out and coordinate map log details
*/
const getPresensiDetailPage = async (req, res, next) => {
  try {
    const id = req.params.id;
    const [rows] = await db.query(
      `SELECT p.*, u.nama AS nama_siswa, u.nomor_induk, u.kelas, u.no_hp
       FROM presensi p
       JOIN users u ON p.siswa_id = u.id
       WHERE p.id = ?
       LIMIT 1`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).send("Data presensi tidak ditemukan");
    }

    const log = rows[0];

    // Fetch school settings for GPS map validation view
    const dbSettings = await Pengaturan.getSettings();
    const settings = dbSettings || {
      radius_gps_meter: 100,
      latitude_sekolah: -6.793208,
      longitude_sekolah: 110.865485
    };

    return res.render("admin/presensi/detail", {
      title: "Detail Presensi - EPresensi",
      activePage: "presensi",
      log,
      settings,
      user: req.user
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getPresensiPage,
  getPresensiDetailPage,
};
