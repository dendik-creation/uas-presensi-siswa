const db = require("../config/db");

class Presensi {
  /*
  |-------------------------------------------------------------------------------
  | Get Today's Presence
  |-------------------------------------------------------------------------------
  | Method:         getPresensiToday
  | Description:    Gets today's presence record for student
  */
  static async getPresensiToday(siswaId) {
    const [rows] = await db.query(
      "SELECT * FROM presensi WHERE siswa_id = ? AND DATE(created_at) = CURDATE() LIMIT 1",
      [siswaId]
    );
    return rows[0] || null;
  }

  /*
  |-------------------------------------------------------------------------------
  | Get Presence History
  |-------------------------------------------------------------------------------
  | Method:         getPresensiHistory
  | Description:    Gets all past presence records for student
  */
  static async getPresensiHistory(siswaId) {
    const [rows] = await db.query(
      "SELECT * FROM presensi WHERE siswa_id = ? ORDER BY created_at DESC",
      [siswaId]
    );
    return rows;
  }

  /*
  |-------------------------------------------------------------------------------
  | Record Presence Entry
  |-------------------------------------------------------------------------------
  | Method:         recordPresensiMasuk
  | Description:    Records presence check-in details (Hadir, Sakit, or Izin)
  */
  static async recordPresensiMasuk(data) {
    const [result] = await db.query(
      `INSERT INTO presensi (
        siswa_id, 
        jenis_presensi, 
        waktu_masuk, 
        latitude_masuk, 
        longitude_masuk, 
        jarak_masuk, 
        status_gps, 
        alasan_izin, 
        created_at
      ) VALUES (?, ?, NOW(), ?, ?, ?, ?, ?, NOW())`,
      [
        data.siswaId,
        data.jenisPresensi,
        data.latitude || null,
        data.longitude || null,
        data.jarak || null,
        data.statusGps,
        data.alasanIzin || null
      ]
    );
    return result.insertId;
  }

  /*
  |-------------------------------------------------------------------------------
  | Record Presence Exit
  |-------------------------------------------------------------------------------
  | Method:         recordPresensiPulang
  | Description:    Records presence check-out details (updates today's check-in log)
  */
  static async recordPresensiPulang(siswaId, data) {
    const [result] = await db.query(
      `UPDATE presensi SET 
        waktu_pulang = NOW(), 
        latitude_pulang = ?, 
        longitude_pulang = ?, 
        jarak_pulang = ?, 
        isi_jurnal = ?, 
        updated_at = NOW() 
       WHERE siswa_id = ? AND DATE(created_at) = CURDATE() AND jenis_presensi = 'hadir'`,
      [
        data.latitude || null,
        data.longitude || null,
        data.jarak || null,
        data.isiJurnal || null,
        siswaId
      ]
    );
    return result.affectedRows > 0;
  }

  /*
  |-------------------------------------------------------------------------------
  | Get Filtered Presence History for Student
  |-------------------------------------------------------------------------------
  | Method:         getPresensiHistoryFiltered
  | Description:    Gets student's presence records with optional date and status filters
  */
  static async getPresensiHistoryFiltered(siswaId, filters = {}) {
    let query = "SELECT * FROM presensi WHERE siswa_id = ?";
    const params = [siswaId];

    if (filters.tanggal_mulai) {
      query += " AND DATE(created_at) >= ?";
      params.push(filters.tanggal_mulai);
    }
    if (filters.tanggal_akhir) {
      query += " AND DATE(created_at) <= ?";
      params.push(filters.tanggal_akhir);
    }
    if (filters.jenis_presensi && filters.jenis_presensi !== "semua") {
      query += " AND jenis_presensi = ?";
      params.push(filters.jenis_presensi);
    }

    query += " ORDER BY created_at DESC";

    const [rows] = await db.query(query, params);
    return rows;
  }

  /*
  |-------------------------------------------------------------------------------
  | Get All Presence Logs
  |-------------------------------------------------------------------------------
  | Method:         getAllPresensiLogs
  | Description:    Gets all presence logs with optional filters (LEGACY - EMPTIED)
  */
  static async getAllPresensiLogs(filters = {}) {
    return [];
  }

  /*
  |-------------------------------------------------------------------------------
  | Get Presence Detail
  |-------------------------------------------------------------------------------
  | Method:         getPresensiDetail
  | Description:    Gets detail log entry by ID (LEGACY - EMPTIED)
  */
  static async getPresensiDetail(id) {
    return null;
  }
}

module.exports = Presensi;
