// Login
const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const identifier = document.getElementById("username").value.trim();

        const password = document.getElementById("password").value.trim();

        // Validasi input kosong
        if (!identifier || !password) {
            alert("Semua field harus diisi!");
            return;
        }

        let user = null;

        // login mahasiswa (NIM)
        // Awalan 2410
        if (identifier.startsWith("2410")) {
            user = users.find(
                (u) =>
                    u.role === "mahasiswa" &&
                    u.nim === identifier &&
                    u.password === password,
            );
        }

        // login dosen (NIDN)
        // Awalan 1810
        else if (identifier.startsWith("1810")) {
            user = users.find(
                (u) =>
                    u.role === "dosen" &&
                    u.nidn === identifier &&
                    u.password === password,
            );
        }
        // login petugas
        else {
            user = users.find(
                (u) =>
                    u.role === "petugas" &&
                    u.username === identifier &&
                    u.password === password,
            );
        }

        // User tidak ditemukan
        if (!user) {
            showPopup("Login Gagal", "Username / NIM / NIDN atau Password salah!");
            return;
        }

        // simpan session login
        sessionStorage.setItem("currentUser", JSON.stringify(user));

        // reset data pengajuan yang belum selesai
        localStorage.removeItem("selectedBook");

        // redicert berdasarkan role
        if (user.role === "petugas") {
            setTimeout(() => {
                window.location.href = "admin/dashboard.html";
            }, 500);
        } else {
            setTimeout(() => {
                window.location.href = "user/home.html";
            }, 500);
        }
    });
}

// Cek user login
function getCurrentUser() {
    return JSON.parse(sessionStorage.getItem("currentUser"));
}

// Verifikasi login - redirect ke login jika belum login
function requireLogin() {
    const user = getCurrentUser();
    if (!user) {
        window.location.href = "../login.html";
    }
}

// logout
function logout() {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("selectedBook");
    window.location.href = "../login.html";
}

function showPopup(title, message) {
    document.getElementById("popup-title").textContent = title;
    document.getElementById("popup-message").textContent = message;
    document.getElementById("popup").style.display = "flex";
}

function closePopup() {
    document.getElementById("popup").style.display = "none";
}
