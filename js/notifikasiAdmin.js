(function () {
    const currentUserRaw = sessionStorage.getItem("currentUser");
    if (!currentUserRaw) {
        window.location.href = "../login.html";
        return;
    }

    try {
        JSON.parse(currentUserRaw);
    } catch (e) { }

    document.addEventListener("DOMContentLoaded", initDendaAdmin);
})();

document.addEventListener("DOMContentLoaded", () => {

    loadAdminInfo();
    loadNotifications();

});

function loadAdminInfo() {

    const currentUser =
        JSON.parse(localStorage.getItem("currentUser"));

    if (currentUser) {

        document.getElementById("welcome").textContent =
            currentUser.nama;

    }

}

function loadNotifications() {

    const notificationList =
        document.getElementById("notificationList");

    const emptyNotification =
        document.getElementById("emptyNotification");

    const peminjaman =
        JSON.parse(localStorage.getItem("peminjaman")) || [];

    const systemSettings =
        JSON.parse(localStorage.getItem("systemSettings")) || {
            lamaPinjam: 7,
            denda: 5000
        };

    const today = new Date();

    let telatList = [];

    peminjaman.forEach(item => {

        if (item.status === "dikembalikan") return;

        const tanggalPinjam =
            new Date(item.tanggalPinjam);

        const batasKembali =
            new Date(tanggalPinjam);

        batasKembali.setDate(
            batasKembali.getDate() +
            systemSettings.lamaPinjam
        );

        if (today > batasKembali) {

            const selisihHari =
                Math.floor(
                    (today - batasKembali)
                    / (1000 * 60 * 60 * 24)
                );

            const totalDenda =
                selisihHari *
                systemSettings.denda;

            telatList.push({
                ...item,
                hariTelat: selisihHari,
                totalDenda
            });

        }

    });

    if (telatList.length === 0) {

        notificationList.innerHTML = "";

        emptyNotification.style.display =
            "block";

        return;

    }

    emptyNotification.style.display =
        "none";

    notificationList.innerHTML =
        telatList.map(item => `

        <div class="notification-card">

            <div class="notification-header">

                <div class="notification-title">
                    ⚠️ Keterlambatan Pengembalian
                </div>

                <strong>
                    ${item.hariTelat} Hari
                </strong>

            </div>

            <div class="notification-body">

                <p>
                    <strong>${item.nama}</strong>
                    terlambat mengembalikan buku
                    <strong>${item.judulBuku}</strong>
                </p>

                <p>
                    Total Denda:
                    <strong>
                        Rp ${item.totalDenda.toLocaleString("id-ID")}
                    </strong>
                </p>

            </div>

        </div>

    `).join("");

}