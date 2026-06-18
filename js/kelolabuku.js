// ======================
// ELEMENT
// ======================

const bookGrid = document.getElementById("bookGrid");

const modal = document.getElementById("bookModal");

const addBookBtn = document.getElementById("addBookBtn");

const saveBtn = document.getElementById("saveBtn");

const cancelBtn = document.getElementById("cancelBtn");

// ======================
// LOAD BOOKS
// ======================

function renderBooks() {
    const books = getBooks();

    bookGrid.innerHTML = "";

    books.forEach((book) => {
        bookGrid.innerHTML += `
        
        <div class="admin-book-card">

            <img
                src="${book.cover}"
                alt="${book.judul}"
            >

            <h4>
                ${book.judul}
            </h4>

            <p>
                ${book.penulis}
            </p>

            <small>
                Stok : ${book.stok}
            </small>

            <div class="card-actions">

                <button
                    class="btn-edit"
                    data-id="${book.id}"
                >
                    Edit
                </button>

                <button
                    class="btn-delete"
                    data-id="${book.id}"
                >
                    Hapus
                </button>

            </div>

        </div>
        
        `;
    });
}

// ======================
// BUKA MODAL TAMBAH
// ======================

addBookBtn.addEventListener("click", () => {
    document.getElementById("modalTitle").textContent = "Tambah Buku";

    document.getElementById("bookId").value = "";

    document.getElementById("judul").value = "";

    document.getElementById("penulis").value = "";

    document.getElementById("kategori").value = "";

    document.getElementById("stok").value = 1;

    document.getElementById("cover").value = "";
    const coverFileInput = document.getElementById('coverFile');
    if (coverFileInput) coverFileInput.value = '';

    document.getElementById("deskripsi").value = "";

    modal.style.display = "flex";
});

// ======================
// TUTUP MODAL
// ======================

cancelBtn.addEventListener("click", () => {
    modal.style.display = "none";
});

// ======================
// SIMPAN BUKU
// ======================

saveBtn.addEventListener("click", () => {
    let books = getBooks();

    const id = document.getElementById("bookId").value;

    const judul = document.getElementById("judul").value.trim();

    const penulis = document.getElementById("penulis").value.trim();

    const kategori = document.getElementById("kategori").value.trim();

    const stok = Number(document.getElementById("stok").value);

    const cover = document.getElementById("cover").value.trim();
    const coverFileInput = document.getElementById('coverFile');

    const deskripsi = document.getElementById("deskripsi").value.trim();

    if (!judul || !penulis || !kategori || !deskripsi) {
        alert("Lengkapi data buku");

        return;
    }

    function persistWithCover(coverValue) {
        if (id) {
            const index = books.findIndex((b) => b.id == id);

            books[index] = {
                ...books[index],
                judul,
                penulis,
                kategori,
                stok,
                cover: coverValue,
                deskripsi,
            };
        } else {
            const nextId = books.length ? Math.max(...books.map((b) => b.id)) + 1 : 1;

            books.unshift({
                id: nextId,

                judul,

                penulis,

                kategori,

                stok,

                cover: coverValue,

                deskripsi,

                populer: false,

                unggulan: false,
            });
        }

        saveBooks(books);

        modal.style.display = "none";

        renderBooks();
    }

    if (id) {
        // handled below by persistWithCover
    }

    // if a file was selected, read it as data URL then persist
    if (coverFileInput && coverFileInput.files && coverFileInput.files[0]) {
        const file = coverFileInput.files[0];
        const reader = new FileReader();
        reader.onload = function (e) {
            persistWithCover(e.target.result);
        };
        reader.readAsDataURL(file);
    } else {
        // use cover text input or empty
        persistWithCover(cover || '');
    }
});

// ======================
// EDIT
// ======================

document.addEventListener(
    "click",

    function (e) {
        if (e.target.classList.contains("btn-edit")) {
            const id = Number(e.target.dataset.id);

            const books = getBooks();

            const book = books.find((b) => b.id === id);

            if (!book) return;

            document.getElementById("modalTitle").textContent = "Edit Buku";

            document.getElementById("bookId").value = book.id;

            document.getElementById("judul").value = book.judul;

            document.getElementById("penulis").value = book.penulis;

            document.getElementById("kategori").value = book.kategori;

            document.getElementById("stok").value = book.stok;

            document.getElementById("cover").value = book.cover;

            const coverFileInput = document.getElementById('coverFile');
            if (coverFileInput) coverFileInput.value = '';

            document.getElementById("deskripsi").value = book.deskripsi;

            modal.style.display = "flex";
        }
    },
);

// ======================
// HAPUS
// ======================

document.addEventListener(
    "click",

    function (e) {
        if (e.target.classList.contains("btn-delete")) {
            const id = Number(e.target.dataset.id);

            const confirmDelete = confirm("Hapus buku ini?");

            if (!confirmDelete) return;

            let books = getBooks();

            books = books.filter((b) => b.id !== id);

            saveBooks(books);

            renderBooks();
        }
    },
);

// ======================
// CLOSE MODAL CLICK
// ======================

window.addEventListener(
    "click",

    function (e) {
        if (e.target === modal) {
            modal.style.display = "none";
        }
    },
);

// ======================
// LOAD
// ======================

renderBooks();
