/*
|-------------------------------------------------------------------------------
| Show Admin Siswa Page
|-------------------------------------------------------------------------------
| URL:            /admin/siswa
| Controller:     admin/siswa@getSiswaPage
| Method:         GET
| Description:    Renders the active list of registered students (LEGACY - EMPTIED)
*/
const User = require('../../model/user');
const bcrypt = require('bcrypt');

const getSiswaPage = async (req, res) => {
    try {
        const siswaList = await User.getAllSiswa();
        res.render('admin/siswa/index', { 
            title: 'Manajemen Siswa',
            siswa: siswaList, 
            user: req.user
        });
    } catch (error) {
        console.error("DETAIL ERROR DARI SERVER:", error);
        res.status(500).send("Terjadi kesalahan pada server internal (500)");
    }
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
    res.render("admin/siswa/tambah", {
        title: "Tambah Siswa - EPresensi",
        activePage: "siswa",
        user: req.user
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
    try {
        const id = req.params.id;
        const targetSiswa = await User.getSiswaById(id); 
        
        if (!targetSiswa) return res.status(404).send("Siswa tidak ditemukan");

        return res.render("admin/siswa/edit", {
            title: "Edit Siswa - EPresensi",
            activePage: "siswa",
            siswa: targetSiswa, 
            user: req.user
        });
    } catch (error) {
        console.error("DETAIL ERROR DARI SERVER:", error);
        res.status(500).send("Terjadi kesalahan server internal (500)");
    }
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
/*
|-------------------------------------------------------------------------------
| API Create Siswa
|-------------------------------------------------------------------------------
*/
const apiCreateSiswa = async (req, res, next) => {
    try {
        const username = req.body.username.trim();
        const nama_lengkap = req.body.nama_lengkap.trim();
        const kelas = req.body.kelas.trim();
        const no_hp = req.body.no_hp.trim();
        
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

        await User.createSiswa({ username, password: hashedPassword, nama_lengkap, kelas, no_hp });
        
        return res.redirect('/admin/siswa?status=sukses'); 
    } catch (error) {
        console.error(error);
        return res.status(500).send("Gagal menyimpan data siswa");
    }
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
    try {
        const id = req.params.id;
        const username = req.body.username.trim();
        const nama_lengkap = req.body.nama_lengkap.trim();
        const kelas = req.body.kelas.trim();
        const no_hp = req.body.no_hp.trim();
        
        let hashedPassword = null;
        if (req.body.password && req.body.password.trim() !== '') {
            const saltRounds = 10;
            hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
        }

        await User.updateSiswa(id, { username, password: hashedPassword, nama_lengkap, kelas, no_hp });
      
        return res.redirect('/admin/siswa?status=diperbarui'); 
    } catch (error) {
        console.error(error);
        return res.status(500).send("Gagal mengupdate data siswa");
    }
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
    try {
        const id = req.params.id;
        
        await User.deleteSiswa(id);
        
        return res.redirect('/admin/siswa?status=dihapus'); 
    } catch (error) {
        console.error(error);
        return res.status(500).send("Gagal menghapus data siswa");
    }
};

module.exports = {
  getSiswaPage,
  getTambahSiswaPage,
  getEditSiswaPage,
  apiCreateSiswa,
  apiUpdateSiswa,
  apiDeleteSiswa,
};
