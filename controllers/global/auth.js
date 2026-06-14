const User = require("../../model/user");

/*
|-------------------------------------------------------------------------------
| Show Login Page
|-------------------------------------------------------------------------------
| URL:            /login
| Controller:     global/auth@getLoginPage
| Method:         GET
| Description:    Renders the login page view or redirects if already authenticated
*/
const getLoginPage = (req, res) => {
  if (req.session && req.session.userId) {
    return res.redirect("/");
  }
  return res.render("login", { title: "Login - EPresensi" });
};

/*
|-------------------------------------------------------------------------------
| Process User Login
|-------------------------------------------------------------------------------
| URL:            /login
| Controller:     global/auth@login
| Method:         POST
| Description:    Validates login credentials and starts user session
*/
const login = async (req, res, next) => {
  try {
    let { username, password } = req.body;

    // Body validation and sanitization
    if (!username || !password) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Username dan password wajib diisi!",
        });
    }

    username = String(username).trim();
    password = String(password);

    if (username.length === 0 || password.length === 0) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Username dan password tidak boleh kosong!",
        });
    }

    const user = await User.findByUsername(username);

    if (!user || !user.is_active) {
      return res
        .status(401)
        .json({ success: false, message: "Username atau password salah!" });
    }

    const passwordMatches = await user.verifyPassword(password);

    if (!passwordMatches) {
      return res
        .status(401)
        .json({ success: false, message: "Username atau password salah!" });
    }

    // Set User Session
    req.session.userId = user.id;

    return res.json({ success: true, message: "Login berhasil!" });
  } catch (error) {
    return next(error);
  }
};

/*
|-------------------------------------------------------------------------------
| Process User Logout
|-------------------------------------------------------------------------------
| URL:            /logout
| Controller:     global/auth@logout
| Method:         GET
| Description:    Destroys active user session and redirects to login page
*/
const logout = (req, res) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        console.error("Session destroy error:", err);
      }
      res.clearCookie("connect.sid");
      return res.redirect("/login");
    });
  } else {
    return res.redirect("/login");
  }
};

module.exports = {
  getLoginPage,
  login,
  logout,
};
