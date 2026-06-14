/*
|-------------------------------------------------------------------------------
| Show Admin Siswa Page
|-------------------------------------------------------------------------------
| URL:            /admin/siswa
| Controller:     admin/siswa@getSiswaPage
| Method:         GET
| Description:    Renders the active list of registered students (LEGACY - EMPTIED)
*/
const getSiswaPage = async (req, res, next) => {
  return res.render("admin/siswa/index", {
    title: "Kelola Siswa - EPresensi",
    activePage: "siswa",
    siswaList: [],
  });
};

/*
|-------------------------------------------------------------------------------
| Show Add Siswa Page
|-------------------------------------------------------------------------------
| URL:            /admin/siswa/tambah
| Controller:     admin/siswa@getTambahSiswaPage
| Method:         GET
| Description:    Renders form to create new student user account (LEGACY - EMPTIED)
*/
const getTambahSiswaPage = (req, res) => {
  return res.render("admin/siswa/tambah", {
    title: "Tambah Siswa - EPresensi",
    activePage: "siswa",
  });
};

/*
|-------------------------------------------------------------------------------
| Show Edit Siswa Page
|-------------------------------------------------------------------------------
| URL:            /admin/siswa/edit/{id}
| Controller:     admin/siswa@getEditSiswaPage
| Method:         GET
| Description:    Renders form to edit active student details (LEGACY - EMPTIED)
*/
const getEditSiswaPage = async (req, res, next) => {
  return res.render("admin/siswa/edit", {
    title: "Edit Siswa - EPresensi",
    activePage: "siswa",
    targetSiswa: {
      id: req.params.id,
      nama: "",
      username: "",
      nomor_induk: "",
      kelas: "",
      no_hp: "",
      is_active: true
    },
  });
};

/*
|-------------------------------------------------------------------------------
| API Create Siswa
|-------------------------------------------------------------------------------
| URL:            /api/admin/siswa
| Controller:     admin/siswa@apiCreateSiswa
| Method:         POST
| Description:    Creates new student record in database (LEGACY - EMPTIED)
*/
const apiCreateSiswa = async (req, res, next) => {
  return res.status(201).json({ success: true, message: "Siswa berhasil dibuat" });
};

/*
|-------------------------------------------------------------------------------
| API Update Siswa
|-------------------------------------------------------------------------------
| URL:            /api/admin/siswa/{id}
| Controller:     admin/siswa@apiUpdateSiswa
| Method:         PUT
| Description:    Updates existing student details in database (LEGACY - EMPTIED)
*/
const apiUpdateSiswa = async (req, res, next) => {
  return res.json({ success: true, message: "Siswa berhasil diperbarui" });
};

/*
|-------------------------------------------------------------------------------
| API Delete Siswa
|-------------------------------------------------------------------------------
| URL:            /api/admin/siswa/{id}
| Controller:     admin/siswa@apiDeleteSiswa
| Method:         DELETE
| Description:    Removes a student account and logs from database (LEGACY - EMPTIED)
*/
const apiDeleteSiswa = async (req, res, next) => {
  return res.json({ success: true, message: "Siswa berhasil dihapus" });
};

module.exports = {
  getSiswaPage,
  getTambahSiswaPage,
  getEditSiswaPage,
  apiCreateSiswa,
  apiUpdateSiswa,
  apiDeleteSiswa,
};
