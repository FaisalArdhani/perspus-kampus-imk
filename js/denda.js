// =====================
// CEK LOGIN
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

    document.addEventListener("DOMContentLoaded", initDendaAdmin);
})();

// Jika suatu saat ingin dihitung otomatis, nilai ini bisa dipakai.
const RENTAL_FINE_PER_DAY = 5000;

function initDendaAdmin() {
    const history = loadBorrowHistory();

    const tableBody = document.getElementById("dendaTableBody");
    if (!tableBody) return;

    const rows = getDendaRows(history);

    tableBody.innerHTML = "";

    if (rows.length === 0) {
        tableBody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align:center; color:#667085; padding: 18px 12px;">
          Belum ada data denda.
        </td>
      </tr>
    `;
        return;
    }

    rows.forEach((item, i) => {
        const jenis = getUserJenis(item);
        const nama = item.nama || item.userId || "-";

        const statusBuku = item.dendaPaid === true || item.status === "Denda"
            ? "Denda Lunas"
            : item.status === "Terlambat" || item.status === "Denda"
                ? "Terlambat"
                : "Terlambat";

        const aksiHtml = renderActions({ item });

        tableBody.insertAdjacentHTML(
            "beforeend",
            `
        <tr>
          <td>${i + 1}</td>
          <td>${escapeHtml(nama)}</td>
          <td>${jenis}</td>
          <td>
            ${formatYmd(item.tanggalPinjam)} - ${formatYmd(item.tanggalKembali)}
          </td>
          <td>${escapeHtml(statusBuku)}</td>
          <td>${aksiHtml}</td>
        </tr>
      `
        );
    });

    document.addEventListener("click", (e) => {
        const btnPay = e.target.closest("button[data-action='bayar']");
        const btnWarn = e.target.closest("button[data-action='peringatkan']");
        if (!btnPay && !btnWarn) return;

        const id = Number((btnPay || btnWarn).dataset.id);
        if (!Number.isFinite(id)) return;

        if (btnWarn) return onWarnFine(id);
        if (btnPay) return onMarkPaid(id);
    });
}

function renderActions({ item }) {
    const alreadyPaid = item.dendaPaid === true || item.status === "Denda";

    if (alreadyPaid) {
        return `
      <div style="display:flex; gap:8px; align-items:center;">
        <span style="font-size:12px; font-weight:800; color:#10b981;">Denda Lunas</span>
      </div>
    `;
    }

    const canPay = (Number(item.denda) || 0) > 0;

    return `
    <div style="display:flex; gap:8px; align-items:center; flex-wrap:wrap;">
      <button class="btn-danger" data-action="peringatkan" data-id="${item.id}">
        Peringatkan bayar denda
      </button>
      <button
        class="btn-approve"
        data-action="bayar"
        data-id="${item.id}"
        ${canPay ? "" : "disabled style=\"opacity:.6; cursor:not-allowed\""}
      >
        Selesai
      </button>
    </div>
  `;
}

function getDendaRows(history) {
    // Ambil transaksi yang berpotensi denda dan belum lunas.
    return (history || [])
        .filter((x) => {
            const hasFine = (Number(x.denda) || 0) > 0;
            const notPaid = !(x.dendaPaid === true || x.status === "Denda");
            const isCandidate =
                x.status === "Terlambat" ||
                x.status === "Denda" ||
                x.status === "Ditolak" ||
                x.status === "Menunggu Persetujuan" ||
                x.status === "Dipinjam";
            return hasFine && notPaid && isCandidate;
        })
        .sort((a, b) => Number(b.id) - Number(a.id));
}

function onWarnFine(id) {
    const history = loadBorrowHistory();
    const idx = history.findIndex((x) => Number(x.id) === Number(id));
    if (idx === -1) return;

    const item = history[idx];
    if (item.dendaPaid === true || item.status === "Denda") {
        alert("Denda sudah lunas.");
        return;
    }

    try {
        const notifications = JSON.parse(localStorage.getItem("notifications")) || [];
        const fineVal = Number(item.denda) || 0;

        notifications.unshift({
            id: Date.now(),
            userId: item.userId,
            pesan: `Peringatan denda: Mohon selesaikan pembayaran denda Rp ${formatRupiah(
                fineVal
            )} untuk buku "${item.judul}".`,
            tanggal: new Date().toLocaleDateString("id-ID"),
            dibaca: false,
        });

        localStorage.setItem("notifications", JSON.stringify(notifications));
    } catch (e) { }

    alert("Peringatan pembayaran denda dikirim ke user.");
    location.reload();
}

function onMarkPaid(id) {
    const history = loadBorrowHistory();
    const idx = history.findIndex((x) => Number(x.id) === Number(id));
    if (idx === -1) return;

    const item = history[idx];
    if (item.dendaPaid === true || item.status === "Denda") {
        alert("Sudah selesai (denda lunas).");
        return;
    }

    history[idx] = {
        ...item,
        dendaPaid: true,
        status: "Denda",
        tanggalDendaPaid: new Date().toISOString(),
    };

    localStorage.setItem("borrowHistory", JSON.stringify(history));

    try {
        const notifications = JSON.parse(localStorage.getItem("notifications")) || [];

        notifications.unshift({
            id: Date.now(),
            userId: item.userId,
            pesan: `Pembayaran denda untuk buku "${item.judul}" telah diselesaikan. Terima kasih!`,
            tanggal: new Date().toLocaleDateString("id-ID"),
            dibaca: false,
        });

        localStorage.setItem("notifications", JSON.stringify(notifications));
    } catch (e) { }

    alert("Denda berhasil ditandai lunas.");
    location.reload();
}

function loadBorrowHistory() {
    try {
        return JSON.parse(localStorage.getItem("borrowHistory")) || [];
    } catch (e) {
        return [];
    }
}

function getUserJenis(item) {
    if (!item) return "-";

    const id = String(item.userId || "");
    if (id.startsWith("1810")) return "Dosen";
    if (id.startsWith("2410")) return "Mahasiswa";
    return "Pengguna";
}

function formatYmd(s) {
    if (!s) return "-";
    try {
        if (String(s).includes("T")) return String(s).split("T")[0];
        return String(s);
    } catch (e) {
        return "-";
    }
}

function formatRupiah(n) {
    const num = Number(n) || 0;
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function escapeHtml(str) {
    return String(str)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "<")
        .replaceAll(">", ">")
        .replaceAll('"', '"')
        .replaceAll("'", "&#039;");
}

