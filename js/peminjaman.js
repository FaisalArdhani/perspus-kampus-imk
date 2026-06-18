// =====================
// ADMIN - PEMINJAMAN
// =====================

(() => {
    const sessionUserRaw = sessionStorage.getItem("currentUser");
    if (!sessionUserRaw) {
        window.location.href = "../login.html";
        return;
    }

    document.addEventListener("DOMContentLoaded", () => {
        const els = {
            // stats
            totalPeminjamanValue: document.getElementById("totalLoansValue"),
            menungguValue: document.getElementById("pendingValue"),
            dipinjamValue: document.getElementById("borrowedValue"),
            dikembalikanValue: document.getElementById("returnedValue"),

            overdueValue: document.getElementById("overdueValue"),
            totalBooksValue: document.getElementById("totalBooksValue"),

            // chart
            chartAxis: document.getElementById("chartAxis"),
            chartFooter: document.getElementById("chartFooter"),

            // lists
            pendingList: document.getElementById("pendingList"),
            borrowedList: document.getElementById("borrowedList"),
        };

        init(els);
    });

    function safeJsonParse(raw) {
        try {
            return JSON.parse(raw);
        } catch {
            return null;
        }
    }

    function init(els) {
        const booksList = safeGetBooks();
        const borrowHistory = safeGetBorrowHistory();

        const totalPeminjaman = borrowHistory.length;

        const pending = borrowHistory.filter((x) =>
            x.status === "Menunggu Persetujuan"
        );

        const borrowed = borrowHistory.filter(
            (x) =>
                x.status !== "Dikembalikan" &&
                x.status !== "Ditolak" &&
                x.status !== "Menunggu Persetujuan"
        );

        const returned = borrowHistory.filter((x) => x.status === "Dikembalikan");

        const todayStr = new Date().toISOString().slice(0, 10);
        const today = new Date(todayStr);

        const overdue = borrowHistory.filter((x) => {
            if (x.status === "Dikembalikan" || x.status === "Ditolak") return false;
            const t = parseISODate(x.tanggalKembali);
            if (!t) return false;
            return t < today;
        });

        if (els.totalBooksValue) els.totalBooksValue.textContent = String(booksList.length);
        if (els.totalPeminjamanValue) els.totalPeminjamanValue.textContent = String(totalPeminjaman);
        if (els.menungguValue) els.menungguValue.textContent = String(pending.length);
        if (els.dipinjamValue) els.dipinjamValue.textContent = String(borrowed.length);
        if (els.dikembalikanValue) els.dikembalikanValue.textContent = String(returned.length);
        if (els.overdueValue) els.overdueValue.textContent = String(overdue.length);

        renderChart7Days(els.chartAxis, els.chartFooter, borrowHistory);
        renderPendingList(els.pendingList, pending);
        renderBorrowedList(els.borrowedList, borrowed);
    }

    function parseISODate(s) {
        try {
            if (!s) return null;
            const d = new Date(s);
            if (Number.isNaN(d.getTime())) return null;
            return new Date(d.toISOString().slice(0, 10));
        } catch {
            return null;
        }
    }

    function namaBulan(i) {
        const map = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
        return map[i] || "";
    }

    function renderChart7Days(chartAxisEl, chartFooterEl, borrowHistory) {
        if (!chartAxisEl || !chartFooterEl) return;

        const days = [];
        const today = new Date();

        // 7 hari termasuk hari ini
        for (let i = 6; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(today.getDate() - i);
            const label = `${d.getDate()} ${namaBulan(d.getMonth())}`;
            const iso = d.toISOString().slice(0, 10);
            days.push({ iso, label });
        }

        const counts = days.map((day) => borrowHistory.filter((x) => x.tanggalPinjam === day.iso).length);
        const max = Math.max(1, ...counts);

        chartAxisEl.innerHTML = `
      <div class="chart-line"></div>
      ${counts
                .map((c, idx) => {
                    const y = Math.round((c / max) * 70 + 10);
                    const x = Math.round(((idx + 1) / (counts.length + 1)) * 100);
                    return `<div class="chart-point" style="--x:${x}%; --y:${y}%"></div>`;
                })
                .join("")}
    `;

        chartFooterEl.innerHTML = days.map((d) => `<span>${d.label}</span>`).join("");
    }

    function renderPendingList(listEl, pending) {
        if (!listEl) return;

        if (!pending.length) {
            listEl.innerHTML = `
        <div style="color:#667085; font-size:13px; padding:10px 0;">
          Tidak ada permintaan peminjaman menunggu persetujuan.
        </div>
      `;
            return;
        }

        listEl.innerHTML = pending
            .slice(0, 50)
            .map((item) => {
                return `
        <div class="pending-item">
          <div class="info">
            <img
              src="${item.cover || "../asset/images/libraryjpg.jpg"}"
              alt="${escapeHtml(item.judul)}"
            />
            <div class="meta">
              <strong>${escapeHtml(item.judul)}</strong>
              <span style="font-size:12px; color:#667085;">${escapeHtml(item.nama || "")}</span>
              <span style="font-size:12px; color:#667085;">Tanggal pinjam: ${escapeHtml(item.tanggalPinjam || "-")}</span>
            </div>
          </div>
          <div class="pending-actions">
            <span style="font-size:12px; font-weight:700; color:#64748b;">Menunggu</span>
          </div>
        </div>
      `;
            })
            .join("");
    }

    function renderBorrowedList(listEl, borrowed) {
        if (!listEl) return;

        if (!borrowed.length) {
            listEl.innerHTML = `
        <div style="color:#667085; font-size:13px; padding:10px 0;">
          Tidak ada buku yang sedang dipinjam.
        </div>
      `;
            return;
        }

        listEl.innerHTML = borrowed
            .slice(0, 50)
            .map((item) => {
                const overdue = isOverdue(item);
                return `
          <div class="pending-item">
            <div class="info">
              <img
                src="${item.cover || "../asset/images/libraryjpg.jpg"}"
                alt="${escapeHtml(item.judul)}"
              />
              <div class="meta">
                <strong>${escapeHtml(item.judul)}</strong>
                <span style="font-size:12px; color:#667085;">${escapeHtml(item.nama || "")}</span>
                <span style="font-size:12px; color:#667085;">Kembali: ${escapeHtml(item.tanggalKembali || "-")}</span>
              </div>
            </div>

            <div class="pending-actions">
              ${overdue ? `<span class="btn-danger" style="display:inline-block; padding:8px 12px; border-radius:10px;">Terlambat</span>` : ""}
              <button
                class="btn-approve"
                data-action="return"
                data-id="${item.id}"
                style="flex:none;"
              >
                Kembalikan
              </button>
            </div>
          </div>
        `;
            })
            .join("");

        listEl.querySelectorAll("button[data-action='return']").forEach((btn) => {
            btn.addEventListener("click", () => {
                const id = Number(btn.getAttribute("data-id"));
                if (!id) return;
                handleReturn(id);
            });
        });
    }

    function isOverdue(item) {
        if (!item) return false;
        if (item.status === "Dikembalikan" || item.status === "Ditolak") return false;
        const t = parseISODate(item.tanggalKembali);
        if (!t) return false;
        const today = new Date(new Date().toISOString().slice(0, 10));
        return t < today;
    }

    function handleReturn(borrowId) {
        const history = safeGetBorrowHistory();
        const target = history.find((x) => x.id === borrowId);
        if (!target) return;

        if (target.status === "Dikembalikan") {
            alert("Buku ini sudah dikembalikan.");
            return;
        }

        const books = safeGetBooks();

        target.status = "Dikembalikan";

        const bookIdx = books.findIndex((b) => b.judul === target.judul);
        if (bookIdx >= 0) {
            const prev = Number(books[bookIdx].stok || 0);
            books[bookIdx].stok = prev + 1;
        }

        saveBorrowHistory(history);
        saveBooks(books);

        const notifications = safeGetNotifications();
        notifications.unshift({
            id: Date.now(),
            userId: target.userId,
            pesan: `Buku "${target.judul}" berhasil dikembalikan`,
            tanggal: new Date().toLocaleDateString("id-ID"),
            dibaca: false,
        });
        localStorage.setItem("notifications", JSON.stringify(notifications));

        alert("Berhasil mengembalikan buku.");

        // re-render
        init({
            totalBooksValue: document.getElementById("totalBooksValue"),
            totalPeminjamanValue: document.getElementById("totalLoansValue"),
            menungguValue: document.getElementById("pendingValue"),
            dipinjamValue: document.getElementById("borrowedValue"),
            dikembalikanValue: document.getElementById("returnedValue"),
            overdueValue: document.getElementById("overdueValue"),
            chartAxis: document.getElementById("chartAxis"),
            chartFooter: document.getElementById("chartFooter"),
            pendingList: document.getElementById("pendingList"),
            borrowedList: document.getElementById("borrowedList"),
        });
    }

    function safeGetBorrowHistory() {
        return safeJson(localStorage.getItem("borrowHistory")) || [];
    }

    function safeGetNotifications() {
        return safeJson(localStorage.getItem("notifications")) || [];
    }

    function safeGetBooks() {
        if (typeof getBooks === "function") return getBooks();
        return safeJson(localStorage.getItem("books")) || [];
    }

    function saveBooks(books) {
        // storage.js sudah definisikan saveBooks, kalau ada pakai itu
        if (typeof window.saveBooks === "function") {
            try {
                window.saveBooks(books);
                return;
            } catch { }
        }
        localStorage.setItem("books", JSON.stringify(books));
    }

    function saveBorrowHistory(history) {
        localStorage.setItem("borrowHistory", JSON.stringify(history));
    }

    function safeJson(raw) {
        try {
            if (!raw) return null;
            return JSON.parse(raw);
        } catch {
            return null;
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
})();

