document.addEventListener("DOMContentLoaded", () => {

    loadAccountSettings();
    loadSystemSettings();

});

function loadAccountSettings() {

    const admin =
        JSON.parse(localStorage.getItem("currentUser"));

    if (!admin) return;

    document.getElementById("adminNama").value =
        admin.nama || "";

    document.getElementById("adminEmail").value =
        admin.email || "";

    document.getElementById("adminPhone").value =
        admin.noTelp || "";
}

function loadSystemSettings() {

    const settings =
        JSON.parse(
            localStorage.getItem("systemSettings")
        ) || {
            lamaPinjam: 7,
            denda: 5000,
            emailNotif: "aktif"
        };

    document.getElementById("lamaPinjam").value =
        settings.lamaPinjam;

    document.getElementById("dendaHarian").value =
        settings.denda;

    document.getElementById("emailNotif").value =
        settings.emailNotif;
}

// SIMPAN AKUN

document
    .getElementById("accountForm")
    .addEventListener("submit", (e) => {

        e.preventDefault();

        const currentUser =
            JSON.parse(localStorage.getItem("currentUser"));

        let users =
            JSON.parse(localStorage.getItem("users")) || [];

        const index =
            users.findIndex(
                user => user.id === currentUser.id
            );

        if (index === -1) {
            alert("Petugas tidak ditemukan");
            return;
        }

        users[index].nama =
            document.getElementById("adminNama").value;

        users[index].email =
            document.getElementById("adminEmail").value;

        users[index].noTelp =
            document.getElementById("adminPhone").value;

        const passwordBaru =
            document.getElementById("newPassword").value;

        if (passwordBaru.trim() !== "") {
            users[index].password = passwordBaru;
        }

        localStorage.setItem(
            "users",
            JSON.stringify(users)
        );

        localStorage.setItem(
            "currentUser",
            JSON.stringify(users[index])
        );

        alert("Data akun berhasil diperbarui");

    });

// SIMPAN SISTEM

document
    .getElementById("systemForm")
    .addEventListener("submit", (e) => {

        e.preventDefault();

        const settings = {

            lamaPinjam: Number(
                document.getElementById("lamaPinjam").value
            ),

            denda: Number(
                document.getElementById("dendaHarian").value
            ),

            emailNotif:
                document.getElementById("emailNotif").value

        };

        localStorage.setItem(
            "systemSettings",
            JSON.stringify(settings)
        );

        alert("Pengaturan sistem berhasil disimpan");

    });

// BACKUP

document
    .getElementById("backupBtn")
    .addEventListener("click", () => {

        const data = {
            books: JSON.parse(localStorage.getItem("books")),
            peminjaman: JSON.parse(localStorage.getItem("peminjaman")),
            users: JSON.parse(localStorage.getItem("users"))
        };

        const blob = new Blob(
            [JSON.stringify(data, null, 2)],
            { type: "application/json" }
        );

        const url =
            URL.createObjectURL(blob);

        const a =
            document.createElement("a");

        a.href = url;

        a.download = "backup-perpuskampus.json";

        a.click();

    });