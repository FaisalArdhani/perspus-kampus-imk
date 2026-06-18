const container = document.getElementById("riwayatContainer");

const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
function getUserId(user) {
    return user.nim || user.nidn || user.username;
}

const allHistory = JSON.parse(localStorage.getItem("borrowHistory")) || [];

const history = allHistory.filter((item) => item.userId === getUserId(currentUser));

if (history.length === 0) {
    container.innerHTML = `
        <div class="empty-state">
            <h2>
                Belum Ada Riwayat Peminjaman
            </h2>
            <p>
                Silakan pinjam buku terlebih dahulu
            </p>
            <a
                href="katalog.html"
                class="btn-katalog"
            >
                Cari Buku
            </a>
        </div>
    `;
} else {
    history.reverse();
    history.forEach((item) => {
        let badgeClass = "badge-menunggu";
        if (item.status === "Dipinjam") {
            badgeClass = "badge-dipinjam";
        }
        if (item.status === "Dikembalikan") {
            badgeClass = "badge-kembali";
        }
        container.innerHTML += `
            <div
                class="riwayat-card"
            >
                <img
                    src="${item.cover}"
                    alt="${item.judul}"
                >
                <div
                    class="riwayat-info"
                >
                    <h3>
                        ${item.judul}
                    </h3>

                    <p>
                        ${item.penulis}
                    </p>
                    <p>
                        Tanggal Pinjam :
                        ${item.tanggalPinjam}
                    </p>
                    <p>
                        Tanggal Kembali :
                        ${item.tanggalKembali}
                    </p>
                    <span
                        class="
                        status-badge
                        ${badgeClass}
                        "
                    >
                        ${item.status}
                    </span>
                </div>
            </div>
        `;
    });
}

// HAMBURGER

const hamburger = document.getElementById("hamburger");
const navMenu = document.getElementById("navMenu");
if (hamburger && navMenu) {
    hamburger.addEventListener("click", () => {
        navMenu.classList.toggle("show");
    });
}
