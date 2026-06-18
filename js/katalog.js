// ======================
// ELEMENT
// ======================

const catalogBooks =
    document.getElementById(
        "catalogBooks"
    );

const filterSection =
    document.getElementById(
        "filterSection"
    );

const searchInput =
    document.getElementById(
        "searchInput"
    );

const searchBtn =
    document.getElementById(
        "searchBtn"
    );

const pagination =
    document.getElementById(
        "pagination"
    );

// ======================
// PAGINATION
// ======================

const booksPerPage = 30;

let currentPage = 1;

let currentBooks = books;

// ======================
// RENDER BUKU
// ======================

function renderBooks(data) {

    catalogBooks.innerHTML = "";

    const start =
        (currentPage - 1)
        * booksPerPage;

    const end =
        start + booksPerPage;

    const pageBooks =
        data.slice(
            start,
            end
        );

    pageBooks.forEach(book => {

        catalogBooks.innerHTML +=
            createBookCard(book);

    });

    renderPagination(data);

}

// ======================
// RENDER PAGINATION
// ======================

function renderPagination(data) {

    pagination.innerHTML = "";

    const totalPages =
        Math.ceil(
            data.length /
            booksPerPage
        );

    for (
        let i = 1;
        i <= totalPages;
        i++
    ) {

        pagination.innerHTML += `
        
        <button
            class="
            page-btn
            ${currentPage === i ? "active" : ""}
            "
            data-page="${i}"
        >
            ${i}
        </button>

        `;
    }

}

// ======================
// CATEGORY HELPERS
// ======================

function normalizeCategory(value) {
    return String(value || '').trim();
}

function getCategories() {
    return [
        ...new Set(
            books
                .map((book) => normalizeCategory(book.kategori))
                .filter(Boolean)
        ),
    ];
}

// ======================
// GENERATE KATEGORI
// ======================

const categories = getCategories();

filterSection.innerHTML = `

<button
    class="filter-btn active"
    data-category="all"
>
    Semua
</button>

`;

categories.forEach((category) => {
    filterSection.innerHTML += `
    <button
        class="filter-btn"
        data-category="${category}"
    >
        ${category}
    </button>
    `;
});

// ======================
// FILTER KATEGORI
// ======================

document.addEventListener(
    "click",
    function (e) {

        if (
            e.target.classList.contains(
                "filter-btn"
            )
        ) {

            document
                .querySelector(
                    ".filter-btn.active"
                )
                ?.classList.remove(
                    "active"
                );

            e.target.classList.add(
                "active"
            );

            const category =
                e.target.dataset.category;

            currentPage = 1;

            if (category === "all") {
                currentBooks = books;
                renderBooks(currentBooks);
                return;
            }

            currentBooks = books.filter(
                (book) =>
                    normalizeCategory(book.kategori).toLowerCase() ===
                    category.toLowerCase()
            );

            renderBooks(currentBooks);

        }

    }
);

// ======================
// SEARCH
// ======================

function searchBook() {

    const keyword =
        searchInput.value
            .toLowerCase()
            .trim();

    currentBooks =
        books.filter(book =>

            book.judul
                .toLowerCase()
                .includes(keyword)

            ||

            book.penulis
                .toLowerCase()
                .includes(keyword)

            ||

            book.kategori
                .toLowerCase()
                .includes(keyword)

        );

    currentPage = 1;

    renderBooks(
        currentBooks
    );

}

searchBtn.addEventListener(
    "click",
    searchBook
);

searchInput.addEventListener(
    "keypress",
    function (e) {

        if (
            e.key === "Enter"
        ) {

            searchBook();

        }

    }
);

// ======================
// SEARCH DARI HOME
// ======================

const keyword =
    localStorage.getItem(
        "searchKeyword"
    );

if (keyword) {

    searchInput.value =
        keyword;

    currentBooks =
        books.filter(book =>

            book.judul
                .toLowerCase()
                .includes(
                    keyword.toLowerCase()
                )

            ||

            book.penulis
                .toLowerCase()
                .includes(
                    keyword.toLowerCase()
                )

            ||

            book.kategori
                .toLowerCase()
                .includes(
                    keyword.toLowerCase()
                )

        );

}

// ======================
// PAGINATION CLICK
// ======================

document.addEventListener(
    "click",
    function (e) {

        if (
            e.target.classList.contains(
                "page-btn"
            )
        ) {

            currentPage =
                Number(
                    e.target.dataset.page
                );

            renderBooks(
                currentBooks
            );

        }

    }
);

// ======================
// PINJAM
// ======================

document.addEventListener(
    "click",
    function (e) {

        // Button Pinjam langsung (kartu katalog)
        if (
            e.target.classList.contains(
                "btn-pinjam"
            )
        ) {

            const id =
                Number(
                    e.target.dataset.id
                );

            const book =
                books.find(
                    b => b.id === id
                );

            localStorage.setItem(
                "selectedBook",
                JSON.stringify(book)
            );

            window.location.href =
                "peminjaman.html";

        }

        // Button Pinjam di dalam modal detail
        if (
            e.target.classList.contains(
                "btn-pinjam-modal"
            )
        ) {

            const id =
                Number(
                    e.target.dataset.id
                );

            const book =
                books.find(
                    b => b.id === id
                );

            localStorage.setItem(
                "selectedBook",
                JSON.stringify(book)
            );

            window.location.href =
                "peminjaman.html";

        }

    }
);


function pinjamBuku(id) {
    const allBooks = getBooks();

    const book = allBooks.find(
        b => b.id === id
    );

    localStorage.setItem(
        "selectedBook",
        JSON.stringify(book)
    );

    window.location.href =
        "peminjaman.html";
}

// ======================
// DETAIL BUKU
// ======================

document.addEventListener(
    "click",
    function (e) {

        if (
            e.target.classList.contains(
                "btn-detail"
            )
        ) {

            const id =
                Number(
                    e.target.dataset.id
                );

            const book =
                books.find(
                    b => b.id === id
                );

            showBookDetail(book);

        }

    }
);

function showBookDetail(book) {

    const modal =
        document.getElementById(
            "bookModal"
        );

    const modalBody =
        document.getElementById(
            "modalBody"
        );

    modalBody.innerHTML = `

        <img
            src="${book.cover}"
            alt="${book.judul}"
        >

        <div class="modal-info">

            <h2>
                ${book.judul}
            </h2>

            <p>
                <strong>Penulis:</strong>
                ${book.penulis}
            </p>

            <p>
                <strong>Kategori:</strong>
                ${book.kategori}
            </p>

            <p>
                <strong>Stok:</strong>
                ${book.stok}
            </p>

            <p>
                ${book.deskripsi}
            </p>

            <div class="modal-actions">

                <button
                    class="btn-pinjam-modal"
                    data-id="${book.id}"
                >
                    Pinjam Buku
                </button>

                <button
                    id="closeModalBtn"
                    class="btn-close-modal"
                >
                    Tutup
                </button>

            </div>

        </div>

    `;

    modal.style.display =
        "flex";

}

document.addEventListener(
    "click",
    function (e) {

        if (
            e.target.id ===
            "closeModalBtn"
            ||
            e.target.id ===
            "closeModal"
        ) {

            document.getElementById(
                "bookModal"
            ).style.display =
                "none";

        }

    }
);

// ======================
// HAMBURGER
// ======================

const hamburger =
    document.getElementById(
        "hamburger"
    );

const navMenu =
    document.getElementById(
        "navMenu"
    );

hamburger.addEventListener(
    "click",
    () => {

        navMenu.classList.toggle(
            "show"
        );

    }
);

// ======================
// LOAD PERTAMA
// ======================

renderBooks(
    currentBooks
);