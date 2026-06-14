const roleOnly = (role) => {
  return (req, res, next) => {
    if (!req.user) {
      if (req.path.startsWith("/api/")) {
        return res.status(401).json({ success: false, message: "Unauthorized. Please log in first." });
      }
      return res.redirect("/login");
    }

    if (req.user.role !== role) {
      if (req.path.startsWith("/api/")) {
        return res.status(403).json({ success: false, message: "Forbidden. Access denied." });
      }
      return res.status(403).send("Akses ditolak: Anda tidak memiliki wewenang untuk membuka halaman ini.");
    }

    return next();
  };
};

module.exports = roleOnly;
