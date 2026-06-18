const profileContainer = document.getElementById("profileContainer");

const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
if (!currentUser) {
    window.location.href = "../login.html";
}

const allHistory = JSON.parse(localStorage.getItem("borrowHistory")) || [];

const userIdKey = currentUser.role === "dosen" ? currentUser.nidn : currentUser.nim;

const history = allHistory.filter((item) => item.userId === userIdKey);

const totalPinjam = history.filter((item) => item.status === "Dipinjam").length;

const totalMenunggu = history.filter((item) => item.status === "Menunggu Persetujuan").length;

const totalKembali = history.filter((item) => item.status === "Dikembalikan").length;

profileContainer.innerHTML = `

<div class="profile-card">

    <div class="avatar">

        👤

    </div>

    <h2>

        ${currentUser.nama}

    </h2>

    <div class="profile-info">

        <p>

            <strong>
                ${currentUser.role === "dosen" ? "NIDN" : "NIM"} :
            </strong>

            ${currentUser.role === "dosen" ? currentUser.nidn : currentUser.nim}


        </p>

        <p>

            <strong>
                Jurusan :
            </strong>

            ${currentUser.jurusan}

        </p>

        <p>

            <strong>
                ${currentUser.role === "dosen" ? "Mata Kuliah" : "Semester"} :
            </strong>

            ${currentUser.role === "dosen" ? (Array.isArray(currentUser.mataKuliah) ? currentUser.mataKuliah.join(", ") : "-") : currentUser.semester}

        </p>

        <p>

            <strong>
                Email :
            </strong>

            ${currentUser.email}

        </p>

        <p>

            <strong>
                Telepon :
            </strong>

            ${currentUser.noTelp}

        </p>

    </div>

    <div class="profile-stats">

        <div>

            <h3>
                ${totalPinjam}
            </h3>

            <p>
                Dipinjam
            </p>

        </div>

        <div>

            <h3>
                ${totalMenunggu}
            </h3>

            <p>
                Menunggu
            </p>

        </div>

        <div>

            <h3>
                ${totalKembali}
            </h3>

            <p>
                Dikembalikan
            </p>

        </div>

    </div>

    <div class="profile-actions">

        <button
            class="btn-edit"
            onclick="openEditModal()"
        >
            Edit Profil
        </button>

        <button
            class="btn-logout"
            onclick="logout()"
        >
            Logout
        </button>

    </div>

</div>

`;

document.body.innerHTML += `

<div
    class="modal"
    id="editModal"
>

    <div class="modal-content">

        <span
            class="close-btn"
            onclick="closeEditModal()"
        >
            &times;
        </span>

        <h2>
            Edit Profil
        </h2>

        <div class="form-pinjam">

            <label>
                Nama
            </label>

            <input
                type="text"
                id="editNama"
                value="${currentUser.nama}"
            >

            <label>
                Email
            </label>

            <input
                type="email"
                id="editEmail"
                value="${currentUser.email}"
            >

            <label>
                Nomor Telepon
            </label>

            <input
                type="text"
                id="editTelp"
                value="${currentUser.noTelp}"
            >

            <button
                class="btn-ajukan"
                onclick="saveProfile()"
            >
                Simpan Perubahan
            </button>

        </div>

    </div>

</div>

`;

const hamburger = document.getElementById("hamburger");

const navMenu = document.getElementById("navMenu");

hamburger.addEventListener("click", () => {
    navMenu.classList.toggle("show");
});

function openEditModal() {
    document.getElementById("editModal").style.display = "flex";
}

function closeEditModal() {
    document.getElementById("editModal").style.display = "none";
}

function saveProfile() {
    const nama = document.getElementById("editNama").value.trim();

    const email = document.getElementById("editEmail").value.trim();

    const noTelp = document.getElementById("editTelp").value.trim();

    if (!nama || !email || !noTelp) {
        alert("Semua field wajib diisi!");

        return;
    }

    currentUser.nama = nama;

    currentUser.email = email;

    currentUser.noTelp = noTelp;

    localStorage.setItem("currentUser", JSON.stringify(currentUser));

    alert("Profil berhasil diperbarui!");

    location.reload();
}
