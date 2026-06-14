const db = require("../config/db");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

class User {
  constructor(attributes = {}) {
    this.id = attributes.id || null;
    this.nama = attributes.nama || null;
    this.username = attributes.username || null;
    this.password = attributes.password || null;
    this.nomor_induk = attributes.nomor_induk || null;
    this.role = attributes.role || null;
    this.kelas = attributes.kelas || null;
    this.no_hp = attributes.no_hp || null;
    this.profil_foto = attributes.profil_foto || null;
    this.is_active = attributes.is_active !== undefined ? attributes.is_active : true;
    this.created_at = attributes.created_at || null;
    this.updated_at = attributes.updated_at || null;
  }

  /*
  |-------------------------------------------------------------------------------
  | Find User By Username
  |-------------------------------------------------------------------------------
  | Method:         findByUsername
  | Description:    Finds a user record in database matching username
  */
  static async findByUsername(username) {
    const [rows] = await db.query("SELECT * FROM users WHERE username = ? LIMIT 1", [username]);
    if (rows.length === 0) return null;
    return new User(rows[0]);
  }

  /*
  |-------------------------------------------------------------------------------
  | Find User By ID
  |-------------------------------------------------------------------------------
  | Method:         findById
  | Description:    Finds a user record in database matching user ID
  */
  static async findById(id) {
    const [rows] = await db.query("SELECT * FROM users WHERE id = ? LIMIT 1", [id]);
    if (rows.length === 0) return null;
    return new User(rows[0]);
  }

  /*
  |-------------------------------------------------------------------------------
  | Verify User Password
  |-------------------------------------------------------------------------------
  | Method:         verifyPassword
  | Description:    Verifies plain password against stored hash (MD5 or bcrypt)
  */
  async verifyPassword(plainPassword) {
    const hashed = this.password;
    if (!hashed) return false;
    const isMd5 = /^[a-f0-9]{32}$/i.test(hashed);
    if (isMd5) {
      const md5Hash = crypto.createHash("md5").update(plainPassword).digest("hex");
      return md5Hash === hashed;
    }
    try {
      return await bcrypt.compare(plainPassword, hashed);
    } catch (e) {
      return false;
    }
  }

  /*
  |-------------------------------------------------------------------------------
  | Update Profile Details
  |-------------------------------------------------------------------------------
  | Method:         updateProfile
  | Description:    Updates user profile details (nama, no_hp, and optionally password)
  */
  static async updateProfile(id, data) {
    let query = "UPDATE users SET nama = ?, no_hp = ?, updated_at = NOW()";
    const params = [data.nama, data.no_hp || null];

    if (data.password) {
      const hashedPassword = await bcrypt.hash(data.password, 10);
      query += ", password = ?";
      params.push(hashedPassword);
    }

    query += " WHERE id = ?";
    params.push(id);

    const [result] = await db.query(query, params);
    return result.affectedRows > 0;
  }

  /*
  |-------------------------------------------------------------------------------
  | Get All Siswa
  |-------------------------------------------------------------------------------
  | Method:         getAllSiswa
  | Description:    Gets all users with role siswa (LEGACY - EMPTIED)
  */
  static async getAllSiswa() {
    return [];
  }

  /*
  |-------------------------------------------------------------------------------
  | Create Siswa Record
  |-------------------------------------------------------------------------------
  | Method:         createSiswa
  | Description:    Creates new siswa user (LEGACY - EMPTIED)
  */
  static async createSiswa(data) {
    return null;
  }

  /*
  |-------------------------------------------------------------------------------
  | Update Siswa Record
  |-------------------------------------------------------------------------------
  | Method:         updateSiswa
  | Description:    Updates active siswa record (LEGACY - EMPTIED)
  */
  static async updateSiswa(id, data) {
    return false;
  }

  /*
  |-------------------------------------------------------------------------------
  | Delete Siswa Record
  |-------------------------------------------------------------------------------
  | Method:         deleteSiswa
  | Description:    Deletes siswa record from database (LEGACY - EMPTIED)
  */
  static async deleteSiswa(id) {
    return false;
  }
}

module.exports = User;
