const currentUser = JSON.parse(sessionStorage.getItem("currentUser")) || {
    nama: "Admin",
};
const welcomeEl = document.getElementById("welcome");
if (welcomeEl) {
    welcomeEl.textContent = currentUser.nama || "Admin";
}

const links = document.querySelectorAll(".sidebar-nav .nav-item");
links.forEach((link) => {
    link.addEventListener("click", () => {
        links.forEach((item) => item.classList.remove("active"));
        link.classList.add("active");
    });
});

const bookForm = document.getElementById("bookForm");
const defaultBookCover = "../asset/images/books/Atomic_Habit.png";

if (bookForm) {
    bookForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const title = document.getElementById("bookTitle").value.trim();
        const author = document.getElementById("bookAuthor").value.trim();
        const category = document.getElementById("bookCategory").value.trim();
        const stock = Number(document.getElementById("bookStock").value);
        const coverInput = document.getElementById("bookCover").value.trim();
        const coverFileInput = document.getElementById("bookCoverFile");
        const description = document.getElementById("bookDescription").value.trim();

        if (!title || !author || !category || !stock || !description) {
            alert("Semua field harus diisi.");
            return;
        }

        const storedBooks = JSON.parse(localStorage.getItem("books")) || [];
        const nextId = storedBooks.length
            ? Math.max(...storedBooks.map((b) => b.id)) + 1
            : 1;

        function saveBookWithCover(coverData) {
            const newBook = {
                id: nextId,
                judul: title,
                penulis: author,
                kategori: category,
                stok: stock,
                populer: false,
                unggulan: false,
                cover: coverData || coverInput || defaultBookCover,
                deskripsi: description,
            };

            storedBooks.unshift(newBook);
            localStorage.setItem("books", JSON.stringify(storedBooks));

            updateDashboardStats();
            renderLatestBorrowings();
            renderChart();

            alert("Buku berhasil ditambahkan. Data tersimpan di localStorage.");

            bookForm.reset();
            document.getElementById("bookCover").value = defaultBookCover;
        }

        // if admin uploaded a file, read it as data URL and use that
        if (coverFileInput && coverFileInput.files && coverFileInput.files[0]) {
            const file = coverFileInput.files[0];
            const reader = new FileReader();
            reader.onload = function (e) {
                saveBookWithCover(e.target.result);
            };
            reader.readAsDataURL(file);
        } else {
            saveBookWithCover(coverInput || defaultBookCover);
        }
    });
}

// sync dengan storage.js agar halaman user menggunakan data localStorage terbaru
if (!localStorage.getItem("books")) {
    saveBooks(books);
}

function updateDashboardStats() {
    const storedBooks = JSON.parse(localStorage.getItem("books")) || [];
    const borrowHistory = JSON.parse(localStorage.getItem("borrowHistory")) || [];
    const totalBooksEl = document.getElementById("totalBooksValue");
    const totalLoansEl = document.getElementById("totalLoansValue");
    const currentBorrowedEl = document.getElementById("currentBorrowedValue");
    const overdueEl = document.getElementById("overdueValue");

    if (totalBooksEl) {
        totalBooksEl.textContent = storedBooks.length;
    }
    if (totalLoansEl) {
        totalLoansEl.textContent = borrowHistory.length;
    }
    if (currentBorrowedEl) {
        currentBorrowedEl.textContent = borrowHistory.filter(
            (item) => item.status === "Dipinjam",
        ).length;
    }
    if (overdueEl) {
        overdueEl.textContent = borrowHistory.filter(
            (item) => item.status === "Terlambat",
        ).length;
    }
}

updateDashboardStats();

function renderPendingRequests() {
    const pendingListEl = document.getElementById("pendingList");
    if (!pendingListEl) return;

    const borrowHistory = JSON.parse(localStorage.getItem("borrowHistory")) || [];
    const pending = borrowHistory.filter(
        (h) => h.status === "Menunggu Persetujuan",
    );

    pendingListEl.innerHTML = "";

    if (pending.length === 0) {
        pendingListEl.innerHTML = "<p>Tidak ada permintaan peminjaman.</p>";
        return;
    }

    pending.forEach((item) => {
        pendingListEl.innerHTML += `
            <div class="pending-item" data-id="${item.id}">
                <div class="info">
                    <img src="${item.cover}" alt="${item.judul}" />
                    <div class="meta">
                        <strong>${item.judul}</strong>
                        <small>${item.nama} — ${item.nim}</small>
                        <small>${item.tanggalPinjam} → ${item.tanggalKembali}</small>
                    </div>
                </div>
                <div class="pending-actions">
                    <button class="btn-approve" data-id="${item.id}">Setujui</button>
                    <button class="btn-reject" data-id="${item.id}">Tolak</button>
                </div>
            </div>
        `;
    });
}

function handleApprove(id) {
    let history = JSON.parse(localStorage.getItem("borrowHistory")) || [];
    const idx = history.findIndex((h) => String(h.id) === String(id));

    if (idx === -1) return;

    const books = JSON.parse(localStorage.getItem("books")) || [];

    const bookIdx = books.findIndex((b) => b.judul === history[idx].judul);

    // CEK STOK DULU
    if (bookIdx !== -1 && books[bookIdx].stok <= 0) {
        history[idx].status = "Ditolak";

        localStorage.setItem("borrowHistory", JSON.stringify(history));

        alert("Pengajuan ditolak karena stok habis.");

        renderPendingRequests();

        return;
    }

    history[idx].status = "Dipinjam";

    if (bookIdx !== -1) {
        books[bookIdx].stok--;
        localStorage.setItem("books", JSON.stringify(books));
    }

    localStorage.setItem("borrowHistory", JSON.stringify(history));

    // add notification for user
    const notifications = JSON.parse(localStorage.getItem("notifications")) || [];
    notifications.unshift({
        id: Date.now(),
        userId: history[idx].userId,
        pesan: `Pengajuan peminjaman "${history[idx].judul}" disetujui.`,
        tanggal: new Date().toLocaleDateString("id-ID"),
        dibaca: false,
    });
    localStorage.setItem("notifications", JSON.stringify(notifications));

    updateDashboardStats();
    renderPendingRequests();
    renderLatestBorrowings();
    renderChart();
}

function handleReject(id) {
    let history = JSON.parse(localStorage.getItem("borrowHistory")) || [];
    const idx = history.findIndex((h) => String(h.id) === String(id));
    if (idx === -1) return;

    history[idx].status = "Ditolak";
    localStorage.setItem("borrowHistory", JSON.stringify(history));

    const notifications = JSON.parse(localStorage.getItem("notifications")) || [];
    notifications.unshift({
        id: Date.now(),
        userId: history[idx].userId,
        pesan: `Pengajuan peminjaman "${history[idx].judul}" ditolak.`,
        tanggal: new Date().toLocaleDateString("id-ID"),
        dibaca: false,
    });
    localStorage.setItem("notifications", JSON.stringify(notifications));

    updateDashboardStats();
    renderPendingRequests();
    renderLatestBorrowings();
    renderChart();
}

document.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn-approve")) {
        const id = e.target.dataset.id;
        if (confirm("Setujui permintaan ini?")) handleApprove(id);
    }
    if (e.target.classList.contains("btn-reject")) {
        const id = e.target.dataset.id;
        if (confirm("Tolak permintaan ini?")) handleReject(id);
    }
});

renderPendingRequests();
function renderLatestBorrowings() {
    const latestListEl = document.querySelector(".latest-list");
    if (!latestListEl) return;

    const borrowHistory = JSON.parse(localStorage.getItem("borrowHistory")) || [];
    // include approved and returned items (exclude waiting and rejected)
    const recent = borrowHistory
        .filter((h) => h.status === "Dipinjam" || h.status === "Dikembalikan")
        .sort((a, b) => Number(b.id) - Number(a.id))
        .slice(0, 6);

    latestListEl.innerHTML = "";

    if (recent.length === 0) {
        latestListEl.innerHTML = "<p>Belum ada peminjaman terbaru.</p>";
        return;
    }

    recent.forEach((item) => {
        latestListEl.innerHTML += `
            <div class="latest-item">
                <div>
                    <strong>${item.judul}</strong>
                    <p>Dipinjam oleh ${item.nama}</p>
                </div>
                <span>${formatDateShort(item.tanggalPinjam)}</span>
            </div>
        `;
    });
}

function formatDateShort(isoDate) {
    try {
        const d = new Date(isoDate + "T00:00:00");
        return new Intl.DateTimeFormat("id-ID", {
            day: "numeric",
            month: "short",
        }).format(d);
    } catch (e) {
        return isoDate;
    }
}

function renderChart() {
    const points = document.querySelectorAll(".chart-point");
    const footer = document.querySelector(".chart-footer");
    if (!points.length || !footer) return;

    const borrowHistory = JSON.parse(localStorage.getItem("borrowHistory")) || [];
    // Build last 7 days array (including today)
    const days = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        days.push(d);
    }

    function toDateKey(value) {
        try {
            return new Date(value).toISOString().split("T")[0];
        } catch (e) {
            return String(value).split("T")[0];
        }
    }

    const allowed = ["Dipinjam", "Dikembalikan"];

    const counts = days.map((d) => {
        const key = d.toISOString().split("T")[0];
        return borrowHistory.filter(
            (h) => allowed.includes(h.status) && toDateKey(h.tanggalPinjam) === key,
        ).length;
    });

    const max = Math.max(...counts, 1);

    // update points
    points.forEach((pt, idx) => {
        const count = counts[idx] || 0;
        // map to percentage between 8% and 88%
        const y = Math.round(8 + (count / max) * 80);
        const x = `${8 + idx * 12}%`;
        pt.style.setProperty("--x", x);
        pt.style.setProperty("--y", `${y}%`);
    });

    // update footer labels
    footer.innerHTML = "";
    days.forEach((d) => {
        const label = new Intl.DateTimeFormat("id-ID", {
            day: "numeric",
            month: "short",
        }).format(d);
        footer.innerHTML += `<span>${label}</span>`;
    });
}

// ensure these render initially
renderLatestBorrowings();
renderChart();
