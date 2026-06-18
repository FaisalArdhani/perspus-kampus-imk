// ======================
// CARD BUKU UNIVERSAL
// ======================

function createBookCard(book) {

    return `

        <div class="book-card">

            <img
                src="${book.cover}"
                alt="${book.judul}"
            >

            <div class="book-info">

                <h3>
                    ${book.judul}
                </h3>

                <p>
                    ${book.penulis}
                </p>

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