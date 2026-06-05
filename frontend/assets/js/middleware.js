const auth = JSON.parse(localStorage.getItem("auth"));

function redirectToLogin() {
  window.location.href = "/frontend/pages/global/login.html";
}

function redirectByRole(role) {
  if (role === "admin") {
    window.location.href = "/frontend/pages/admin/dashboard.html";
  } else if (role === "siswa") {
    window.location.href = "/frontend/pages/siswa/dashboard.html";
  } else {
    redirectToLogin();
  }
}

function requireAuth() {
  if (!auth) {
    redirectToLogin();
  }
}

function requireGuest() {
  if (auth) {
    redirectByRole(auth.role);
  }
}

function requireRole(roles = []) {
  requireAuth();

  if (!roles.includes(auth.role)) {
    redirectByRole(auth.role);
  }
}
