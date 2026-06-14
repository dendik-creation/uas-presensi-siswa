/*
|-------------------------------------------------------------------------------
| Show Admin Presensi List Page
|-------------------------------------------------------------------------------
| URL:            /admin/presensi
| Controller:     admin/presensi@getPresensiPage
| Method:         GET
| Description:    Renders all student presence log history with filters (LEGACY - EMPTIED)
*/
const getPresensiPage = async (req, res, next) => {
  return res.render("admin/presensi/index", {
    title: "Rekap Presensi - EPresensi",
    activePage: "presensi",
    logs: [],
    classes: [],
    filters: {},
  });
};

/*
|-------------------------------------------------------------------------------
| Show Admin Presensi Detail Page
|-------------------------------------------------------------------------------
| URL:            /admin/presensi/detail/{id}
| Controller:     admin/presensi@getPresensiDetailPage
| Method:         GET
| Description:    Renders individual check-in/out and coordinate map log details (LEGACY - EMPTIED)
*/
const getPresensiDetailPage = async (req, res, next) => {
  return res.render("admin/presensi/detail", {
    title: "Detail Presensi - EPresensi",
    activePage: "presensi",
    log: {
      id: req.params.id,
      nama_siswa: "",
      nomor_induk: "",
      kelas: "",
      no_hp: "",
      jenis_presensi: "hadir",
      waktu_masuk: null,
      waktu_pulang: null,
      jarak_masuk: 0,
      jarak_pulang: 0,
      status_gps: true,
      alasan_izin: "",
      isi_jurnal: "",
      latitude_masuk: null,
      longitude_masuk: null,
      latitude_pulang: null,
      longitude_pulang: null
    },
  });
};

module.exports = {
  getPresensiPage,
  getPresensiDetailPage,
};
