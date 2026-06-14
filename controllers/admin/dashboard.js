/*
|-------------------------------------------------------------------------------
| Show Admin Dashboard
|-------------------------------------------------------------------------------
| URL:            /
| Controller:     admin/dashboard@getDashboardPage
| Method:         GET
| Description:    Renders the administrator main overview statistics (LEGACY - EMPTIED)
*/
const getDashboardPage = async (req, res, next) => {
  return res.render("admin/dashboard", {
    title: "Dashboard Admin - EPresensi",
    activePage: "dashboard",
    stats: {
      totalSiswa: 0,
      totalHadir: 0,
      totalIzin: 0,
      totalSakit: 0,
      totalIzinSakit: 0,
      totalAlpa: 0,
    },
    recentPresensi: [],
    settings: {
      radius_gps_meter: 100,
      latitude_sekolah: -6.200000,
      longitude_sekolah: 106.816666,
      jam_masuk_mulai: "07:00:00",
      jam_masuk_selesai: "08:00:00",
      jam_pulang_mulai: "14:00:00",
      jam_pulang_selesai: "15:00:00"
    }
  });
};

module.exports = {
  getDashboardPage,
};
