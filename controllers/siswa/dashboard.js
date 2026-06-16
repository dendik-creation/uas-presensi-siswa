const Presensi = require("../../model/presensi");
const Pengaturan = require("../../model/pengaturan");

// Helper: Haversine distance formula in meters
const calculateHaversine = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3; // Earth radius in meters
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) *
      Math.cos(phi2) *
      Math.sin(deltaLambda / 2) *
      Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // in meters
};

// Helper: Check if current time is within operational time limits
const isTimeBetween = (current, start, end) => {
  return current >= start && current <= end;
};

/*
|-------------------------------------------------------------------------------
| Show Siswa Dashboard
|-------------------------------------------------------------------------------
| URL:            /
| Controller:     siswa/dashboard@getDashboardPage
| Method:         GET
| Description:    Renders the student home page, operational settings, and presence logs
*/
const getDashboardPage = async (req, res, next) => {
  try {
    const siswaId = req.user.id;
    const todayPresensi = await Presensi.getPresensiToday(siswaId);
    const history = await Presensi.getPresensiHistory(siswaId);
    const dbSettings = await Pengaturan.getSettings();

    // Default configurations fallback
    const settings = dbSettings || {
      radius_gps_meter: 100,
      latitude_sekolah: -6.793208,
      longitude_sekolah: 110.865485,
      jam_masuk_mulai: "07:00:00",
      jam_masuk_selesai: "08:00:00",
      jam_pulang_mulai: "14:00:00",
      jam_pulang_selesai: "15:00:00"
    };

    return res.render("siswa/dashboard", {
      title: "Dashboard Siswa - EPresensi",
      activePage: "dashboard",
      todayPresensi,
      history,
      settings,
    });
  } catch (error) {
    return next(error);
  }
};

/*
|-------------------------------------------------------------------------------
| Submit Presence Masuk
|-------------------------------------------------------------------------------
| URL:            /api/presensi/masuk
| Controller:     siswa/dashboard@submitPresensiMasuk
| Method:         POST
| Description:    Saves check-in data (Hadir via GPS, Sakit/Izin via reasons)
*/
const submitPresensiMasuk = async (req, res, next) => {
  try {
    const siswaId = req.user.id;
    let { jenisPresensi, latitude, longitude, alasanIzin } = req.body;

    // 1. Validation: Jenis presensi must be correct
    if (!jenisPresensi || !["hadir", "izin", "sakit"].includes(jenisPresensi)) {
      return res.status(400).json({ success: false, message: "Jenis presensi tidak valid!" });
    }

    // 2. Validation: Prevent multiple check-ins on the same day
    const todayPresensi = await Presensi.getPresensiToday(siswaId);
    if (todayPresensi) {
      return res.status(400).json({ success: false, message: "Anda sudah melakukan presensi hari ini!" });
    }

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

    const now = new Date();
    const currentTime = now.toTimeString().split(" ")[0]; // HH:MM:SS
    let finalLat = null;
    let finalLng = null;
    let finalDistance = null;
    let isGps = false;
    let finalAlasan = null;

    if (jenisPresensi === "hadir") {
      // 3. Validation: GPS presence checks
      if (latitude === undefined || longitude === undefined) {
        return res.status(400).json({ success: false, message: "Akses GPS diperlukan untuk presensi hadir masuk!" });
      }

      finalLat = parseFloat(latitude);
      finalLng = parseFloat(longitude);
      if (isNaN(finalLat) || isNaN(finalLng)) {
        return res.status(400).json({ success: false, message: "Titik koordinat GPS tidak valid!" });
      }

      // Check operational KBM hours
      if (!isTimeBetween(currentTime, settings.jam_masuk_mulai, settings.jam_masuk_selesai)) {
        return res.status(400).json({ 
          success: false, 
          message: `Presensi masuk ditolak. Waktu masuk: ${settings.jam_masuk_mulai.substring(0, 5)} s/d ${settings.jam_masuk_selesai.substring(0, 5)} WIB.` 
        });
      }

      // Verify radius via Haversine
      finalDistance = calculateHaversine(finalLat, finalLng, parseFloat(settings.latitude_sekolah), parseFloat(settings.longitude_sekolah));
      if (finalDistance > settings.radius_gps_meter) {
        return res.status(400).json({ 
          success: false, 
          message: `Anda berada di luar radius sekolah! Jarak Anda: ${Math.round(finalDistance)} meter (Maksimal radius: ${settings.radius_gps_meter} meter).` 
        });
      }

      isGps = true;
    } else {
      // 4. Validation: Sick or permit reason must be supplied and sanitized
      if (!alasanIzin) {
        return res.status(400).json({ success: false, message: "Alasan keterangan wajib diisi!" });
      }
      finalAlasan = String(alasanIzin).trim();
      if (finalAlasan.length === 0) {
        return res.status(400).json({ success: false, message: "Alasan keterangan tidak boleh kosong!" });
      }
      isGps = false;
    }

    // 5. Save record to DB
    const insertId = await Presensi.recordPresensiMasuk({
      siswaId,
      jenisPresensi,
      latitude: finalLat,
      longitude: finalLng,
      jarak: finalDistance,
      statusGps: isGps,
      alasanIzin: finalAlasan,
    });

    if (insertId) {
      return res.json({ success: true, message: "Presensi masuk berhasil dicatat!" });
    } else {
      return res.status(500).json({ success: false, message: "Gagal menyimpan data presensi masuk!" });
    }
  } catch (error) {
    return next(error);
  }
};

/*
|-------------------------------------------------------------------------------
| Submit Presence Pulang
|-------------------------------------------------------------------------------
| URL:            /api/presensi/pulang
| Controller:     siswa/dashboard@submitPresensiPulang
| Method:         POST
| Description:    Saves check-out and journal data (requires GPS validation)
*/
const submitPresensiPulang = async (req, res, next) => {
  try {
    const siswaId = req.user.id;
    let { latitude, longitude, isiJurnal } = req.body;

    // 1. Validation: Journal input checks
    if (!isiJurnal) {
      return res.status(400).json({ success: false, message: "Jurnal kegiatan harian wajib diisi!" });
    }
    const finalJurnal = String(isiJurnal).trim();
    if (finalJurnal.length === 0) {
      return res.status(400).json({ success: false, message: "Jurnal kegiatan harian tidak boleh kosong!" });
    }

    // 2. Validation: check if check-in log exists
    const todayPresensi = await Presensi.getPresensiToday(siswaId);
    if (!todayPresensi) {
      return res.status(400).json({ success: false, message: "Anda belum melakukan presensi masuk hari ini!" });
    }

    if (todayPresensi.waktu_pulang) {
      return res.status(400).json({ success: false, message: "Anda sudah melakukan presensi pulang hari ini!" });
    }

    if (todayPresensi.jenis_presensi !== "hadir") {
      return res.status(400).json({ success: false, message: "Presensi pulang hanya berlaku untuk status kehadiran Hadir." });
    }

    // 3. Validation: Coords checks
    if (latitude === undefined || longitude === undefined) {
      return res.status(400).json({ success: false, message: "Akses GPS diperlukan untuk presensi pulang!" });
    }

    const finalLat = parseFloat(latitude);
    const finalLng = parseFloat(longitude);
    if (isNaN(finalLat) || isNaN(finalLng)) {
      return res.status(400).json({ success: false, message: "Titik koordinat GPS tidak valid!" });
    }

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

    const now = new Date();
    const currentTime = now.toTimeString().split(" ")[0]; // HH:MM:SS

    // Check school checkout operating window
    if (!isTimeBetween(currentTime, settings.jam_pulang_mulai, settings.jam_pulang_selesai)) {
      return res.status(400).json({ 
        success: false, 
        message: `Presensi pulang ditolak. Waktu pulang: ${settings.jam_pulang_mulai.substring(0, 5)} s/d ${settings.jam_pulang_selesai.substring(0, 5)} WIB.` 
      });
    }

    // Verify distance via Haversine
    const finalDistance = calculateHaversine(finalLat, finalLng, parseFloat(settings.latitude_sekolah), parseFloat(settings.longitude_sekolah));
    if (finalDistance > settings.radius_gps_meter) {
      return res.status(400).json({ 
        success: false, 
        message: `Anda berada di luar radius sekolah! Jarak Anda: ${Math.round(finalDistance)} meter (Maksimal radius: ${settings.radius_gps_meter} meter).` 
      });
    }

    // 4. Update check-out log in DB
    const updated = await Presensi.recordPresensiPulang(siswaId, {
      latitude: finalLat,
      longitude: finalLng,
      jarak: finalDistance,
      isiJurnal: finalJurnal,
    });

    if (updated) {
      return res.json({ success: true, message: "Presensi pulang berhasil dicatat!" });
    } else {
      return res.status(500).json({ success: false, message: "Gagal menyimpan data presensi pulang!" });
    }
  } catch (error) {
    return next(error);
  }
};

/*
|-------------------------------------------------------------------------------
| getPresensiPage
|-------------------------------------------------------------------------------
| URL:            /presensi/tambah
| Controller:     siswa/dashboard@getPresensiPage
| Method:         GET
| Description:    Renders the presence form page for checking in or checking out
*/
const getPresensiPage = async (req, res, next) => {
  try {
    const siswaId = req.user.id;
    const todayPresensi = await Presensi.getPresensiToday(siswaId);
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

    // If student already finished today's presence (checked out or on izin/sakit)
    if (todayPresensi && (todayPresensi.waktu_pulang || todayPresensi.jenis_presensi !== "hadir")) {
      return res.redirect("/");
    }

    // Check if current server time is outside operational hours
    const now = new Date();
    const currentTime = now.toTimeString().split(" ")[0]; // HH:MM:SS

    if (!todayPresensi) {
      if (currentTime < settings.jam_masuk_mulai || currentTime > settings.jam_masuk_selesai) {
        return res.redirect("/");
      }
    } else if (todayPresensi.jenis_presensi === "hadir" && !todayPresensi.waktu_pulang) {
      if (currentTime < settings.jam_pulang_mulai || currentTime > settings.jam_pulang_selesai) {
        return res.redirect("/");
      }
    }

    return res.render("siswa/presensi/tambah", {
      title: "Form Presensi - EPresensi",
      activePage: "presensi",
      todayPresensi,
      settings,
    });
  } catch (error) {
    return next(error);
  }
};

/*
|-------------------------------------------------------------------------------
| getPresensiHistoryPage
|-------------------------------------------------------------------------------
| URL:            /presensi
| Controller:     siswa/dashboard@getPresensiHistoryPage
| Method:         GET
| Description:    Renders the student presence logs history with filters and download options
*/
const getPresensiHistoryPage = async (req, res, next) => {
  try {
    const siswaId = req.user.id;
    const { tanggal_mulai, tanggal_akhir, jenis_presensi } = req.query;

    const filters = {
      tanggal_mulai: tanggal_mulai || null,
      tanggal_akhir: tanggal_akhir || null,
      jenis_presensi: jenis_presensi || null
    };

    const history = await Presensi.getPresensiHistoryFiltered(siswaId, filters);

    return res.render("siswa/presensi/index", {
      title: "Riwayat Presensi Saya - EPresensi",
      activePage: "presensi",
      history,
      filters
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getDashboardPage,
  submitPresensiMasuk,
  submitPresensiPulang,
  getPresensiPage,
  getPresensiHistoryPage,
};
