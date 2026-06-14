/*
|-------------------------------------------------------------------------------
| Show Siswa Dashboard
|-------------------------------------------------------------------------------
| URL:            /
| Controller:     siswa/dashboard@getDashboardPage
| Method:         GET
| Description:    Renders the student home page and logs (LEGACY - EMPTIED)
*/
const getDashboardPage = async (req, res, next) => {
  return res.render("siswa/dashboard", {
    title: "Dashboard Siswa - EPresensi",
    activePage: "dashboard",
    todayPresensi: null,
    history: [],
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

/*
|-------------------------------------------------------------------------------
| Submit Presence Masuk
|-------------------------------------------------------------------------------
| URL:            /api/presensi/masuk
| Controller:     siswa/dashboard@submitPresensiMasuk
| Method:         POST
| Description:    Saves check-in data (LEGACY - EMPTIED)
*/
const submitPresensiMasuk = async (req, res, next) => {
  return res.json({ success: true, message: "Presensi masuk berhasil direkam" });
};

/*
|-------------------------------------------------------------------------------
| Submit Presence Pulang
|-------------------------------------------------------------------------------
| URL:            /api/presensi/pulang
| Controller:     siswa/dashboard@submitPresensiPulang
| Method:         POST
| Description:    Saves check-out and journal data (LEGACY - EMPTIED)
*/
const submitPresensiPulang = async (req, res, next) => {
  return res.json({ success: true, message: "Presensi pulang berhasil direkam" });
};

module.exports = {
  getDashboardPage,
  submitPresensiMasuk,
  submitPresensiPulang,
};
