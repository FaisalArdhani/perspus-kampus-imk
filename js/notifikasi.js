const container = document.getElementById("notificationContainer");
const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
function getUserId(user) {
    return user.nim || user.nidn || user.username;
}

const allNotifications =
    JSON.parse(localStorage.getItem("notifications")) || [];

const notifications = allNotifications.filter(
    (notif) => notif.userId === getUserId(currentUser),
);

// ======================
// TAMPILKAN NOTIFIKASI
// ======================

if (notifications.length === 0) {
    container.innerHTML = `

        <div class="empty-state">

            <h2>
                Belum Ada Notifikasi
            </h2>

            <p>
                Semua notifikasi akan muncul di sini
            </p>

        </div>

    `;
} else {
    notifications.forEach((notif) => {
        container.innerHTML += `

                <div
                    class="
                    notification-card
                    ${!notif.dibaca ? "unread" : ""}
                    "
                >

                    <div
                        class="notif-icon"
                    >
                        🔔
                    </div>

                    <div
                        class="notif-content"
                    >

                        <p>

                            ${notif.pesan}

                        </p>

                        <small>

                            ${notif.tanggal}

                        </small>

                    </div>

                </div>

            `;
    });
}

// ======================
// SEMUA TERBACA
// ======================

allNotifications.forEach((notif) => {
    if (notif.userId === getUserId(currentUser)) {
        notif.dibaca = true;
    }
});

localStorage.setItem(
    "notifications",

    JSON.stringify(allNotifications),
);

// localStorage.setItem(
//     "notifications",

//     JSON.stringify(notifications),
// );

// ======================
// HAMBURGER
// ======================

const hamburger = document.getElementById("hamburger");

const navMenu = document.getElementById("navMenu");

if (hamburger && navMenu) {
    hamburger.addEventListener("click", () => {
        navMenu.classList.toggle("show");
    });
}
