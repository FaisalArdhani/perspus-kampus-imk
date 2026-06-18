(function () {
    try {
        const sessionUser = sessionStorage.getItem("currentUser");
        const localUser = localStorage.getItem("currentUser");
        const currentUser = sessionUser
            ? JSON.parse(sessionUser)
            : localUser
                ? JSON.parse(localUser)
                : {};
        const welcomeEl = document.getElementById("welcome");
        if (welcomeEl) welcomeEl.textContent = currentUser.nama || "Admin";
    } catch (e) {
        console.warn("Gagal mengambil currentUser", e);
    }
})();

const NAMA_BULAN = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
];

document.addEventListener("DOMContentLoaded", () => {
    const session = getSession();
    const welcomeEl = document.getElementById("welcome");
    if (welcomeEl && session?.nama) welcomeEl.textContent = session.nama;

    initFilterPeriode();
    renderLaporan();
});

// ============================================================
// FILTER PERIODE (Bulan & Tahun)
// ============================================================

function initFilterPeriode() {
    const filterBulan = document.getElementById("filterBulan");
    const filterTahun = document.getElementById("filterTahun");

    const sekarang = new Date();

    // isi opsi bulan
    filterBulan.innerHTML = NAMA_BULAN.map(
        (nama, idx) => `<option value="${idx}">${nama}</option>`,
    ).join("");
    filterBulan.value = sekarang.getMonth();

    // isi opsi tahun: dari tahun data peminjaman paling lama s.d. tahun sekarang
    const semuaPeminjaman = getAllPeminjaman();
    const tahunData = semuaPeminjaman.map((p) =>
        new Date(p.tanggalPinjam).getFullYear(),
    );
    const tahunMin = tahunData.length
        ? Math.min(...tahunData)
        : sekarang.getFullYear();
    const tahunMax = sekarang.getFullYear();

    const daftarTahun = [];
    for (let t = tahunMax; t >= tahunMin; t--) daftarTahun.push(t);
    if (daftarTahun.length === 0) daftarTahun.push(sekarang.getFullYear());

    filterTahun.innerHTML = daftarTahun
        .map((tahun) => `<option value="${tahun}">${tahun}</option>`)
        .join("");
    filterTahun.value = sekarang.getFullYear();

    filterBulan.addEventListener("change", renderLaporan);
    filterTahun.addEventListener("change", renderLaporan);
}

// ============================================================
// RENDER UTAMA
// ============================================================

function renderLaporan() {
    const bulan = parseInt(document.getElementById("filterBulan").value, 10);
    const tahun = parseInt(document.getElementById("filterTahun").value, 10);

    const semuaPeminjaman = getAllPeminjaman();

    // Filter: peminjaman yang tanggalPinjam-nya jatuh di bulan & tahun terpilih
    const periodeIni = semuaPeminjaman.filter((p) => {
        const tgl = new Date(p.tanggalPinjam);
        return tgl.getMonth() === bulan && tgl.getFullYear() === tahun;
    });

    // Periode bulan sebelumnya (untuk perbandingan "+x dari bulan lalu")
    const bulanLalu = bulan === 0 ? 11 : bulan - 1;
    const tahunLalu = bulan === 0 ? tahun - 1 : tahun;
    const periodeLalu = semuaPeminjaman.filter((p) => {
        const tgl = new Date(p.tanggalPinjam);
        return tgl.getMonth() === bulanLalu && tgl.getFullYear() === tahunLalu;
    });

    renderStatCards(periodeIni, periodeLalu);
    renderGrafik(periodeIni, bulan, tahun);
    renderTopBuku(periodeIni);
}

// ============================================================
// STAT CARDS
// ============================================================

function renderStatCards(periodeIni, periodeLalu) {
    const totalPinjam = periodeIni.length;
    const totalKembali = periodeIni.filter((p) => p.status === "selesai").length;
    const totalTelat = periodeIni.filter((p) => p.status === "telat").length;
    const totalDenda = periodeIni.reduce((sum, p) => sum + (p.denda || 0), 0);

    const totalPinjamLalu = periodeLalu.length;
    const totalKembaliLalu = periodeLalu.filter(
        (p) => p.status === "selesai",
    ).length;
    const totalTelatLalu = periodeLalu.filter((p) => p.status === "telat").length;
    const totalDendaLalu = periodeLalu.reduce(
        (sum, p) => sum + (p.denda || 0),
        0,
    );
    const statPinjam =
        document.getElementById("statTotalPinjam");

    if (statPinjam)
        statPinjam.textContent = totalPinjam;
    document.getElementById("statTotalKembali").textContent = totalKembali;
    document.getElementById("statTotalTelat").textContent = totalTelat;
    document.getElementById("statTotalDenda").textContent =
        formatRupiah(totalDenda);

    setMeta(
        "statTotalPinjamMeta",
        totalPinjam - totalPinjamLalu,
        "dari bulan lalu",
    );
    setMeta(
        "statTotalKembaliMeta",
        totalKembali - totalKembaliLalu,
        "dari bulan lalu",
    );
    setMeta(
        "statTotalTelatMeta",
        totalTelat - totalTelatLalu,
        "dari bulan lalu",
        true,
    );
    setMeta(
        "statTotalDendaMeta",
        totalDenda - totalDendaLalu,
        "dari bulan lalu",
        true,
    );
}

/**
 * Tulis teks meta seperti "+16 dari bulan lalu" / "-18 dari bulan lalu".
 * @param {boolean} negatifLebihBaik - kalau true (misal: telat, denda), turun = bagus
 */
function setMeta(elId, selisih, label, negatifLebihBaik = false) {
    const el = document.getElementById(elId);
    if (!el) return;

    const tanda = selisih > 0 ? "+" : selisih < 0 ? "-" : "";
    const nilaiAbs = Math.abs(selisih);
    el.textContent = `${tanda}${nilaiAbs} ${label}`;

    el.classList.remove("meta-up", "meta-down");
    if (selisih === 0) return;

    const naikItuBaik = !negatifLebihBaik;
    const isBaik = selisih > 0 ? naikItuBaik : !naikItuBaik;
    el.classList.add(isBaik ? "meta-up" : "meta-down");
}

function formatRupiah(angka) {
    return "Rp. " + (angka || 0).toLocaleString("id-ID");
}

// ============================================================
// GRAFIK PEMINJAMAN (7 hari terakhir dalam periode terpilih)
// ============================================================

function renderGrafik(periodeIni, bulan, tahun) {
    const chartAxis = document.getElementById("chartAxis");
    const chartFooter = document.getElementById("chartFooter");
    if (!chartAxis || !chartFooter) return;

    // Tentukan 7 hari terakhir yang punya data dalam bulan terpilih,
    // kalau bulan terpilih adalah bulan berjalan, pakai 7 hari terakhir s.d. hari ini.
    const sekarang = new Date();
    const isBulanBerjalan =
        bulan === sekarang.getMonth() && tahun === sekarang.getFullYear();
    const tanggalAkhir = isBulanBerjalan
        ? sekarang
        : new Date(tahun, bulan + 1, 0); // akhir bulan

    const hariList = [];
    for (let i = 6; i >= 0; i--) {
        const tgl = new Date(tanggalAkhir);
        tgl.setDate(tgl.getDate() - i);
        hariList.push(tgl);
    }

    const dataHarian = hariList.map((tgl) => {
        const jumlah = periodeIni.filter((p) => {
            const tglPinjam = new Date(p.tanggalPinjam);
            return (
                tglPinjam.getDate() === tgl.getDate() &&
                tglPinjam.getMonth() === tgl.getMonth() &&
                tglPinjam.getFullYear() === tgl.getFullYear()
            );
        }).length;
        return { tanggal: tgl, jumlah };
    });

    const maxJumlah = Math.max(...dataHarian.map((d) => d.jumlah), 1);

    // Bersihkan chart sebelumnya
    chartAxis.innerHTML = "";

    // Garis dasar
    const garis = document.createElement("div");
    garis.className = "chart-line";
    chartAxis.appendChild(garis);

    // Titik-titik data
    const lebarPerSegmen = 100 / (dataHarian.length - 1 || 1);
    dataHarian.forEach((d, idx) => {
        const titik = document.createElement("div");
        titik.className = "chart-point";
        const xPercent = idx * lebarPerSegmen;
        const yPixel = (d.jumlah / maxJumlah) * 140; // tinggi maksimum area grafik

        titik.style.setProperty("--x", `calc(${xPercent}% - 6px)`);
        titik.style.setProperty("--y", `${yPixel}px`);
        titik.title = `${d.jumlah} peminjaman`;
        chartAxis.appendChild(titik);
    });

    // Footer label tanggal
    chartFooter.innerHTML = dataHarian
        .map(
            (d) =>
                `<span>${d.tanggal.getDate()} ${NAMA_BULAN[d.tanggal.getMonth()].slice(0, 3)}</span>`,
        )
        .join("");
}

// ============================================================
// TOP 5 BUKU TERPOPULER (berdasarkan periode terpilih)
// ============================================================

function renderTopBuku(periodeIni) {
    const listEl = document.getElementById("topBukuList");

    const emptyEl = document.getElementById("emptyTopBuku");

    if (!listEl || !emptyEl) return;

    if (periodeIni.length === 0) {
        listEl.innerHTML = "";
        emptyEl.style.display = "block";
        return;
    }
    emptyEl.style.display = "none";

    // Hitung frekuensi peminjaman per judul buku
    const hitungPerBuku = {};
    periodeIni.forEach((p) => {
        const judul = p.judulBuku || "Tidak diketahui";
        hitungPerBuku[judul] = (hitungPerBuku[judul] || 0) + 1;
    });

    const top5 = Object.entries(hitungPerBuku)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

    listEl.innerHTML = top5
        .map(
            ([judul, jumlah]) => `
      <li class="latest-item">
        <strong>${judul}</strong>
        <span>${jumlah} Kali</span>
      </li>
    `,
        )
        .join("");
}
