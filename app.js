const express = require("express");
const cors = require("cors");
const path = require("path");
const session = require("express-session");
require("dotenv").config();

const app = express();

// Set View Engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Session Configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || "epresensi-super-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set to true if using HTTPS
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

// Load Middlewares
const authOnly = require("./middleware/authOnly");
const roleOnly = require("./middleware/roleOnly");

// Controllers
const authController = require("./controllers/global/auth");
const profileController = require("./controllers/global/profile");
const siswaDashboardController = require("./controllers/siswa/dashboard");
const adminDashboardController = require("./controllers/admin/dashboard");
const adminSiswaController = require("./controllers/admin/siswa");
const adminPresensiController = require("./controllers/admin/presensi");
const adminPengaturanController = require("./controllers/admin/pengaturan");

// --- PUBLIC ROUTES ---
app.get("/login", authController.getLoginPage);
app.post("/login", authController.login);
app.get("/logout", authController.logout);

// --- PROTECTED ROUTES (Requires Auth) ---
app.use(authOnly);

// Root path routing
app.get("/", (req, res, next) => {
  if (req.user.role === "admin") {
    return adminDashboardController.getDashboardPage(req, res, next);
  } else if (req.user.role === "siswa") {
    return siswaDashboardController.getDashboardPage(req, res, next);
  } else {
    return res.status(403).send("Hak akses tidak dikenal.");
  }
});

// Profile Management
app.get("/profile", profileController.getProfilePage);
app.post("/profile", profileController.updateProfile);

// --- SISWA PORTAL API ---
app.get("/presensi", roleOnly("siswa"), siswaDashboardController.getPresensiHistoryPage);
app.get("/presensi/tambah", roleOnly("siswa"), siswaDashboardController.getPresensiPage);
app.post("/api/presensi/masuk", roleOnly("siswa"), siswaDashboardController.submitPresensiMasuk);
app.post("/api/presensi/pulang", roleOnly("siswa"), siswaDashboardController.submitPresensiPulang);

// --- ADMIN PORTAL ROUTES ---
// Admin: Siswa CRUD
app.get("/admin/siswa", roleOnly("admin"), adminSiswaController.getSiswaPage);
app.get("/admin/siswa/tambah", roleOnly("admin"), adminSiswaController.getTambahSiswaPage);
app.get("/admin/siswa/edit/:id", roleOnly("admin"), adminSiswaController.getEditSiswaPage);

app.post("/api/admin/siswa", roleOnly("admin"), adminSiswaController.apiCreateSiswa);
app.post("/api/admin/siswa/update/:id", roleOnly("admin"), adminSiswaController.apiUpdateSiswa);
app.get("/api/admin/siswa/delete/:id", roleOnly("admin"), adminSiswaController.apiDeleteSiswa);

// Admin: Attendance logs
app.get("/admin/presensi", roleOnly("admin"), adminPresensiController.getPresensiPage);
app.get("/admin/presensi/detail/:id", roleOnly("admin"), adminPresensiController.getPresensiDetailPage);

// Admin: Configuration pengaturan
app.get("/admin/pengaturan", roleOnly("admin"), adminPengaturanController.getSettingsPage);
app.post("/api/admin/pengaturan", roleOnly("admin"), adminPengaturanController.apiUpdateSettings);

// --- ERROR HANDLERS ---
app.use((req, res) => {
  return res.status(404).send("Halaman tidak ditemukan (404)");
});

app.use((err, req, res, next) => {
  console.error(err);
  return res.status(500).send("Terjadi kesalahan server internal (500)");
});

const PORT = process.env.APP_PORT || 3000;

app.listen(PORT, () => {
  console.log(`EPresensi server is running on http://localhost:${PORT}`);
});
