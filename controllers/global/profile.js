const User = require("../../model/user");

/*
|-------------------------------------------------------------------------------
| Show Profile Page
|-------------------------------------------------------------------------------
| URL:            /profile
| Controller:     global/profile@getProfilePage
| Method:         GET
| Description:    Renders the active user profile page
*/
const getProfilePage = (req, res) => {
  return res.render("profile", {
    title: "Profil Saya - EPresensi",
    activePage: "profile",
  });
};

/*
|-------------------------------------------------------------------------------
| Update Profile Details
|-------------------------------------------------------------------------------
| URL:            /profile
| Controller:     global/profile@updateProfile
| Method:         POST
| Description:    Updates active user profile details (nama, no_hp, and optionally password)
*/
const updateProfile = async (req, res, next) => {
  try {
    let { nama, no_hp, password } = req.body;

    // Body validation
    if (!nama) {
      return res.status(400).json({ success: false, message: "Nama wajib diisi" });
    }

    // Safe sanitization
    nama = String(nama).trim();
    no_hp = no_hp ? String(no_hp).trim() : "";
    password = password ? String(password) : "";

    if (nama.length === 0) {
      return res.status(400).json({ success: false, message: "Nama tidak boleh kosong!" });
    }

    if (password && password.length < 5) {
      return res.status(400).json({ success: false, message: "Kata sandi baru minimal 5 karakter!" });
    }

    const data = { nama, no_hp };
    if (password) {
      data.password = password;
    }

    const updated = await User.updateProfile(req.user.id, data);

    if (updated) {
      return res.json({ success: true, message: "Profil berhasil diperbarui" });
    } else {
      return res.status(500).json({ success: false, message: "Gagal memperbarui profil" });
    }
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getProfilePage,
  updateProfile,
};
