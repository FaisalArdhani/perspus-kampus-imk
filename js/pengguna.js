// =====================
// USERS ADMIN TABLE
// =====================

(function () {
    const currentUserRaw = sessionStorage.getItem("currentUser");
    if (!currentUserRaw) {
        window.location.href = "../login.html";
        return;
    }

    try {
        JSON.parse(currentUserRaw);
    } catch (e) { }

    document.addEventListener("DOMContentLoaded", initPenggunaAdmin);
})();

function initPenggunaAdmin() {
    const tbody = document.getElementById("userTableBody");
    const searchInput = document.getElementById("userSearchInput");
    const emptyState = document.getElementById("userEmptyState");

    if (!tbody) return;

    const allUsers = loadUsersFromStorageOrFallback().filter(
        user =>
            user.role === "mahasiswa" ||
            user.role === "dosen"
    );

    const render = (data) => {
        tbody.innerHTML = "";

        if (!data.length) {
            if (emptyState) emptyState.style.display = "block";
            return;
        }

        if (emptyState) emptyState.style.display = "none";

        data.forEach((u, i) => {
            const noTelp = u.noTelp || "-";
            const email = u.email || "-";
            const jenis = getJenisLabel(u);
            const nama = u.nama || u.username || "-";

            tbody.insertAdjacentHTML(
                "beforeend",
                `
        <tr>
          <td style="padding: 12px 10px; border-bottom:1px solid #f0f2f5">${i + 1}</td>
          <td style="padding: 12px 10px; border-bottom:1px solid #f0f2f5">${escapeHtml(nama)}</td>
          <td style="padding: 12px 10px; border-bottom:1px solid #f0f2f5">${escapeHtml(jenis)}</td>
          <td style="padding: 12px 10px; border-bottom:1px solid #f0f2f5">${escapeHtml(noTelp)}</td>
          <td style="padding: 12px 10px; border-bottom:1px solid #f0f2f5">${escapeHtml(email)}</td>
        </tr>
      `
            );
        });
    };

    const filter = (keyword) => {
        const q = String(keyword || "").trim().toLowerCase();
        if (!q) return allUsers;

        return allUsers.filter((u) => {
            const nama = String(u.nama || u.username || "").toLowerCase();
            const nimNidn = String(u.nim || u.nidn || "").toLowerCase();
            const email = String(u.email || "").toLowerCase();
            const noTelp = String(u.noTelp || "").toLowerCase();
            const jenis = getJenisLabel(u).toLowerCase();

            return (
                nama.includes(q) ||
                nimNidn.includes(q) ||
                email.includes(q) ||
                noTelp.includes(q) ||
                jenis.includes(q)
            );
        });
    };

    render(allUsers);

    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            render(filter(e.target.value));
        });
    }
}

function loadUsersFromStorageOrFallback() {
    // 1) coba ambil dari localStorage (kalau kamu pernah simpan users)
    try {
        const storedRaw = localStorage.getItem("users");
        if (storedRaw) {
            const stored = JSON.parse(storedRaw);
            if (Array.isArray(stored) && stored.length) return stored;
        }
    } catch (e) { }

    // 2) fallback ke global `users` dari js/storage.js
    try {
        if (typeof users !== "undefined" && Array.isArray(users) && users.length) return users;
    } catch (e) { }

    return [];
}

function getJenisLabel(u) {
    if (!u) return "-";
    const role = u.role || "";
    switch (role) {
        case "mahasiswa":
            return "Mahasiswa";
        case "dosen":
            return "Dosen";
        case "petugas":
            return "Petugas";
        default:
            return role ? String(role) : "-";
    }
}

function escapeHtml(str) {
    return String(str)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "<")
        .replaceAll(">", ">")
        .replaceAll('"', '"')
        .replaceAll("'", "&#039;");
}

