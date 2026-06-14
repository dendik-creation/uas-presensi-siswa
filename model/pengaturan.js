const db = require("../config/db");

class Pengaturan {
  /*
  |-------------------------------------------------------------------------------
  | Get Global Settings
  |-------------------------------------------------------------------------------
  | Method:         getSettings
  | Description:    Gets global school settings from pengaturan table
  */
  static async getSettings() {
    const [rows] = await db.query("SELECT * FROM pengaturan LIMIT 1");
    return rows[0] || null;
  }

  /*
  |-------------------------------------------------------------------------------
  | Update Global Settings
  |-------------------------------------------------------------------------------
  | Method:         updateSettings
  | Description:    Updates global school settings (or inserts them if not present)
  */
  static async updateSettings(data, updatedBy) {
    const [rows] = await db.query("SELECT id FROM pengaturan LIMIT 1");
    if (rows.length === 0) {
      const [result] = await db.query(
        `INSERT INTO pengaturan (jam_masuk_mulai, jam_masuk_selesai, jam_pulang_mulai, jam_pulang_selesai, radius_gps_meter, latitude_sekolah, longitude_sekolah, updated_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          data.jam_masuk_mulai,
          data.jam_masuk_selesai,
          data.jam_pulang_mulai,
          data.jam_pulang_selesai,
          data.radius_gps_meter,
          data.latitude_sekolah,
          data.longitude_sekolah,
          updatedBy
        ]
      );
      return result.insertId;
    } else {
      const id = rows[0].id;
      const [result] = await db.query(
        `UPDATE pengaturan SET 
          jam_masuk_mulai = ?, 
          jam_masuk_selesai = ?, 
          jam_pulang_mulai = ?, 
          jam_pulang_selesai = ?, 
          radius_gps_meter = ?, 
          latitude_sekolah = ?, 
          longitude_sekolah = ?, 
          updated_by = ?,
          updated_at = NOW() 
         WHERE id = ?`,
        [
          data.jam_masuk_mulai,
          data.jam_masuk_selesai,
          data.jam_pulang_mulai,
          data.jam_pulang_selesai,
          data.radius_gps_meter,
          data.latitude_sekolah,
          data.longitude_sekolah,
          updatedBy,
          id
        ]
      );
      return result.affectedRows > 0;
    }
  }
}

module.exports = Pengaturan;
