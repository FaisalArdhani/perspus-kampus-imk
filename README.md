# 📚 PerpusKampus - Sistem Perpustakaan Digital

## Deskripsi

PerpusKampus adalah aplikasi perpustakaan berbasis web yang dibuat menggunakan HTML, CSS, dan JavaScript tanpa database eksternal. Seluruh data disimpan menggunakan LocalStorage sehingga aplikasi dapat dijalankan secara lokal melalui browser.

Aplikasi memiliki dua jenis pengguna:

* Admin
* User (Mahasiswa)

Admin dapat mengelola buku, pengguna, peminjaman, pengembalian, denda, dan laporan.

User dapat melihat katalog buku, meminjam buku, mengembalikan buku, melihat riwayat peminjaman, serta menerima notifikasi.

---

# 🚀 Fitur Utama

## 👨‍💼 Admin

### Dashboard

* Melihat statistik perpustakaan
* Total buku
* Total pengguna
* Total peminjaman
* Statistik peminjaman

### Kelola Buku

* Tambah buku
* Edit buku
* Hapus buku
* Cari buku
* Kelola stok buku

### Peminjaman

* Melihat permintaan peminjaman
* Menyetujui peminjaman
* Menolak peminjaman
* Mengelola pengembalian buku
* Memberikan peringatan keterlambatan

### Denda

* Melihat daftar denda
* Mengelola pembayaran denda

### Pengguna

* Melihat daftar pengguna
* Menambah pengguna
* Mengedit pengguna
* Menghapus pengguna

### Laporan

* Statistik perpustakaan
* Riwayat peminjaman
* Riwayat pengembalian

### Notifikasi

* Mengirim notifikasi ke pengguna
* Melihat notifikasi sistem

---

## 👨‍🎓 User

### Dashboard

* Melihat ringkasan akun

### Katalog Buku

* Melihat daftar buku
* Mencari buku
* Melihat detail buku

### Peminjaman Buku

* Mengajukan peminjaman
* Melihat status peminjaman

### Riwayat

* Melihat riwayat peminjaman
* Melihat riwayat pengembalian

### Denda

* Melihat denda yang dimiliki

### Notifikasi

* Menerima notifikasi dari admin

---

# 🛠 Teknologi yang Digunakan

* HTML5
* CSS3
* JavaScript (Vanilla JS)
* LocalStorage
* SessionStorage

---

# 📂 Struktur Folder

```text
project/
│
├── index.html
├── login.html
│
├── admin/
│   ├── dashboard.html
│   ├── buku.html
│   ├── peminjaman.html
│   ├── pengguna.html
│   ├── denda.html
│   ├── laporan.html
│   └── notifikasi.html
│
├── user/
│   ├── dashboard.html
│   ├── katalog.html
│   ├── peminjaman.html
│   ├── riwayat.html
│   ├── denda.html
│   └── notifikasi.html
│
├── assets/
│   ├── css/
│   ├── js/
│   └── images/
│
└── README.md
```

---

# ▶ Cara Menjalankan

## Metode 1 (VS Code + Live Server)

1. Buka folder project di VS Code
2. Install extension Live Server
3. Klik kanan file login.html
4. Pilih "Open with Live Server"
5. Browser akan terbuka otomatis

---

## Metode 2 (Tanpa Live Server)

1. Download project
2. Extract project
3. Buka file login.html menggunakan browser

Catatan:
Beberapa fitur akan bekerja lebih stabil menggunakan Live Server.

---

# 🔑 Akun Login

## Admin

Email:
[admin@perpuskampus.com](mailto:admin@perpuskampus.com)

Password:
admin123

---

## User

Email:
[user@perpuskampus.com](mailto:user@perpuskampus.com)

Password:
user123

---

# 💾 Penyimpanan Data

Aplikasi menggunakan LocalStorage untuk menyimpan:

* Data buku
* Data pengguna
* Data peminjaman
* Data pengembalian
* Data denda
* Data notifikasi

Jika ingin mereset data:

1. Buka Developer Tools (F12)
2. Application
3. Local Storage
4. Hapus seluruh data

Atau jalankan:

```javascript
localStorage.clear();
location.reload();
```

---

# 📌 Catatan

* Tidak menggunakan database MySQL.
* Tidak memerlukan backend.
* Cocok untuk tugas kuliah, pembelajaran JavaScript, dan simulasi sistem perpustakaan.
* Seluruh data disimpan pada browser pengguna.

---

# 👨‍💻 Pengembang

Nama:
Faisal Ardhani

Universitas:
Universitas Pamulang (UNPAM)

Program Studi:
Teknik Informatika

Tahun:
2026
