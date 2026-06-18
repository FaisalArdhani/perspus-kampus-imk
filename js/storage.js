// ======================
// USERS
// ======================

const users = [

    {
        id: 1,
        role: "mahasiswa",
        nama: "Faisal Ardhani",
        nim: "24101837489",
        jurusan: "Teknik Informatika",
        semester: 4,
        email: "faisal@unpam.ac.id",
        noTelp: "089669326628",
        password: "123456"
    },

    {
        id: 2,
        role: "mahasiswa",
        nama: "Aiko",
        nim: "24101837490",
        jurusan: "Sistem Informasi",
        semester: 4,
        email: "aiko@unpam.ac.id",
        noTelp: "081234567890",
        password: "123456"
    },

    {
        id: 3,
        role: "dosen",
        nama: "Dani, S.Kom., M.Kom",
        nidn: "/* 181022456 */",
        email: "dani@unpam.ac.id",
        noTelp: "081298765432",
        mataKuliah: [
            "Basis Data",
            "Pemrograman Web"
        ],
        password: "123456"
    },

    {
        id: 4,
        role: "petugas",
        nama: "Budi Santoso",
        username: "perpus01",
        email: "perpus@unpam.ac.id",
        noTelp: "081122334455",
        jabatan: "Petugas Perpustakaan",
        password: "admin123"
    }

];

// ======================
// BOOKS
// ======================
const defaultBooks = [

    {
        id: 1,
        judul: "Atomic Habits",
        penulis: "James Clear",
        kategori: "Self Development",
        stok: 3,
        populer: true,
        unggulan: false,
        cover: "../asset/images/books/Atomic_Habit.png",
        deskripsi: "Panduan membangun kebiasaan kecil yang memberikan perubahan besar dalam hidup."
    },

    {
        id: 2,
        judul: "Head First Learn To Code",
        penulis: "Eric Freeman",
        kategori: "Programming",
        stok: 5,
        populer: false,
        unggulan: true,
        cover: "../asset/images/books/head-first-learn-to-code.png",
        deskripsi: "Buku pemrograman untuk pemula dengan pendekatan visual dan interaktif."
    },

    {
        id: 3,
        judul: "The Psychology of Money",
        penulis: "Morgan Housel",
        kategori: "Finance",
        stok: 2,
        populer: true,
        unggulan: false,
        cover: "../asset/images/books/the-psycology-of-money.png",
        deskripsi: "Memahami cara manusia berpikir tentang uang dan keputusan finansial."
    },

    {
        id: 4,
        judul: "Filosofi Teras",
        penulis: "Henry Manampiring",
        kategori: "Filosofi",
        stok: 10,
        populer: true,
        unggulan: true,
        cover: "../asset/images/books/Filsafat-teras.png",
        deskripsi: "Pengenalan filsafat Stoikisme yang relevan untuk kehidupan modern."
    },

    {
        id: 5,
        judul: "Thus Spoke Zarathustra",
        penulis: "Friedrich Nietzsche",
        kategori: "Filosofi",
        stok: 2,
        populer: true,
        unggulan: true,
        cover: "../asset/images/books/zarathustra.png",
        deskripsi: "Karya filsafat terkenal Nietzsche tentang manusia dan nilai kehidupan."
    },

    {
        id: 6,
        judul: "Hukum dan Peradilan",
        penulis: "Dwi Tirtousada",
        kategori: "Hukum",
        stok: 7,
        populer: false,
        unggulan: true,
        cover: "../asset/images/books/hukum-dan-peradilan.png",
        deskripsi: "Membahas dasar-dasar hukum dan sistem peradilan di Indonesia."
    },

    {
        id: 7,
        judul: "Sebuah Seni Untuk Bersikap Bodo Amat",
        penulis: "Mark Manson",
        kategori: "Self Development",
        stok: 7,
        populer: true,
        unggulan: true,
        cover: "../asset/images/books/Sebuah-seni-untuk-bersikap-bodoh-amat.png",
        deskripsi: "Cara fokus pada hal-hal yang benar-benar penting dalam hidup."
    },

    {
        id: 8,
        judul: "Clean Code",
        penulis: "Robert C. Martin",
        kategori: "Programming",
        stok: 6,
        populer: true,
        unggulan: true,
        cover: "../asset/images/books/clean-code.png",
        deskripsi: "Panduan menulis kode yang bersih, mudah dipahami, dan mudah dirawat."
    },

    {
        id: 9,
        judul: "Sapiens",
        penulis: "Yuval Noah Harari",
        kategori: "Sejarah",
        stok: 4,
        populer: true,
        unggulan: false,
        cover: "../asset/images/books/sapiens.png",
        deskripsi: "Sejarah singkat umat manusia dari masa prasejarah hingga modern."
    },

    {
        id: 10,
        judul: "Deep Work",
        penulis: "Cal Newport",
        kategori: "Self Development",
        stok: 5,
        populer: true,
        unggulan: true,
        cover: "../asset/images/books/deep-work.png",
        deskripsi: "Strategi bekerja fokus tanpa gangguan di era digital."
    }

];

function loadBooks() {
    try {
        const stored = JSON.parse(localStorage.getItem("books"));
        if (Array.isArray(stored) && stored.length) {
            return stored;
        }
    } catch (error) {
        console.warn("Gagal memuat data buku dari localStorage", error);
    }

    return defaultBooks;
}

function saveBooks(bookList) {
    localStorage.setItem("books", JSON.stringify(bookList));
}

function getBooks() {
    return JSON.parse(
        localStorage.getItem("books")
    ) || books;
}

const books = loadBooks();
saveBooks(books);

// simpan user default
if (!localStorage.getItem("users")) {
    localStorage.setItem(
        "users",
        JSON.stringify(users)
    );
}

// ======================
// SESSION
// ======================

function getSession() {
    return JSON.parse(
        sessionStorage.getItem("currentUser")
    );
}

// ======================
// PEMINJAMAN
// ======================

function getAllPeminjaman() {
    return JSON.parse(
        localStorage.getItem("peminjaman")
    ) || [];
}

function savePeminjaman(data) {
    localStorage.setItem(
        "peminjaman",
        JSON.stringify(data)
    );
}


// DATA PETUGAS

if (!localStorage.getItem("petugas")) {
    localStorage.setItem(
        "petugas",
        JSON.stringify([
            {
                id: 1,
                nama: "Admin Perpus",
                email: "admin@perpus.com",
                noTelp: "081234567890",
                password: "admin123"
            }
        ])
    );
}