// =====================
// CEK LOGIN
// =====================

const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));

if (!currentUser) {
    window.location.href = "../login.html";
}

// =====================
// ELEMENT
// =====================

const popularBooks = document.getElementById("popularBooks");

const featuredBooks = document.getElementById("featuredBooks");

// =====================
// CARD BUKU
// =====================

function createBookCard(book) {
    return `

        <div class="book-card">

            <img
                src="${book.cover}"
                alt="${book.judul}"
            >

            <div class="book-info">

                <h3>${book.judul}</h3>

                <p>${book.penulis}</p>

                <div class="actions">

                    <button
                        class="btn-detail"
                        data-id="${book.id}"
                    >
                        Detail
                    </button>

                    <button
                        class="btn-pinjam"
                        data-id="${book.id}"
                    >
                        Pinjam
                    </button>

                </div>

            </div>

        </div>

    `;
}

// =====================
// RENDER POPULER
// =====================

const allBooks = getBooks();

const popular = allBooks.filter((book) => book.populer);

popular.forEach((book) => {
    popularBooks.innerHTML += createBookCard(book);
});

// =====================
// RENDER UNGGULAN
// =====================
const featured = allBooks.filter((book) => book.unggulan);

featured.forEach((book) => {
    featuredBooks.innerHTML += createBookCard(book);
});

// =====================
// RENDER BUKU TERBARU
// =====================

const recentBooksEl = document.getElementById("recentBooks");

if (recentBooksEl) {
    const recentBooks = [...allBooks].sort((a, b) => b.id - a.id).slice(0, 6);

    recentBooks.forEach((book) => {
        recentBooksEl.innerHTML += createBookCard(book);
    });
}

// =====================
// HAMBURGER MENU
// =====================

const hamburger = document.getElementById("hamburger");

const navMenu = document.getElementById("navMenu");

if (hamburger && navMenu) {
    hamburger.addEventListener("click", () => {
        navMenu.classList.toggle("show");
    });
}

// pop up detail buku
const modal = document.getElementById("bookModal");

const closeBtn = document.querySelector(".close-btn");

document.addEventListener("click", function (e) {
    if (e.target.classList.contains("btn-detail")) {
        const id = Number(e.target.dataset.id);

        const book = books.find((b) => b.id === id);

        localStorage.setItem("selectedBook", JSON.stringify(book));

        document.getElementById("modalCover").src = book.cover;

        document.getElementById("modalTitle").textContent = book.judul;

        document.getElementById("modalDesc").textContent = book.deskripsi;

        document.getElementById("modalAuthor").textContent = book.penulis;

        document.getElementById("modalCategory").textContent = book.kategori;

        document.getElementById("modalStock").textContent = book.stok;
        const borrowBtn = document.getElementById("modalBorrowBtn");

        borrowBtn.disabled = book.stok <= 0;
        const status = document.getElementById("modalStatus");

        if (book.stok > 0) {
            status.textContent = "Tersedia";

            status.style.color = "green";
        } else {
            status.textContent = "Tidak Tersedia";
            status.style.color = "red";
        }
        modal.style.display = "flex";
    }
});

closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
});

window.addEventListener("click", function (e) {
    if (e.target === modal) {
        modal.style.display = "none";
    }
});

// button tutp
document.getElementById("modalCloseBtn").addEventListener("click", () => {
    modal.style.display = "none";
});

document.getElementById("modalBorrowBtn").addEventListener("click", () => {
    window.location.href = "peminjaman.html";
});

document.addEventListener("click", function (e) {
    if (e.target.classList.contains("btn-pinjam")) {
        const id = Number(e.target.dataset.id);

        const book = books.find((b) => b.id === id);

        localStorage.setItem("selectedBook", JSON.stringify(book));

        window.location.href = "peminjaman.html";
    }
});

/// ======================
// SEARCH BUKU
// ======================

const searchInput = document.getElementById("searchInput");

const searchBtn = document.getElementById("searchBtn");

function searchBook() {
    const keyword = searchInput.value.trim();

    if (!keyword) {
        alert("Masukkan kata kunci pencarian!");

        return;
    }

    localStorage.setItem("searchKeyword", keyword);

    window.location.href = "katalog.html";
}

searchBtn.addEventListener("click", searchBook);

searchInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        searchBook();
    }
});
