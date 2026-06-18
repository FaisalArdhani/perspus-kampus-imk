// ======================
// AMBIL DATA
// ======================

const bookContainer = document.getElementById("bookContainer");

const selectedBook = JSON.parse(localStorage.getItem("selectedBook"));

function getUserId(user) {
    return user.nim || user.nidn || user.username;
}

// ======================
// BELUM ADA BUKU DIPILIH
// ======================

if (!selectedBook) {
    bookContainer.innerHTML = `

        <div class="empty-state">

            <h2>
                Belum Ada Pengajuan Peminjaman
            </h2>

            <p>
                Silakan pilih buku dari katalog
            </p>

            <a
                href="katalog.html"
                class="btn-katalog"
            >
                Cari Buku
            </a>

        </div>

    `;
}

// ======================
// ADA BUKU DIPILIH
// ======================
else {
    const today = new Date();

    const formatDate = (date) => {
        return date.toISOString().split("T")[0];
    };

    bookContainer.innerHTML = `

        <div class="pinjam-wrapper">

            <div class="book-pinjam">

                <h3>
                    Buku Yang Dipinjam
                </h3>

                <div class="book-detail">

                    <img
                        src="${selectedBook.cover}"
                        alt="${selectedBook.judul}"
                    >

                    <div>

                        <h2>
                            ${selectedBook.judul}
                        </h2>

                        <p>
                            ${selectedBook.penulis}
                        </p>

                        <p>
                            ${selectedBook.kategori}
                        </p>

                        <p class="stok">

                            Tersedia :
                            ${selectedBook.stok}

                        </p>

                    </div>

                </div>

            </div>

            <div class="form-pinjam">

                <h3>
                    Informasi Peminjaman
                </h3>

                <label>
                    Tanggal Pinjam
                </label>

                <input
                    type="date"
                    id="tanggalPinjam"
                    min="${formatDate(today)}"
                    value="${formatDate(today)}"
                >

                <label>
                    Tanggal Kembali
                    (maksimal 7 hari)
                </label>

                <input
                    type="date"
                    id="tanggalKembali"
                >

                <small>
                    Maksimal peminjaman 7 hari
                </small>

                <button
                    id="btnAjukan"
                    class="btn-ajukan"
                >
                    Ajukan Peminjaman
                </button>

            </div>

        </div>

    `;

    // ======================
    // TANGGAL
    // ======================

    const tanggalPinjam = document.getElementById("tanggalPinjam");

    const tanggalKembali = document.getElementById("tanggalKembali");

    function updateTanggalKembali() {
        const pinjamDate = new Date(tanggalPinjam.value);

        const maxDate = new Date(pinjamDate);

        maxDate.setDate(maxDate.getDate() + 7);

        tanggalKembali.min = tanggalPinjam.value;

        tanggalKembali.max = maxDate.toISOString().split("T")[0];

        if (!tanggalKembali.value) {
            tanggalKembali.value = tanggalKembali.max;
        }
    }

    updateTanggalKembali();

    tanggalPinjam.addEventListener(
        "change",

        updateTanggalKembali,
    );
}

// ======================
// AJUKAN PINJAMAN
// ======================

document.addEventListener(
    "click",

    function (e) {
        if (e.target.id === "btnAjukan") {
            const tanggalPinjam = document.getElementById("tanggalPinjam").value;

            const tanggalKembali = document.getElementById("tanggalKembali").value;

            if (!tanggalKembali) {
                alert("Pilih tanggal kembali terlebih dahulu!");

                return;
            }

            let history = JSON.parse(localStorage.getItem("borrowHistory")) || [];

            const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
            const alreadyBorrowed = history.some(
                (item) =>
                    item.userId === currentUser.nim &&
                    item.judul === selectedBook.judul &&
                    item.status !== "Ditolak" &&
                    item.status !== "Dikembalikan",
            );

            if (alreadyBorrowed) {
                alert("Buku ini sudah pernah diajukan atau sedang dipinjam.");
                return;
            }
            history.push({
                id: Date.now(),

                userId: getUserId(currentUser),

                nama: currentUser.nama,

                nim: currentUser.nim,

                judul: selectedBook.judul,

                penulis: selectedBook.penulis,

                cover: selectedBook.cover,

                kategori: selectedBook.kategori,

                tanggalPinjam,

                tanggalKembali,

                status: "Menunggu Persetujuan",
            });

            let notifications =
                JSON.parse(localStorage.getItem("notifications")) || [];

            notifications.unshift({
                id: Date.now(),

                userId: currentUser.nim,

                pesan: `Pengajuan peminjaman "${selectedBook.judul}" berhasil dikirim`,

                tanggal: new Date().toLocaleDateString("id-ID"),

                dibaca: false,
            });

            localStorage.setItem(
                "notifications",

                JSON.stringify(notifications),
            );

            localStorage.setItem(
                "borrowHistory",

                JSON.stringify(history),
            );

            localStorage.removeItem("selectedBook");

            alert("Pengajuan peminjaman berhasil!");

            window.location.href = "riwayat.html";
        }
    },
);

// ======================
// HAMBURGER MENU
// ======================

const hamburger = document.getElementById("hamburger");

const navMenu = document.getElementById("navMenu");

if (hamburger && navMenu) {
    hamburger.addEventListener(
        "click",

        () => {
            navMenu.classList.toggle("show");
        },
    );
}
