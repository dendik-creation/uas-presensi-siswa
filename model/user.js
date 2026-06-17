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
  */
  static async getAllSiswa() {
    const [rows] = await db.query(
      "SELECT id, username, nama AS nama_lengkap, kelas, no_hp FROM users WHERE role = 'siswa' ORDER BY id DESC"
    );
    return rows;
  }

  /*
  |-------------------------------------------------------------------------------
  | Get Siswa By ID (Khusus Untuk Halaman Edit)
  |-------------------------------------------------------------------------------
  */
  static async getSiswaById(id) {
    const [rows] = await db.query(
      "SELECT id, username, nama AS nama_lengkap, kelas, no_hp FROM users WHERE id = ? AND role = 'siswa' LIMIT 1", 
      [id]
    );
    if (rows.length === 0) return null;
    return rows[0];
  }

  /*
  |-------------------------------------------------------------------------------
  | Create Siswa Record
  |-------------------------------------------------------------------------------
  */
  static async createSiswa(data) {
    const query = `
      INSERT INTO users (username, password, nama, kelas, no_hp, role, is_active, created_at)
      VALUES (?, ?, ?, ?, ?, 'siswa', 1, NOW())
    `;
    const params = [
      data.username, 
      data.password, 
      data.nama_lengkap, 
      data.kelas, 
      data.no_hp || null
    ];
    
    const [result] = await db.query(query, params);
    return result.insertId;
  }

  /*
  |-------------------------------------------------------------------------------
  | Update Siswa Record
  |-------------------------------------------------------------------------------
  */
  static async updateSiswa(id, data) {
    let query = "UPDATE users SET username = ?, nama = ?, kelas = ?, no_hp = ?, updated_at = NOW()";
    const params = [data.username, data.nama_lengkap, data.kelas, data.no_hp || null];

    if (data.password) {
      query += ", password = ?";
      params.push(data.password);
    }

    query += " WHERE id = ? AND role = 'siswa'";
    params.push(id);

    const [result] = await db.query(query, params);
    return result.affectedRows > 0;
  }

  /*
  |-------------------------------------------------------------------------------
  | Delete Siswa Record
  |-------------------------------------------------------------------------------
  */
  static async deleteSiswa(id) {
    const [result] = await db.query("DELETE FROM users WHERE id = ? AND role = 'siswa'", [id]);
    return result.affectedRows > 0;
  }
}

module.exports = User;