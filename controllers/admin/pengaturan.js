const Pengaturan = require("../../model/pengaturan");

/*
|-------------------------------------------------------------------------------
| Show Admin Pengaturan Page
|-------------------------------------------------------------------------------
| URL:            /admin/pengaturan
| Controller:     admin/pengaturan@getSettingsPage
| Method:         GET
| Description:    Renders configurations for school coordinates, radius, and hours
*/
const getSettingsPage = async (req, res, next) => {
  try {
    const settings = await Pengaturan.getSettings();
    
    // Default fallback settings centered at UMK
    const activeSettings = settings || {
      radius_gps_meter: 100,
      latitude_sekolah: -6.793208,
      longitude_sekolah: 110.865485,
      jam_masuk_mulai: "07:00:00",
      jam_masuk_selesai: "08:00:00",
      jam_pulang_mulai: "14:00:00",
      jam_pulang_selesai: "15:00:00"
    };

    return res.render("admin/pengaturan", {
      title: "Pengaturan Sistem - EPresensi",
      activePage: "pengaturan",
      settings: activeSettings,
    });
  } catch (error) {
    return next(error);
  }
};

/*
|-------------------------------------------------------------------------------
| API Update Pengaturan
|-------------------------------------------------------------------------------
| URL:            /api/admin/pengaturan
| Controller:     admin/pengaturan@apiUpdateSettings
| Method:         POST
| Description:    Updates system radius and operational timing constraints in DB
*/
const apiUpdateSettings = async (req, res, next) => {
  try {
    const {
      jam_masuk_mulai,
      jam_masuk_selesai,
      jam_pulang_mulai,
      jam_pulang_selesai,
      radius_gps_meter,
      latitude_sekolah,
      longitude_sekolah,
    } = req.body;

    // Body request validation
    if (
      !jam_masuk_mulai ||
      !jam_masuk_selesai ||
      !jam_pulang_mulai ||
      !jam_pulang_selesai ||
      !radius_gps_meter ||
      !latitude_sekolah ||
      !longitude_sekolah
    ) {
      return res.status(400).json({ success: false, message: "Semua field pengaturan wajib diisi!" });
    }

    // Safe sanitization
    const data = {
      jam_masuk_mulai: String(jam_masuk_mulai).trim(),
      jam_masuk_selesai: String(jam_masuk_selesai).trim(),
      jam_pulang_mulai: String(jam_pulang_mulai).trim(),
      jam_pulang_selesai: String(jam_pulang_selesai).trim(),
      radius_gps_meter: parseInt(radius_gps_meter, 10),
      latitude_sekolah: parseFloat(latitude_sekolah),
      longitude_sekolah: parseFloat(longitude_sekolah),
    };

    if (isNaN(data.radius_gps_meter) || isNaN(data.latitude_sekolah) || isNaN(data.longitude_sekolah)) {
      return res.status(400).json({ success: false, message: "Radius dan koordinat sekolah harus berupa angka valid!" });
    }

    const updated = await Pengaturan.updateSettings(data, req.user.id);

    if (updated) {
      return res.json({ success: true, message: "Pengaturan sistem berhasil disimpan" });
    } else {
      return res.status(500).json({ success: false, message: "Gagal memperbarui pengaturan sistem" });
    }
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getSettingsPage,
  apiUpdateSettings,
};
