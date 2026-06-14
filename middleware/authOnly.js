const User = require("../model/user");

const authOnly = async (req, res, next) => {
  if (req.session && req.session.userId) {
    try {
      const user = await User.findById(req.session.userId);
      if (user && user.is_active) {
        req.user = user;
        res.locals.user = user;
        return next();
      }
    } catch (err) {
      console.error("Auth middleware error:", err);
    }
  }

  // If not authenticated, check request path type
  if (req.path.startsWith("/api/")) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized. Please log in first." });
  }

  return res.redirect("/login");
};

module.exports = authOnly;
